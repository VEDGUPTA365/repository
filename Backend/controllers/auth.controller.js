import { User } from "../models/user.model.js";
import { Op } from "sequelize";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import bcryptjs from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const checkAuthController = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.userId, { attributes: { exclude: ["password"] } });
  if (!user) return next(new AppError("User not found", 404));
  res.status(200).json({ success: true, user });
});

export const signupController = asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) return next(new AppError("All fields are required", 400));

  const userAlreadyExists = await User.findOne({ where: { email } });
  if (userAlreadyExists) return next(new AppError("User already exists", 400));

  const hashedPassword = await bcryptjs.hash(password, 10);
  const user = new User({ email, password: hashedPassword, name });
  await user.save();

  generateTokenAndSetCookie(res, user.id);
  res.status(201).json({
    success: true,
    msg: "User created successfully",
    user: { ...user.toJSON(), password: undefined },
  });
});

export const loginController = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return next(new AppError("Invalid Credentials", 400));

  const isPassCorrect = await bcryptjs.compare(password, user.password);
  if (!isPassCorrect) return next(new AppError("Invalid Credentials", 400));

  generateTokenAndSetCookie(res, user.id);
  user.lastLogin = new Date();
  await user.save();

  res.status(200).json({
    success: true,
    msg: "Logged in successfully!",
    user: { ...user.toJSON(), password: undefined },
  });
});

export const logoutController = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const deleteUserAccount = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  if (!user) return next(new AppError("User not found", 404));

  await user.destroy();
  res.clearCookie("token");
  res.status(200).json({ success: true, msg: "Account deleted" });
});

import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if(!token) {
    return next(new AppError("Unauthorized - No token", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);    
    if(!decoded) {
      return next(new AppError("Unauthorized - Invalid token", 401));
    }
    
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return next(new AppError("Error verifying token", 401));
  }
}
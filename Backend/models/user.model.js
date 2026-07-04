import { DataTypes } from 'sequelize';
import { sequelize } from '../connectDB.js';

export const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: true },
  lastLogin: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  resetPasswordToken: { type: DataTypes.STRING },
  resetPasswordExpiresAt: { type: DataTypes.DATE },
}, {
  timestamps: true
});
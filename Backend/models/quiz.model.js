import { DataTypes } from 'sequelize';
import { sequelize } from '../connectDB.js';

export const Quiz = sequelize.define('Quiz', {
  title: { type: DataTypes.STRING, allowNull: false },
  questions: { type: DataTypes.JSONB, defaultValue: [] },
  userId: { type: DataTypes.INTEGER, allowNull: true },
  shareToken: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

import { DataTypes } from 'sequelize';
import { sequelize } from '../connectDB.js';

export const Quiz = sequelize.define('Quiz', {
  title: { type: DataTypes.STRING, allowNull: false },
  questions: { type: DataTypes.JSONB, defaultValue: [] },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

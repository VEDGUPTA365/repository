import { DataTypes } from 'sequelize';
import { sequelize } from '../connectDB.js';
import { randomUUID } from 'crypto';

export const Quiz = sequelize.define('Quiz', {
  title: { type: DataTypes.STRING, allowNull: false },
  questions: { type: DataTypes.JSONB, defaultValue: [] },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  shareToken: { type: DataTypes.UUID, defaultValue: randomUUID, unique: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgres://postgres:postgres@localhost:5432/quizify';
const isLocal = dbUrl.includes('localhost');

export const sequelize = new Sequelize(dbUrl, {
  logging: false,
  dialectOptions: isLocal ? {} : {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected');
    await sequelize.sync({ alter: true }); // Sync models
    return true;
  } catch (error) {
    console.log("Error connection to PostgreSQL: ", error.message);
    return false;
  }
};
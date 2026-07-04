import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
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
    await sequelize.sync({ alter: true });

    // Backfill shareToken for any existing quizzes with NULL shareToken
    try {
      // Try Postgres built-in UUID generator first (fastest)
      await sequelize.query(
        `UPDATE "Quizzes" SET "shareToken" = gen_random_uuid() WHERE "shareToken" IS NULL`
      );
    } catch (_) {
      // Fallback: generate UUIDs in JS if gen_random_uuid() isn't available
      const [rows] = await sequelize.query(
        `SELECT id FROM "Quizzes" WHERE "shareToken" IS NULL`
      );
      for (const row of rows) {
        await sequelize.query(
          `UPDATE "Quizzes" SET "shareToken" = :token WHERE id = :id`,
          { replacements: { token: randomUUID(), id: row.id } }
        );
      }
      if (rows.length > 0) console.log(`Backfilled shareToken for ${rows.length} quizzes`);
    }

    return true;
  } catch (error) {
    const maskedUrl = dbUrl.replace(/:[^:@]*@/, ':****@');
    console.error("=== POSTGRES CONNECTION ERROR ===");
    console.error("Attempted to connect to:", maskedUrl);
    console.error("Error details:", error);
    console.error("=================================");
    return false;
  }
};

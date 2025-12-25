import dotenv from "dotenv"
dotenv.config()

export const EnvConfig = {
  MONGO_DB_CONNECTION_URL: process.env.MONGO_DB_CONNECTION_URL,
  MONGO_DB_PASSWORD: process.env.MONGO_DB_PASSWORD,
  MONGO_DB_USERNAME: process.env.MONGO_DB_USERNAME,
  JWT_SECRETE: process.env.JWT_SECRETE,
};
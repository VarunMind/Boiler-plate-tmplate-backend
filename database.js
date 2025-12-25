import mongoose from "mongoose";
import { EnvConfig } from "./config/EnvConfig.js";

export default function connectToDatabase() {
  const db_url = EnvConfig.MONGO_DB_CONNECTION_URL;

  try {
    mongoose.connect(db_url, {
      serverSelectionTimeoutMS: 5000,
      tls: true,
      tlsAllowInvalidCertificates: false,
      retryWrites: true,
    });
    console.log("Connected To The Db Successfully");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

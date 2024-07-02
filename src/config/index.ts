import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3301;
export const HOST_NAME = process.env.HOST_NAME || "127.0.0.1";

/** ---> Database credentials. */
export const MONGO_DB_URL =
  process.env.MONGO_DB_URL || "mongodb://127.0.0.1:27017";

/** ---> jwt secrets. */
export const JWT_SECRET = process.env.JWT_SECRET!;

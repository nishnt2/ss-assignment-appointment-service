import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import "dotenv/config";

export const DB_NAME = process.env.MONGO_DB || "books";
let uri = `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}`;

mongoose.set("strictQuery", true);

if (process.env.NODE_ENV !== "development") {
  uri = `my-mongo://${encodeURIComponent(
    process.env.MONGO_USER
  )}:${encodeURIComponent(process.env.MONGO_PASS)}@${process.env.MONGO_HOST}/${
    process.env.MONGO_DB
  }?authSource=${process.env.MONGO_DB}`;
}

const client = new MongoClient(uri, {
  appName: "doctor",
});

export async function pingMongodb() {
  try {
    console.log("CONNECTING", uri);
    await mongoose.connect(uri);
    console.log("MONGODB CONNNECTION SUCCESSFUL");
  } catch (err) {
    console.log("MONGODB CONNNECTION FAILED");
    process.exit(1);
  }
}

export { client as mongoclient };

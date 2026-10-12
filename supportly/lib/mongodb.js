import mongoose from "mongoose";

const cached = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalThis.mongooseCache = cached;

export default async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
  }

  // Reuse a healthy connection.
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Discard a stale cached connection or promise.
  if (mongoose.connection.readyState === 0 && cached.conn) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 15000,
        maxPoolSize: 10,
      })
      .then((instance) => instance)
      .catch((error) => {
        cached.conn = null;
        cached.promise = null;

        console.error("MongoDB connection failed:", {
          name: error.name,
          message: error.message,
          code: error.code,
        });

        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.conn = null;
    cached.promise = null;
    throw error;
  }
}
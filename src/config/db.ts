import mongoose from "mongoose";

// Cache the connection so serverless invocations (Vercel) reuse it
// instead of opening a new one on every request.
let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) return; // already connected

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is missing");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    const connection = await connectionPromise;
    console.log(`🍃 MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    connectionPromise = null; // let the next request retry
    console.error(`❌ MongoDB Connection Error: ${(error as Error).message}`);
    throw error; // don't process.exit() — it kills the serverless function
  }
};

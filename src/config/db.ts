import mongoose from "mongoose";

export const connectDB = async():Promise<void>=>{
    try {
        const mongoUri = process.env.MONGO_URI
        if(!mongoUri){
            throw new Error("MONGO_URI environment variable is missing")
        }
        const connection = await mongoose.connect(mongoUri)
        console.log(`🍃 MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${(error as Error).message}`);
        process.exit(1);   
    }
}
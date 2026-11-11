import app from "./app";
import dotenv from 'dotenv';
import { connectDB } from "./config/db";
import { cache } from "./utils/cache"; // Cache import karein

dotenv.config();
const PORT = process.env.PORT;


// 1. Connect to Database first, then start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    
    });
  })
  .catch((error) => {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  });
// Local development entry point (npm run dev / npm start).
// On Vercel this file is not used — src/app.ts is served directly.
import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 3000;

// Connect to Database first, then start the server
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

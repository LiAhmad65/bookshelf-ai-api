import express, {Express, Request, Response} from 'express';
import userRoutes from "./routes/user.routes";
import bookRoutes from "./routes/book.routes";
import aiRoutes from "./routes/ai.routes";
import cors from 'cors';

const app:Express = express()

app.use(express.json())

// Configure CORS to allow requests from Vite
app.use(
  cors({
    origin: 'http://localhost:5173', // Your React/Vite dev server URL
    credentials: true,
  })
);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send(`
    <!進入html>
    <html>
      <head>
        <title>Server Health</title>
        <style>
          body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f4f9; }
          .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
          .status { color: #2e7d32; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Server Status: <span class="status">OK</span></h1>
          <p>Server is up and running!</p>
          <small>Timestamp: ${new Date().toISOString()}</small>
        </div>
      </body>
    </html>
  `);
});

// API routes
app.use('/users',userRoutes)
app.use('/books',bookRoutes)
app.use('/ai',aiRoutes)

export default app;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import roadmapRoutes from './routes/roadmap.js';

// Load environment variables from root or server .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

loadEnv();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.use('/api/health', (req, res) => {
  loadEnv();
  const apiKey = process.env.GEMINI_API_KEY;
  const apiKeyConfigured = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here');
  
  res.status(200).json({
    status: 'online',
    service: 'SkillPath AI Backend',
    port: PORT,
    model: process.env.GEMINI_MODEL || 'gemma-2-27b-it',
    apiKeyConfigured,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', roadmapRoutes);

// Root fallback
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: system-ui, sans-serif; padding: 40px; background: #0f172a; color: #f8fafc; min-height: 100vh;">
      <h1 style="color: #6366f1;">⚡ SkillPath AI Server is Running</h1>
      <p>Use the React frontend client or send POST requests to <code>/api/generate-roadmap</code></p>
      <hr style="border-color: #334155;" />
      <p>Health endpoint: <a href="/api/health" style="color: #38bdf8;">/api/health</a></p>
    </div>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`
┌────────────────────────────────────────────────────────┐
│  ⚡ SkillPath AI Backend Server Running                 │
│  ➜ Local:   http://localhost:${PORT}                      │
│  ➜ Health:  http://localhost:${PORT}/api/health           │
│  ➜ Model:   ${process.env.GEMINI_MODEL || 'gemma-2-27b-it'}                            │
└────────────────────────────────────────────────────────┘
  `);
});

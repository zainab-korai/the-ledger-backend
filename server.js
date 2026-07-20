require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Connect Database
connectDB();

// Initialize app
const app = express();

// Middleware - CORS
// Origins come from ALLOWED_ORIGINS (comma-separated). Set it on Railway to the
// Netlify URL once the frontend is deployed. Use "*" to allow any origin.
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowAnyOrigin = allowedOrigins.includes('*');

app.use(cors({
  // `true` reflects the caller's origin back, which is what "allow all" needs.
  origin: allowAnyOrigin ? true : allowedOrigins,
  // Auth is a Bearer token in the Authorization header, not a cookie, so
  // credentials aren't needed. Browsers also reject a wildcard origin when
  // credentials are enabled, so this must stay off in allow-all mode.
  credentials: !allowAnyOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Test route
app.get('/health', (req, res) => {
  res.json({ status: '✅ Server running!' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/invoices', require('./routes/invoices'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
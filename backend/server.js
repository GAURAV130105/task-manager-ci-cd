const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const client = require('prom-client');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskdb';

// ─────────────────────────────────────────────
// Prometheus Metrics Setup
// ─────────────────────────────────────────────

// Collect default Node.js metrics (memory, CPU, event loop lag, etc.)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'taskmanager_' });

// Custom: HTTP request counter (counts requests per method + route + status)
const httpRequestCounter = new client.Counter({
  name: 'taskmanager_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// Custom: HTTP response duration histogram (tracks how long each request takes)
const httpRequestDuration = new client.Histogram({
  name: 'taskmanager_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 1.5, 2, 5],
});

// Middleware: Start a timer on every incoming request
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const route = req.route ? req.route.path : req.path;
    httpRequestCounter.inc({
      method: req.method,
      route: route,
      status_code: res.statusCode,
    });
    end({ method: req.method, route: route, status_code: res.statusCode });
  });
  next();
});

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────
app.use(cors({
  // Allow all origins — safe because port 5000 is blocked by Azure NSG.
  // Only the frontend Nginx container (on the same Docker network) reaches the backend.
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running!', status: 'ok' });
});

// Prometheus metrics endpoint — scraped by Prometheus every 15 seconds
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Task routes
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// ─────────────────────────────────────────────
// Connect to MongoDB and start server
// ─────────────────────────────────────────────
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Metrics available at http://localhost:${PORT}/metrics`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

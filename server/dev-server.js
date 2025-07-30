import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import xml2js from 'xml2js';

// Import the serverless functions directly
import crawlSitemapHandler from '../api/crawl-sitemap.js';
import auditHandler from '../api/audit.js';
import batchAuditHandler from '../api/batch-audit.js';
import testHandler from '../api/test.js';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Wrapper function to adapt serverless functions to Express
function adaptServerlessFunction(handler) {
  return async (req, res) => {
    try {
      // Create a mock serverless environment
      const mockReq = {
        method: req.method,
        headers: req.headers,
        body: req.body,
        query: req.query,
        url: req.url
      };

      const mockRes = {
        setHeader: (key, value) => res.setHeader(key, value),
        status: (code) => {
          res.statusCode = code;
          return mockRes;
        },
        json: (data) => res.json(data),
        end: () => res.end()
      };

      await handler(mockReq, mockRes);
    } catch (error) {
      console.error(`Error in ${req.path}:`, error);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  };
}

// Mount the API routes
app.use('/api/crawl-sitemap', adaptServerlessFunction(crawlSitemapHandler));
app.use('/api/audit', adaptServerlessFunction(auditHandler));
app.use('/api/batch-audit', adaptServerlessFunction(batchAuditHandler));
app.use('/api/test', adaptServerlessFunction(testHandler));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT 
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    availableRoutes: [
      'GET /health',
      'GET /api/test',
      'POST /api/crawl-sitemap',
      'POST /api/audit',
      'POST /api/batch-audit'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Development SEO Audit Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available:`);
  console.log(`   - GET  /health`);
  console.log(`   - GET  /api/test`);
  console.log(`   - POST /api/crawl-sitemap`);
  console.log(`   - POST /api/audit`);
  console.log(`   - POST /api/batch-audit`);
  console.log(`🔧 This server uses the same logic as the serverless functions`);
});
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import xml2js from 'xml2js';

const app = express();
const PORT = process.env.PORT || 3004;

console.log('Starting simple development server...');

app.use(cors());
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Enhanced headers to mimic real browsers
const getBrowserHeaders = () => ({
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'DNT': '1',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Cache-Control': 'max-age=0'
});

// Add delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simple test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({
    message: 'Development API is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.url
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT 
  });
});

// Sitemap crawler endpoint
app.post('/api/crawl-sitemap', async (req, res) => {
  console.log('Crawl sitemap endpoint called');
  try {
    const { sitemapUrl } = req.body;
    
    if (!sitemapUrl) {
      return res.status(400).json({ error: 'Sitemap URL is required' });
    }

    console.log(`Starting sitemap crawl for: ${sitemapUrl}`);
    
    const response = await axios.get(sitemapUrl, {
      timeout: 8000,
      headers: getBrowserHeaders(),
      maxRedirects: 5,
      validateStatus: function (status) {
        return status >= 200 && status < 400;
      }
    });

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    
    let urls = [];
    
    // Handle sitemap index
    if (result.sitemapindex && result.sitemapindex.sitemap) {
      console.log(`Found sitemap index with ${result.sitemapindex.sitemap.length} sitemaps`);
      
      // Limit to first 8 sitemaps for development
      const sitemapsToProcess = result.sitemapindex.sitemap.slice(0, 8);
      console.log(`Processing first ${sitemapsToProcess.length} sitemaps (out of ${result.sitemapindex.sitemap.length} total)`);
      
      for (let i = 0; i < sitemapsToProcess.length && urls.length < 1000; i++) {
        const sitemap = sitemapsToProcess[i];
        try {
          console.log(`Processing sitemap ${i + 1}/${sitemapsToProcess.length}: ${sitemap.loc[0]}`);
          await delay(Math.random() * 300 + 200);
          
          const sitemapResponse = await axios.get(sitemap.loc[0], {
            timeout: 8000,
            headers: getBrowserHeaders(),
            maxRedirects: 5
          });
          
          const sitemapResult = await parser.parseStringPromise(sitemapResponse.data);
          
          if (sitemapResult.urlset && sitemapResult.urlset.url) {
            const sitemapUrls = sitemapResult.urlset.url.map(url => ({
              loc: url.loc[0],
              lastmod: url.lastmod ? url.lastmod[0] : null,
              changefreq: url.changefreq ? url.changefreq[0] : null,
              priority: url.priority ? parseFloat(url.priority[0]) : null
            }));
            
            console.log(`Found ${sitemapUrls.length} URLs in ${sitemap.loc[0]}`);
            urls.push(...sitemapUrls);
          }
        } catch (error) {
          console.error(`Failed to fetch sitemap ${sitemap.loc[0]}:`, error.message);
        }
      }
    }
    // Handle single sitemap
    else if (result.urlset && result.urlset.url) {
      urls = result.urlset.url.map(url => ({
        loc: url.loc[0],
        lastmod: url.lastmod ? url.lastmod[0] : null,
        changefreq: url.changefreq ? url.changefreq[0] : null,
        priority: url.priority ? parseFloat(url.priority[0]) : null
      }));
    }

    console.log(`Sitemap crawl completed. Found ${urls.length} total URLs`);
    res.json({ urls, total: urls.length });
  } catch (error) {
    console.error('Sitemap crawl error:', error.message);
    res.status(500).json({ error: 'Failed to crawl sitemap: ' + error.message });
  }
});

// Simple batch audit endpoint (using axios only, no Puppeteer)
app.post('/api/batch-audit', async (req, res) => {
  console.log('Batch audit endpoint called');
  try {
    const { urls } = req.body;
    
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: 'URLs array is required' });
    }

    console.log(`Processing ${urls.length} URLs for batch audit`);
    const results = [];
    const maxUrls = Math.min(urls.length, 15); // Limit to 15 URLs for development
    const urlsToProcess = urls.slice(0, maxUrls);
    
    console.log(`Will process ${urlsToProcess.length} URLs (limited from ${urls.length})`);

    for (let i = 0; i < urlsToProcess.length; i++) {
      const urlData = urlsToProcess[i];
      const url = urlData.loc || urlData;
      try {
        console.log(`Auditing ${i + 1}/${urlsToProcess.length}: ${url}`);
        
        const startTime = Date.now();
        const response = await axios.get(url, {
          timeout: 8000,
          headers: getBrowserHeaders(),
          maxRedirects: 5,
          validateStatus: function (status) {
            return status >= 200 && status < 400;
          }
        });
        const loadTime = Date.now() - startTime;

        const $ = cheerio.load(response.data);

        // Basic SEO analysis
        const title = $('title').text().trim();
        const metaDescription = $('meta[name="description"]').attr('content') || '';
        const h1Count = $('h1').length;
        const images = $('img');
        const imagesWithoutAlt = images.filter((i, el) => !$(el).attr('alt')).length;

        // Simple scoring
        let score = 100;
        const issues = [];

        if (!title) {
          score -= 15;
          issues.push('Missing page title');
        }
        if (!metaDescription) {
          score -= 15;
          issues.push('Missing meta description');
        }
        if (h1Count === 0) {
          score -= 15;
          issues.push('Missing H1 tag');
        }
        if (imagesWithoutAlt > 0) {
          score -= Math.min(15, imagesWithoutAlt * 2);
          issues.push(`${imagesWithoutAlt} images missing alt text`);
        }

        const audit = {
          url,
          score: Math.max(0, score),
          issues,
          metrics: {
            title: { content: title, present: !!title },
            metaDescription: { content: metaDescription, present: !!metaDescription },
            performance: { loadTime },
            images: { total: images.length, withoutAlt: imagesWithoutAlt }
          },
          timestamp: new Date().toISOString()
        };

        console.log(`Audit completed for ${url}, score: ${audit.score}`);
        results.push({ url, audit, status: 'success' });

        // Add small delay between requests (reduced for development)
        await delay(300);

      } catch (error) {
        console.error(`Failed to audit ${url}:`, error.message);
        results.push({ url, error: error.message, status: 'error' });
      }
    }

    const responseData = {
      results,
      total: results.length,
      processed: results.length,
      skipped: urls.length - maxUrls,
      note: urls.length > maxUrls ? `Limited to ${maxUrls} URLs for development performance` : undefined
    };

    console.log(`Batch audit completed. ${results.length} results`);
    res.json(responseData);

  } catch (error) {
    console.error('Batch audit error:', error.message);
    res.status(500).json({ error: 'Failed to perform batch audit: ' + error.message });
  }
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
      'POST /api/batch-audit'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple Development Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available:`);
  console.log(`   - GET  /health`);
  console.log(`   - GET  /api/test`);
  console.log(`   - POST /api/crawl-sitemap`);
  console.log(`   - POST /api/batch-audit`);
  console.log(`🔧 This is a simplified server for development (no Puppeteer)`);
});
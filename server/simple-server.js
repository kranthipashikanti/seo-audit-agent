import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import xml2js from 'xml2js';
import { getIssueResolution, calculateSEOScore } from '../api/audit-utils.js';

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

        // Enhanced scoring with detailed resolutions
        let score = 100;
        const issues = [];
        const issuesWithResolutions = [];

        // Helper function to add issue with resolution
        const addIssue = (issueText, scoreDeduction) => {
          score -= scoreDeduction;
          issues.push(issueText);
          const resolution = getIssueResolution(issueText);
          issuesWithResolutions.push({
            issue: issueText,
            scoreImpact: scoreDeduction,
            ...resolution
          });
        };

        // Enhanced SEO checks
        const canonical = $('link[rel="canonical"]').attr('href') || '';
        const viewportMeta = $('meta[name="viewport"]').attr('content') || '';
        const isMobileFriendly = viewportMeta.includes('width=device-width');
        const schemaMarkup = $('script[type="application/ld+json"]').length > 0;
        const wordCount = $('body').text().split(/\s+/).filter(word => word.length > 0).length;
        const httpsCheck = url.startsWith('https://');
        const metaCharset = $('meta[charset]').attr('charset') || '';
        const favicon = $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').length > 0;
        const languageDeclaration = $('html').attr('lang') || '';
        const ogTitle = $('meta[property="og:title"]').attr('content') || '';
        const ogDescription = $('meta[property="og:description"]').attr('content') || '';
        const ogImage = $('meta[property="og:image"]').attr('content') || '';
        const allLinks = $('a[href]');
        const internalLinks = allLinks.filter((i, el) => {
          const href = $(el).attr('href');
          return href && (href.startsWith('/') || href.includes(new URL(url).hostname));
        }).length;

        // Apply comprehensive SEO checks
        if (!title) {
          addIssue('Missing page title', 15);
        } else if (title.length < 30 || title.length > 60) {
          addIssue('Title length not optimal (30-60 characters)', 10);
        }

        if (!metaDescription) {
          addIssue('Missing meta description', 15);
        } else if (metaDescription.length < 120 || metaDescription.length > 160) {
          addIssue('Meta description length not optimal (120-160 characters)', 10);
        }

        if (h1Count === 0) {
          addIssue('Missing H1 tag', 15);
        } else if (h1Count > 1) {
          addIssue('Multiple H1 tags found', 10);
        }

        if (imagesWithoutAlt > 0) {
          const scoreDeduction = Math.min(15, imagesWithoutAlt * 2);
          addIssue(`${imagesWithoutAlt} images missing alt text`, scoreDeduction);
        }

        if (!canonical) {
          addIssue('Missing canonical URL', 5);
        }

        if (!isMobileFriendly) {
          addIssue('Missing mobile-friendly viewport meta tag', 10);
        }

        if (loadTime > 3000) {
          addIssue('Page load time exceeds 3 seconds', 10);
        }

        if (!schemaMarkup) {
          addIssue('No structured data (Schema.org) found', 5);
        }

        if (wordCount < 300) {
          addIssue('Content is too short (less than 300 words)', 10);
        }

        if (!httpsCheck) {
          addIssue('Website not using HTTPS/SSL', 20);
        }

        if (!metaCharset) {
          addIssue('Missing charset declaration', 5);
        }

        if (!favicon) {
          addIssue('Missing favicon', 3);
        }

        if (!languageDeclaration) {
          addIssue('Missing HTML language declaration', 5);
        }

        if (!ogTitle || !ogDescription) {
          addIssue('Incomplete Open Graph tags (missing title or description)', 8);
        }

        if (!ogImage) {
          addIssue('Missing Open Graph image', 5);
        }

        if (internalLinks === 0) {
          addIssue('No internal links found - poor site navigation', 10);
        }

        if (allLinks.length === 0) {
          addIssue('No links found on page - poor user experience', 15);
        }

        const robotsMeta = $('meta[name="robots"]').attr('content') || '';
        if (robotsMeta.includes('noindex')) {
          addIssue('Page set to noindex - will not appear in search results', 20);
        }

        const h2Count = $('h2').length;
        if (h2Count === 0 && wordCount > 300) {
          addIssue('No H2 headings found - poor content structure', 8);
        }

        // Prepare metrics for comprehensive scoring
        const metrics = {
          title: { content: title, present: !!title, length: title.length },
          metaDescription: { content: metaDescription, present: !!metaDescription, length: metaDescription.length },
          performance: { loadTime },
          images: { total: images.length, withoutAlt: imagesWithoutAlt },
          headings: { h1: h1Count, h2: $('h2').length, h3: $('h3').length },
          links: { total: allLinks.length, internal: internalLinks },
          technical: {
            https: httpsCheck,
            charset: !!metaCharset,
            viewport: isMobileFriendly,
            canonical: !!canonical,
            favicon: favicon,
            language: !!languageDeclaration,
            schema: schemaMarkup
          },
          content: { wordCount },
          social: {
            ogTitle: !!ogTitle,
            ogDescription: !!ogDescription,
            ogImage: !!ogImage
          }
        };

        // Calculate comprehensive SEO score
        const scoreData = calculateSEOScore(metrics);

        const audit = {
          url,
          score: scoreData.totalScore,
          grade: scoreData.grade,
          scoreBreakdown: scoreData.breakdown,
          issues,
          issuesWithResolutions,
          metrics,
          auditMethod: 'axios-cheerio',
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
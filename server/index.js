import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import xml2js from 'xml2js';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Use stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

// SEO Issue Resolutions Database
const SEO_RESOLUTIONS = {
  'Missing page title': {
    priority: 'critical',
    category: 'Title Tags',
    solution: 'Add a unique, descriptive title tag to your page',
    implementation: [
      'Add <title>Your Page Title Here</title> in the <head> section',
      'Keep titles between 30-60 characters for optimal display',
      'Include your primary keyword near the beginning',
      'Make each page title unique across your website'
    ],
    example: '<title>Best SEO Tools 2024 - Complete Guide | YourBrand</title>',
    impact: 'High - Title tags are crucial for search rankings and click-through rates',
    timeToFix: '5 minutes'
  },
  
  'Title length not optimal (30-60 characters)': {
    priority: 'high',
    category: 'Title Tags',
    solution: 'Optimize your title length for better search display',
    implementation: [
      'Shorten titles over 60 characters to prevent truncation',
      'Expand titles under 30 characters to be more descriptive',
      'Focus on your most important keywords first',
      'Use compelling language to improve click-through rates'
    ],
    example: 'Good: "SEO Audit Tool - Free Website Analysis" (42 chars)',
    impact: 'Medium - Proper length ensures full visibility in search results',
    timeToFix: '10 minutes'
  },

  'Missing meta description': {
    priority: 'critical',
    category: 'Meta Tags',
    solution: 'Add a compelling meta description to improve click-through rates',
    implementation: [
      'Add <meta name="description" content="Your description"> in <head>',
      'Write 120-160 characters describing your page content',
      'Include target keywords naturally',
      'Write compelling copy that encourages clicks'
    ],
    example: '<meta name="description" content="Get comprehensive SEO audits for your website. Analyze title tags, meta descriptions, headings, and more with our free tool.">',
    impact: 'High - Meta descriptions directly influence click-through rates',
    timeToFix: '10 minutes'
  },

  'Meta description length not optimal (120-160 characters)': {
    priority: 'medium',
    category: 'Meta Tags',
    solution: 'Adjust meta description length for optimal search display',
    implementation: [
      'Trim descriptions over 160 characters to prevent truncation',
      'Expand descriptions under 120 characters for more detail',
      'Include a clear value proposition',
      'End with a call-to-action when appropriate'
    ],
    example: 'Optimal: "Discover how our SEO audit tool helps improve your website rankings. Get detailed reports on title tags, meta descriptions, and technical SEO issues." (156 chars)',
    impact: 'Medium - Proper length ensures full visibility and better CTR',
    timeToFix: '10 minutes'
  },

  'Missing H1 tag': {
    priority: 'critical',
    category: 'Heading Structure',
    solution: 'Add a descriptive H1 tag to establish page hierarchy',
    implementation: [
      'Add one <h1> tag per page near the top of your content',
      'Make it descriptive of your main page topic',
      'Include your primary keyword when relevant',
      'Keep it different from your title tag for variety'
    ],
    example: '<h1>Complete SEO Audit Guide for 2024</h1>',
    impact: 'High - H1 tags help search engines understand page structure',
    timeToFix: '5 minutes'
  },

  'Multiple H1 tags found': {
    priority: 'medium',
    category: 'Heading Structure',
    solution: 'Use only one H1 tag per page for proper hierarchy',
    implementation: [
      'Keep only the most important H1 tag',
      'Convert additional H1s to H2 or H3 tags',
      'Ensure proper heading hierarchy (H1 → H2 → H3)',
      'Use H1 for the main page topic only'
    ],
    example: 'Change: <h1>Title</h1> <h1>Subtitle</h1> → <h1>Title</h1> <h2>Subtitle</h2>',
    impact: 'Medium - Multiple H1s can confuse search engine understanding',
    timeToFix: '15 minutes'
  },

  'Page load time exceeds 3 seconds': {
    priority: 'high',
    category: 'Performance',
    solution: 'Optimize page loading speed for better user experience',
    implementation: [
      'Optimize and compress images (use WebP format)',
      'Minify CSS, JavaScript, and HTML files',
      'Enable browser caching with proper headers',
      'Use a Content Delivery Network (CDN)',
      'Remove unused CSS and JavaScript',
      'Optimize database queries if using dynamic content'
    ],
    example: 'Use tools like PageSpeed Insights, GTmetrix, or WebPageTest for detailed analysis',
    impact: 'High - Page speed affects both user experience and search rankings',
    timeToFix: '2-4 hours'
  },

  'Missing mobile-friendly viewport meta tag': {
    priority: 'critical',
    category: 'Mobile Optimization',
    solution: 'Add viewport meta tag for proper mobile display',
    implementation: [
      'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> in <head>',
      'Test your site on various mobile devices',
      'Ensure responsive design works properly',
      'Use mobile-friendly navigation and buttons'
    ],
    example: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    impact: 'Critical - Required for mobile-first indexing',
    timeToFix: '5 minutes'
  },

  'No structured data (Schema.org) found': {
    priority: 'medium',
    category: 'Structured Data',
    solution: 'Add structured data to help search engines understand your content',
    implementation: [
      'Identify appropriate schema types for your content',
      'Add JSON-LD structured data in <head> or <body>',
      'Use Google\'s Rich Results Test to validate',
      'Common schemas: Article, Organization, Product, Review'
    ],
    example: '{"@context": "https://schema.org", "@type": "Article", "headline": "Your Article Title"}',
    impact: 'Medium - Can improve search result appearance with rich snippets',
    timeToFix: '30-60 minutes'
  },

  'Content is too short (less than 300 words)': {
    priority: 'medium',
    category: 'Content Quality',
    solution: 'Expand content to provide more value to users',
    implementation: [
      'Add more detailed explanations and examples',
      'Include relevant statistics and data',
      'Answer common user questions',
      'Add related topics and subtopics',
      'Ensure content is valuable, not just lengthy'
    ],
    example: 'Aim for 300+ words of unique, valuable content per page',
    impact: 'Medium - Comprehensive content tends to rank better',
    timeToFix: '1-2 hours'
  },

  'Missing canonical URL': {
    priority: 'medium',
    category: 'Technical SEO',
    solution: 'Add canonical URL to prevent duplicate content issues',
    implementation: [
      'Add <link rel="canonical" href="https://example.com/page"> in <head>',
      'Use absolute URLs for canonical tags',
      'Point to the preferred version of the page',
      'Ensure canonical URLs are accessible and return 200 status'
    ],
    example: '<link rel="canonical" href="https://example.com/seo-guide">',
    impact: 'Medium - Helps prevent duplicate content penalties',
    timeToFix: '10 minutes'
  }
};

// Function to get resolution for an issue
function getIssueResolution(issueText) {
  // Try exact match first
  if (SEO_RESOLUTIONS[issueText]) {
    return SEO_RESOLUTIONS[issueText];
  }
  
  // Try partial matches for dynamic issues like "X images missing alt text"
  if (issueText.includes('images missing alt')) {
    return {
      priority: 'high',
      category: 'Image Optimization',
      solution: 'Add descriptive alt text to all images',
      implementation: [
        'Add alt="descriptive text" to each <img> tag',
        'Describe what the image shows, not what it is',
        'Keep alt text under 125 characters',
        'Leave alt empty (alt="") for decorative images only'
      ],
      example: '<img src="chart.jpg" alt="Sales increased 25% from Q1 to Q2 2024">',
      impact: 'High - Alt text improves accessibility and helps with image SEO',
      timeToFix: '2-5 minutes per image'
    };
  }
  
  // Default resolution for unknown issues
  return {
    priority: 'medium',
    category: 'General',
    solution: 'Review and address this SEO issue',
    implementation: [
      'Research best practices for this specific issue',
      'Consult SEO documentation and guidelines',
      'Test changes in a staging environment first',
      'Monitor results after implementation'
    ],
    example: 'Consult Google\'s SEO documentation for specific guidance',
    impact: 'Varies - Address based on your site\'s priorities',
    timeToFix: 'Varies'
  };
}

// Rotating user agents to avoid detection
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

// Get random user agent
const getRandomUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

// Add delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced headers to mimic real browsers
const getBrowserHeaders = () => ({
  'User-Agent': getRandomUserAgent(),
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'DNT': '1',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Cache-Control': 'max-age=0'
});

// Fallback SEO audit using Axios (when Puppeteer fails)
async function performFallbackAudit(url) {
  console.log(`Using fallback audit for: ${url}`);
  
  try {
    const startTime = Date.now();
    const response = await axios.get(url, {
      timeout: 30000,
      headers: getBrowserHeaders(),
      maxRedirects: 5,
      validateStatus: function (status) {
        return status >= 200 && status < 400;
      }
    });
    const loadTime = Date.now() - startTime;

    const $ = cheerio.load(response.data);

    // Basic SEO metrics (limited compared to Puppeteer)
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
    const canonical = $('link[rel="canonical"]').attr('href') || '';
    
    // Heading structure
    const headings = {
      h1: $('h1').length,
      h2: $('h2').length,
      h3: $('h3').length,
      h4: $('h4').length,
      h5: $('h5').length,
      h6: $('h6').length
    };

    const h1Texts = $('h1').map((i, el) => $(el).text().trim()).get();

    // Images analysis
    const images = $('img');
    const totalImages = images.length;
    const imagesWithoutAlt = images.filter((i, el) => !$(el).attr('alt')).length;

    // Links analysis
    const allLinks = $('a[href]');
    const internalLinks = allLinks.filter((i, el) => {
      const href = $(el).attr('href');
      return href && (href.startsWith('/') || href.includes(new URL(url).hostname));
    }).length;

    // Content analysis
    const wordCount = $('body').text().split(/\s+/).filter(word => word.length > 0).length;

    // Generate basic score with resolutions
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

    if (!title) {
      addIssue('Missing page title', 15);
    } else if (title.length < 30 || title.length > 60) {
      addIssue('Title length not optimal (30-60 characters)', 10);
    }

    if (!metaDescription) {
      addIssue('Missing meta description', 15);
    }

    if (headings.h1 === 0) {
      addIssue('Missing H1 tag', 15);
    } else if (headings.h1 > 1) {
      addIssue('Multiple H1 tags found', 10);
    }

    if (imagesWithoutAlt > 0) {
      const scoreDeduction = Math.min(15, imagesWithoutAlt * 2);
      addIssue(`${imagesWithoutAlt} images missing alt text`, scoreDeduction);
    }

    return {
      url,
      score: Math.max(0, score),
      issues,
      issuesWithResolutions,
      metrics: {
        title: { content: title, length: title.length, present: !!title },
        metaDescription: { content: metaDescription, length: metaDescription.length, present: !!metaDescription },
        metaKeywords: { content: metaKeywords, present: !!metaKeywords },
        canonical: { url: canonical, present: !!canonical },
        headings,
        h1Texts,
        images: { total: totalImages, withoutAlt: imagesWithoutAlt, altTextCoverage: totalImages > 0 ? ((totalImages - imagesWithoutAlt) / totalImages * 100).toFixed(1) : 100 },
        links: { total: allLinks.length, internal: internalLinks, external: allLinks.length - internalLinks },
        performance: { loadTime },
        content: { wordCount },
        mobile: { viewport: $('meta[name="viewport"]').attr('content') || '', friendly: !!$('meta[name="viewport"]').attr('content') }
      },
      timestamp: new Date().toISOString(),
      auditMethod: 'fallback'
    };
  } catch (error) {
    throw new Error(`Fallback audit failed: ${error.message}`);
  }
}

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Sitemap crawler endpoint
app.post('/api/crawl-sitemap', async (req, res) => {
  try {
    const { sitemapUrl } = req.body;
    
    if (!sitemapUrl) {
      return res.status(400).json({ error: 'Sitemap URL is required' });
    }

    const response = await axios.get(sitemapUrl, {
      timeout: 15000,
      headers: getBrowserHeaders(),
      maxRedirects: 5,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Accept redirects
      }
    });

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    
    let urls = [];
    
    // Handle sitemap index
    if (result.sitemapindex && result.sitemapindex.sitemap) {
      for (const sitemap of result.sitemapindex.sitemap) {
        try {
          await delay(Math.random() * 1000 + 500); // Random delay 500-1500ms
          const sitemapResponse = await axios.get(sitemap.loc[0], {
            timeout: 15000,
            headers: getBrowserHeaders(),
            maxRedirects: 5
          });
          const sitemapResult = await parser.parseStringPromise(sitemapResponse.data);
          
          if (sitemapResult.urlset && sitemapResult.urlset.url) {
            urls.push(...sitemapResult.urlset.url.map(url => ({
              loc: url.loc[0],
              lastmod: url.lastmod ? url.lastmod[0] : null,
              changefreq: url.changefreq ? url.changefreq[0] : null,
              priority: url.priority ? parseFloat(url.priority[0]) : null
            })));
          }
        } catch (error) {
          console.warn(`Failed to fetch sitemap: ${sitemap.loc[0]}`);
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

    res.json({ urls, total: urls.length });
  } catch (error) {
    console.error('Sitemap crawl error:', error.message);
    res.status(500).json({ error: 'Failed to crawl sitemap: ' + error.message });
  }
});

// SEO audit endpoint
app.post('/api/audit', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const audit = await performSEOAudit(url);
    res.json(audit);
  } catch (error) {
    console.error('SEO audit error:', error.message);
    res.status(500).json({ error: 'Failed to perform SEO audit: ' + error.message });
  }
});

// Batch audit endpoint
app.post('/api/batch-audit', async (req, res) => {
  try {
    const { urls } = req.body;
    
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: 'URLs array is required' });
    }

    const results = [];
    const batchSize = 3; // Process 3 URLs at a time to avoid detection
    const delayBetweenBatches = 5000; // 5 second delay between batches
    const delayBetweenRequests = 2000; // 2 second delay between individual requests

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      
      // Process batch sequentially with delays to avoid rate limiting
      const batchResults = [];
      for (const urlData of batch) {
        try {
          console.log(`Auditing: ${urlData.loc || urlData}`);
          const audit = await performSEOAudit(urlData.loc || urlData);
          batchResults.push({ url: urlData.loc || urlData, audit, status: 'success' });
        } catch (error) {
          console.error(`Failed to audit ${urlData.loc || urlData}:`, error.message);
          batchResults.push({ url: urlData.loc || urlData, error: error.message, status: 'error' });
        }
        
        // Add delay between individual requests within a batch
        if (batch.indexOf(urlData) < batch.length - 1) {
          await delay(delayBetweenRequests);
        }
      }
      
      results.push(...batchResults);
      
      // Send progress update
      res.write(JSON.stringify({ 
        progress: results.length, 
        total: urls.length, 
        results: batchResults 
      }) + '\n');
      
      // Add delay between batches (except for the last batch)
      if (i + batchSize < urls.length) {
        console.log(`Waiting ${delayBetweenBatches}ms before next batch...`);
        await delay(delayBetweenBatches);
      }
    }

    res.end();
  } catch (error) {
    console.error('Batch audit error:', error.message);
    res.status(500).json({ error: 'Failed to perform batch audit: ' + error.message });
  }
});

async function performSEOAudit(url, retryCount = 0) {
  const maxRetries = 2;
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  });
  
  try {
    const page = await browser.newPage();
    
    // Set random viewport size
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 1536, height: 864 },
      { width: 1440, height: 900 }
    ];
    const viewport = viewports[Math.floor(Math.random() * viewports.length)];
    await page.setViewport(viewport);
    
    // Set random user agent
    await page.setUserAgent(getRandomUserAgent());
    
    // Add extra headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    });
    
    // Remove webdriver property
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });
    
    // Randomize plugins and languages
    await page.evaluateOnNewDocument(() => {
      window.navigator.chrome = {
        runtime: {},
      };
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
    });
    
    // Add random delay before navigation
    await delay(Math.random() * 2000 + 1000); // 1-3 seconds
    
    const startTime = Date.now();
    await page.goto(url, { 
      waitUntil: 'domcontentloaded', 
      timeout: 45000 
    });
    
    // Wait a bit more for dynamic content
    await delay(2000);
    
    const loadTime = Date.now() - startTime;

    // Get page content
    const content = await page.content();
    const $ = cheerio.load(content);

    // Basic SEO metrics
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
    const canonical = $('link[rel="canonical"]').attr('href') || '';
    
    // Heading structure
    const headings = {
      h1: $('h1').length,
      h2: $('h2').length,
      h3: $('h3').length,
      h4: $('h4').length,
      h5: $('h5').length,
      h6: $('h6').length
    };

    const h1Texts = $('h1').map((i, el) => $(el).text().trim()).get();

    // Images analysis
    const images = $('img');
    const totalImages = images.length;
    const imagesWithoutAlt = images.filter((i, el) => !$(el).attr('alt')).length;
    const imagesWithoutTitle = images.filter((i, el) => !$(el).attr('title')).length;

    // Links analysis
    const allLinks = $('a[href]');
    const internalLinks = allLinks.filter((i, el) => {
      const href = $(el).attr('href');
      return href && (href.startsWith('/') || href.includes(new URL(url).hostname));
    }).length;
    const externalLinks = allLinks.length - internalLinks;

    // Schema markup
    const schemaMarkup = $('script[type="application/ld+json"]').length > 0;
    const schemaTypes = $('script[type="application/ld+json"]').map((i, el) => {
      try {
        const schema = JSON.parse($(el).html());
        return schema['@type'] || 'Unknown';
      } catch {
        return 'Invalid';
      }
    }).get();

    // Meta tags analysis
    const ogTitle = $('meta[property="og:title"]').attr('content') || '';
    const ogDescription = $('meta[property="og:description"]').attr('content') || '';
    const ogImage = $('meta[property="og:image"]').attr('content') || '';
    const twitterCard = $('meta[name="twitter:card"]').attr('content') || '';

    // Performance metrics (basic)
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });

    // Content analysis
    const wordCount = $('body').text().split(/\s+/).filter(word => word.length > 0).length;
    const textContent = $('body').text().trim();

    // Mobile viewport
    const viewportMeta = $('meta[name="viewport"]').attr('content') || '';
    const isMobileFriendly = viewportMeta.includes('width=device-width');

    // Robots meta
    const robotsMeta = $('meta[name="robots"]').attr('content') || '';

    // Generate SEO score with detailed issue resolutions
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

    if (headings.h1 === 0) {
      addIssue('Missing H1 tag', 15);
    } else if (headings.h1 > 1) {
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

    return {
      url,
      score: Math.max(0, score),
      issues,
      metrics: {
        title: {
          content: title,
          length: title.length,
          present: !!title
        },
        metaDescription: {
          content: metaDescription,
          length: metaDescription.length,
          present: !!metaDescription
        },
        metaKeywords: {
          content: metaKeywords,
          present: !!metaKeywords
        },
        canonical: {
          url: canonical,
          present: !!canonical
        },
        headings,
        h1Texts,
        images: {
          total: totalImages,
          withoutAlt: imagesWithoutAlt,
          withoutTitle: imagesWithoutTitle,
          altTextCoverage: totalImages > 0 ? ((totalImages - imagesWithoutAlt) / totalImages * 100).toFixed(1) : 100
        },
        links: {
          total: allLinks.length,
          internal: internalLinks,
          external: externalLinks
        },
        openGraph: {
          title: ogTitle,
          description: ogDescription,
          image: ogImage,
          present: !!(ogTitle || ogDescription || ogImage)
        },
        twitter: {
          card: twitterCard,
          present: !!twitterCard
        },
        schema: {
          present: schemaMarkup,
          types: schemaTypes
        },
        performance: {
          loadTime,
          ...performanceMetrics
        },
        content: {
          wordCount,
          length: textContent.length
        },
        mobile: {
          viewport: viewportMeta,
          friendly: isMobileFriendly
        },
        robots: {
          meta: robotsMeta,
          present: !!robotsMeta
        }
      },
      issuesWithResolutions,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error(`Error auditing ${url} (attempt ${retryCount + 1}):`, error.message);
    
    if (retryCount < maxRetries) {
      console.log(`Retrying ${url} in ${(retryCount + 1) * 2000}ms...`);
      await delay((retryCount + 1) * 2000); // Exponential backoff
      await browser.close();
      return performSEOAudit(url, retryCount + 1);
    }
    
    await browser.close();
    
    // Try fallback method if Puppeteer completely fails
    console.log(`Puppeteer failed for ${url}, trying fallback method...`);
    try {
      return await performFallbackAudit(url);
    } catch (fallbackError) {
      console.error(`Fallback also failed for ${url}:`, fallbackError.message);
      throw error; // Throw original error
    }
  } finally {
    try {
      if (browser && browser.connected) {
        await browser.close();
      }
    } catch (closeError) {
      console.warn('Error closing browser:', closeError.message);
    }
  }
}

app.listen(PORT, () => {
  console.log(`SEO Audit Server running on http://localhost:${PORT}`);
});
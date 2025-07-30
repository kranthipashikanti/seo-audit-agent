import axios from 'axios';
import xml2js from 'xml2js';

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

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
      
      // Limit to first 10 sitemaps to avoid timeout issues
      const sitemapsToProcess = result.sitemapindex.sitemap.slice(0, 10);
      console.log(`Processing first ${sitemapsToProcess.length} sitemaps`);
      
      for (let i = 0; i < sitemapsToProcess.length; i++) {
        const sitemap = sitemapsToProcess[i];
        try {
          console.log(`Processing sitemap ${i + 1}/${sitemapsToProcess.length}: ${sitemap.loc[0]}`);
          await delay(Math.random() * 300 + 200);
          
          const sitemapResponse = await axios.get(sitemap.loc[0], {
            timeout: 10000, // Increased timeout for individual sitemaps
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
            
            // Limit total URLs to prevent memory issues
            if (urls.length > 1000) {
              console.log(`Reached 1000 URL limit, stopping processing`);
              break;
            }
          } else {
            console.log(`No URLs found in ${sitemap.loc[0]}`);
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
}
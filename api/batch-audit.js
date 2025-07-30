import axios from 'axios';
import * as cheerio from 'cheerio';
import { getIssueResolution, getBrowserHeaders } from './audit-utils.js';

// Add delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback SEO audit using Axios
async function performFallbackAudit(url) {
  try {
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

    // Links analysis
    const allLinks = $('a[href]');
    const internalLinks = allLinks.filter((i, el) => {
      const href = $(el).attr('href');
      return href && (href.startsWith('/') || href.includes(new URL(url).hostname));
    }).length;

    // Content analysis
    const wordCount = $('body').text().split(/\s+/).filter(word => word.length > 0).length;

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

    // Mobile viewport
    const viewportMeta = $('meta[name="viewport"]').attr('content') || '';
    const isMobileFriendly = viewportMeta.includes('width=device-width');

    // Robots meta
    const robotsMeta = $('meta[name="robots"]').attr('content') || '';

    // Additional SEO checks
    const httpsCheck = url.startsWith('https://');
    const metaCharset = $('meta[charset]').attr('charset') || '';
    const favicon = $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').length > 0;
    const languageDeclaration = $('html').attr('lang') || '';
    
    // Optimized image and link analysis for better performance
    let largeImages = 0;
    let externalLinks = 0;
    const hostname = new URL(url).hostname;
    
    // Count large images efficiently
    images.each((i, el) => {
      const src = $(el).attr('src');
      if (src && (src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png')) && !src.includes('.webp')) {
        largeImages++;
      }
    });
    
    // Count external links efficiently
    allLinks.each((i, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('/') && !href.includes(hostname) && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        externalLinks++;
      }
    });
    
    // Advanced content analysis
    const hasH2s = headings.h2 > 0;
    const hasH3s = headings.h3 > 0;
    
    // Meta tag completeness
    const hasAllBasicMeta = !!title && !!metaDescription && !!canonical && !!metaCharset;
    
    // Social media completeness
    const socialMediaComplete = !!(ogTitle && ogDescription && ogImage && twitterCard);

    // Generate score with resolutions
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

    // SEO checks
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

    // Additional SEO issue checks
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

    if (!hasH2s && wordCount > 300) {
      addIssue('No H2 headings found - poor content structure', 8);
    }

    if (largeImages > 0) {
      addIssue(`${largeImages} images could be optimized (consider WebP format)`, Math.min(10, largeImages * 2));
    }

    if (!ogTitle || !ogDescription) {
      addIssue('Incomplete Open Graph tags (missing title or description)', 8);
    }

    if (!ogImage) {
      addIssue('Missing Open Graph image', 5);
    }

    if (externalLinks > 10 && internalLinks === 0) {
      addIssue('No internal links found - poor site navigation', 10);
    }

    if (robotsMeta.includes('noindex')) {
      addIssue('Page set to noindex - will not appear in search results', 25);
    }

    if (allLinks.length === 0) {
      addIssue('No links found on page - poor user experience', 8);
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
        openGraph: { title: ogTitle, description: ogDescription, image: ogImage, present: !!(ogTitle || ogDescription || ogImage) },
        twitter: { card: twitterCard, present: !!twitterCard },
        schema: { present: schemaMarkup, types: schemaTypes },
        performance: { loadTime },
        content: { wordCount, length: $('body').text().trim().length },
        mobile: { viewport: viewportMeta, friendly: isMobileFriendly },
        robots: { meta: robotsMeta, present: !!robotsMeta },
        security: { https: httpsCheck, charset: metaCharset },
        technical: { favicon: favicon, language: languageDeclaration, h2Count: headings.h2, h3Count: headings.h3 },
        optimization: { largeImages: largeImages, externalLinks: externalLinks, hasAllBasicMeta: hasAllBasicMeta },
        socialComplete: socialMediaComplete
      },
      timestamp: new Date().toISOString(),
      auditMethod: 'fallback'
    };
  } catch (error) {
    throw new Error(`Audit failed: ${error.message}`);
  }
}

export default async function handler(req, res) {
  console.log('Batch audit handler called');
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request - sending CORS headers');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Request body:', req.body);
    const { urls } = req.body;
    
    console.log('Extracted URLs:', urls);
    console.log('URLs type:', typeof urls);
    console.log('URLs is array:', Array.isArray(urls));
    
    if (!urls || !Array.isArray(urls)) {
      console.log('Invalid URLs parameter');
      return res.status(400).json({ error: 'URLs array is required' });
    }

    const results = [];
    const batchSize = 2; // Smaller batch size for serverless
    const delayBetweenRequests = 500; // 0.5 second delay

    // Note: Due to Vercel serverless timeout limits, we process smaller batches
    const maxUrls = Math.min(urls.length, 10); // Limit to 10 URLs max
    const urlsToProcess = urls.slice(0, maxUrls);

    for (let i = 0; i < urlsToProcess.length; i += batchSize) {
      const batch = urlsToProcess.slice(i, i + batchSize);
      
      // Process batch sequentially
      for (const urlData of batch) {
        const url = urlData.loc || urlData;
        try {
          console.log(`Auditing: ${url}`);
          const audit = await performFallbackAudit(url);
          console.log(`Audit completed for ${url}, score: ${audit.score}`);
          results.push({ url, audit, status: 'success' });
        } catch (error) {
          console.error(`Failed to audit ${url}:`, error.message);
          results.push({ url, error: error.message, status: 'error' });
        }
        
        // Add delay between requests
        if (batch.indexOf(urlData) < batch.length - 1) {
          await delay(delayBetweenRequests);
        }
      }
    }

    const responseData = {
      results,
      total: results.length,
      processed: results.length,
      skipped: urls.length - maxUrls,
      note: urls.length > maxUrls ? `Limited to ${maxUrls} URLs due to serverless constraints` : undefined
    };
    
    console.log('Sending response:', responseData);
    console.log('Results count:', results.length);
    console.log('Successful results:', results.filter(r => r.status === 'success').length);
    console.log('Failed results:', results.filter(r => r.status === 'error').length);
    
    res.json(responseData);
  } catch (error) {
    console.error('Batch audit handler error:', error);
    console.error('Error stack:', error.stack);
    const errorResponse = { error: 'Failed to perform batch audit: ' + error.message };
    console.log('Sending error response:', errorResponse);
    res.status(500).json(errorResponse);
  }
}
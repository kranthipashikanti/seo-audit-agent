import axios from 'axios';
import * as cheerio from 'cheerio';
import { getIssueResolution, getBrowserHeaders, calculateSEOScore } from './audit-utils.js';

// Fallback SEO audit using Axios (when Puppeteer would fail)
async function performFallbackAudit(url) {
  console.log(`Using fallback audit for: ${url}`);
  
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
    const duplicateContent = $('body').text().trim().length < wordCount * 5; // Very basic check
    const hasH2s = headings.h2 > 0;
    const hasH3s = headings.h3 > 0;
    
    // Meta tag completeness
    const hasAllBasicMeta = !!title && !!metaDescription && !!canonical && !!metaCharset;
    
    // Structured data analysis
    const hasOrganizationSchema = schemaTypes.includes('Organization');
    const hasArticleSchema = schemaTypes.includes('Article');
    const hasBreadcrumbSchema = schemaTypes.includes('BreadcrumbList');
    
    // Social media completeness
    const socialMediaComplete = !!(ogTitle && ogDescription && ogImage && twitterCard);

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

    // Prepare metrics for comprehensive scoring
    const metrics = {
      title: { content: title, length: title.length, present: !!title },
      metaDescription: { content: metaDescription, length: metaDescription.length, present: !!metaDescription },
      performance: { loadTime },
      images: { total: totalImages, withoutAlt: imagesWithoutAlt },
      headings: { h1: headings.h1, h2: headings.h2, h3: headings.h3 },
      links: { total: allLinks.length, internal: internalLinks },
      technical: {
        https: httpsCheck,
        charset: !!metaCharset,
        viewport: isMobileFriendly,
        canonical: !!canonical,
        favicon: !!favicon,
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

    return {
      url,
      score: scoreData.totalScore,
      grade: scoreData.grade,
      scoreBreakdown: scoreData.breakdown,
      issues,
      issuesWithResolutions,
      metrics: {
        // Enhanced metrics for display
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
        technical: { favicon: !!favicon, language: languageDeclaration, h2Count: headings.h2, h3Count: headings.h3 },
        optimization: { largeImages: largeImages, externalLinks: externalLinks, hasAllBasicMeta: hasAllBasicMeta },
        socialComplete: socialMediaComplete
      },
      timestamp: new Date().toISOString(),
      auditMethod: 'fallback'
    };
  } catch (error) {
    throw new Error(`Fallback audit failed: ${error.message}`);
  }
}

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

    // Use fallback audit (Puppeteer not available in Vercel serverless)
    const audit = await performFallbackAudit(url);
    res.json(audit);
  } catch (error) {
    console.error('SEO audit error:', error.message);
    res.status(500).json({ error: 'Failed to perform SEO audit: ' + error.message });
  }
}
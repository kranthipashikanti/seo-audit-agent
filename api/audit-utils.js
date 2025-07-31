// SEO Issue Resolutions Database
export const SEO_RESOLUTIONS = {
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
  },

  'Website not using HTTPS/SSL': {
    priority: 'critical',
    category: 'Security',
    solution: 'Implement SSL certificate and force HTTPS redirects',
    implementation: [
      'Purchase and install SSL certificate from your hosting provider',
      'Configure server to redirect all HTTP traffic to HTTPS',
      'Update all internal links to use HTTPS',
      'Update Google Search Console and Analytics settings'
    ],
    example: 'Contact your hosting provider for SSL setup guidance',
    impact: 'Critical - HTTPS is a Google ranking factor and builds user trust',
    timeToFix: '2-4 hours'
  },

  'Missing charset declaration': {
    priority: 'medium',
    category: 'Technical SEO',
    solution: 'Add character encoding declaration to prevent display issues',
    implementation: [
      'Add <meta charset="UTF-8"> as the first element in <head>',
      'Ensure it appears before any other meta tags',
      'Use UTF-8 encoding for international character support'
    ],
    example: '<meta charset="UTF-8">',
    impact: 'Medium - Prevents character encoding issues',
    timeToFix: '2 minutes'
  },

  'Missing favicon': {
    priority: 'low',
    category: 'User Experience',
    solution: 'Add favicon for better brand recognition',
    implementation: [
      'Create a 32x32 pixel icon file (favicon.ico)',
      'Add <link rel="icon" href="/favicon.ico"> in <head>',
      'Consider adding multiple sizes for different devices',
      'Test favicon appears correctly in browser tabs'
    ],
    example: '<link rel="icon" type="image/x-icon" href="/favicon.ico">',
    impact: 'Low - Improves brand recognition and professional appearance',
    timeToFix: '30 minutes'
  },

  'Missing HTML language declaration': {
    priority: 'medium',
    category: 'Accessibility',
    solution: 'Add language attribute to HTML tag for accessibility',
    implementation: [
      'Add lang attribute to <html> tag',
      'Use appropriate language code (e.g., "en" for English)',
      'Consider regional variants if needed (e.g., "en-US")',
      'Update for multilingual sites with appropriate hreflang tags'
    ],
    example: '<html lang="en">',
    impact: 'Medium - Improves accessibility and helps search engines understand content language',
    timeToFix: '5 minutes'
  },

  'No H2 headings found - poor content structure': {
    priority: 'medium',
    category: 'Content Structure',
    solution: 'Add H2 headings to improve content hierarchy',
    implementation: [
      'Break content into logical sections with H2 headings',
      'Use H2s for main topic sections under the H1',
      'Follow proper heading hierarchy (H1 > H2 > H3)',
      'Include relevant keywords in headings naturally'
    ],
    example: '<h2>Key Benefits</h2> <h2>How It Works</h2> <h2>Getting Started</h2>',
    impact: 'Medium - Improves content readability and SEO structure',
    timeToFix: '20-30 minutes'
  },

  'Incomplete Open Graph tags (missing title or description)': {
    priority: 'high',
    category: 'Social Media',
    solution: 'Complete Open Graph meta tags for better social sharing',
    implementation: [
      'Add <meta property="og:title" content="Page Title">',
      'Add <meta property="og:description" content="Page description">',
      'Ensure title and description are compelling for social shares',
      'Keep title under 60 characters, description under 160 characters'
    ],
    example: '<meta property="og:title" content="SEO Audit Tool - Free Analysis">\n<meta property="og:description" content="Get comprehensive SEO reports instantly">',
    impact: 'High - Improves social media sharing and click-through rates',
    timeToFix: '15 minutes'
  },

  'Missing Open Graph image': {
    priority: 'medium',
    category: 'Social Media',
    solution: 'Add Open Graph image for social media previews',
    implementation: [
      'Create or select a relevant image (1200x630 pixels recommended)',
      'Add <meta property="og:image" content="https://example.com/image.jpg">',
      'Use absolute URLs for the image path',
      'Ensure image is high quality and represents the page content'
    ],
    example: '<meta property="og:image" content="https://example.com/og-image.jpg">',
    impact: 'Medium - Improves social media post appearance and engagement',
    timeToFix: '30 minutes'
  },

  'No internal links found - poor site navigation': {
    priority: 'high',
    category: 'Link Building',
    solution: 'Add internal links to improve site navigation and SEO',
    implementation: [
      'Link to relevant pages within your website',
      'Use descriptive anchor text (not "click here")',
      'Add 3-5 internal links per page naturally within content',
      'Link to important pages like contact, services, or popular content'
    ],
    example: 'Link to <a href="/services">our services page</a> or <a href="/about">learn more about our company</a>',
    impact: 'High - Improves user navigation and helps search engines understand site structure',
    timeToFix: '15-30 minutes'
  },

  'Page set to noindex - will not appear in search results': {
    priority: 'critical',
    category: 'Technical SEO',
    solution: 'Remove noindex directive if page should be searchable',
    implementation: [
      'Check <meta name="robots" content="noindex"> and remove if unwanted',
      'Verify this page should actually be indexed by search engines',
      'For pages that should be indexed, remove or change to "index, follow"',
      'Update robots.txt if it\'s blocking this page'
    ],
    example: 'Change <meta name="robots" content="noindex"> to <meta name="robots" content="index, follow">',
    impact: 'Critical - Page will not appear in search results with noindex',
    timeToFix: '5 minutes'
  },

  'No links found on page - poor user experience': {
    priority: 'high',
    category: 'User Experience',
    solution: 'Add relevant links to improve navigation and user experience',
    implementation: [
      'Add navigation menu links to other important pages',
      'Include relevant internal links within content',
      'Add footer links to key pages (contact, privacy, etc.)',
      'Consider adding related articles or resources'
    ],
    example: 'Add navigation: <nav><a href="/home">Home</a> <a href="/about">About</a> <a href="/contact">Contact</a></nav>',
    impact: 'High - Poor navigation leads to high bounce rates and poor user experience',
    timeToFix: '30-60 minutes'
  }
};

// Function to get resolution for an issue
export function getIssueResolution(issueText) {
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
  
  // Pattern match for image optimization issues
  if (issueText.includes('images could be optimized')) {
    return {
      priority: 'high',
      category: 'Performance',
      solution: 'Optimize images for better page load speed',
      implementation: [
        'Convert JPEG/PNG images to WebP format for better compression',
        'Compress images using tools like TinyPNG or ImageOptim',
        'Use appropriate image dimensions (don\'t scale down large images with CSS)',
        'Implement lazy loading for images below the fold',
        'Consider using responsive images with srcset attribute'
      ],
      example: '<img src="image.webp" alt="Description" loading="lazy" width="300" height="200">',
      impact: 'High - Image optimization significantly improves page load speed',
      timeToFix: '30-60 minutes for batch optimization'
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

// SEO Scoring System Based on Industry Best Practices
// Total: 100 points distributed across key SEO factors
export const SEO_SCORING_WEIGHTS = {
  // Core On-Page SEO (35 points total)
  TITLE_TAG: {
    missing: -20,           // Critical - affects CTR and rankings
    optimal_length: 15,     // 30-60 characters
    suboptimal_length: -8,  // Too short/long but present
    max_points: 20
  },
  
  META_DESCRIPTION: {
    missing: -15,           // High impact on CTR
    optimal_length: 10,     // 120-160 characters  
    suboptimal_length: -5,  // Present but not optimal
    max_points: 15
  },

  // Content Structure (20 points total)
  HEADING_STRUCTURE: {
    missing_h1: -12,        // H1 is crucial for topic clarity
    multiple_h1: -6,        // Confuses search engines
    optimal_h1: 8,          // Single, descriptive H1
    has_h2_structure: 6,    // Good content hierarchy
    poor_structure: -4,     // No H2s with substantial content
    max_points: 14
  },

  CONTENT_QUALITY: {
    optimal_length: 6,      // 300+ words shows depth
    too_short: -8,          // Under 300 words
    max_points: 6
  },

  // Technical SEO (25 points total)
  TECHNICAL_FOUNDATION: {
    https_secure: 8,        // Security & ranking factor
    missing_https: -12,     // Major trust/ranking issue
    mobile_friendly: 6,     // Mobile-first indexing
    missing_viewport: -10,  // Critical for mobile
    fast_loading: 4,        // Under 3 seconds
    slow_loading: -6,       // Over 3 seconds
    charset_present: 2,     // Technical completeness
    language_declared: 2,   // Accessibility & international
    canonical_url: 3,       // Duplicate content prevention
    max_points: 25
  },

  // Image Optimization (8 points total)
  IMAGES: {
    all_optimized: 5,       // All images have alt text
    missing_alt_minor: -2,  // 1-2 images missing alt
    missing_alt_major: -6,  // 3+ images missing alt
    efficient_formats: 3,   // WebP, proper sizing
    max_points: 8
  },

  // User Experience Signals (7 points total)
  USER_EXPERIENCE: {
    good_navigation: 3,     // Has internal links
    poor_navigation: -5,    // No internal links
    has_favicon: 1,         // Professional appearance
    no_links: -3,           // Dead-end pages
    max_points: 4
  },

  // Advanced SEO (5 points total)
  ADVANCED_SEO: {
    structured_data: 3,     // Rich snippets potential
    social_optimization: 2, // Complete Open Graph
    max_points: 5
  }
};

// Calculate comprehensive SEO score
export function calculateSEOScore(metrics) {
  let score = 0;
  const breakdown = {
    onPage: 0,
    technical: 0,
    content: 0,
    images: 0,
    userExperience: 0,
    advanced: 0
  };

  // Title Tag Scoring (20 points max)
  if (!metrics.title?.present) {
    score += SEO_SCORING_WEIGHTS.TITLE_TAG.missing;
    breakdown.onPage += SEO_SCORING_WEIGHTS.TITLE_TAG.missing;
  } else {
    const titleLength = metrics.title.length || 0;
    if (titleLength >= 30 && titleLength <= 60) {
      score += SEO_SCORING_WEIGHTS.TITLE_TAG.optimal_length;
      breakdown.onPage += SEO_SCORING_WEIGHTS.TITLE_TAG.optimal_length;
    } else {
      score += SEO_SCORING_WEIGHTS.TITLE_TAG.suboptimal_length;
      breakdown.onPage += SEO_SCORING_WEIGHTS.TITLE_TAG.suboptimal_length;
    }
  }

  // Meta Description Scoring (15 points max)
  if (!metrics.metaDescription?.present) {
    score += SEO_SCORING_WEIGHTS.META_DESCRIPTION.missing;
    breakdown.onPage += SEO_SCORING_WEIGHTS.META_DESCRIPTION.missing;
  } else {
    const descLength = metrics.metaDescription.length || 0;
    if (descLength >= 120 && descLength <= 160) {
      score += SEO_SCORING_WEIGHTS.META_DESCRIPTION.optimal_length;
      breakdown.onPage += SEO_SCORING_WEIGHTS.META_DESCRIPTION.optimal_length;
    } else {
      score += SEO_SCORING_WEIGHTS.META_DESCRIPTION.suboptimal_length;
      breakdown.onPage += SEO_SCORING_WEIGHTS.META_DESCRIPTION.suboptimal_length;
    }
  }

  // Heading Structure Scoring (14 points max)
  const h1Count = metrics.headings?.h1 || 0;
  const h2Count = metrics.headings?.h2 || 0;
  const wordCount = metrics.content?.wordCount || 0;

  if (h1Count === 0) {
    score += SEO_SCORING_WEIGHTS.HEADING_STRUCTURE.missing_h1;
    breakdown.content += SEO_SCORING_WEIGHTS.HEADING_STRUCTURE.missing_h1;
  } else if (h1Count === 1) {
    score += SEO_SCORING_WEIGHTS.HEADING_STRUCTURE.optimal_h1;
    breakdown.content += SEO_SCORING_WEIGHTS.HEADING_STRUCTURE.optimal_h1;
  } else {
    score += SEO_SCORING_WEIGHTS.HEADING_STRUCTURE.multiple_h1;
    breakdown.content += SEO_SCORING_WEIGHTS.HEADING_STRUCTURE.multiple_h1;
  }

  if (h2Count > 0 && wordCount > 300) {
    score += SEO_SCORING_WEIGHTS.HEADING_STRUCTURE.has_h2_structure;
    breakdown.content += SEO_SCORING_WEIGHTS.HEADING_STRUCTURE.has_h2_structure;
  } else if (wordCount > 300) {
    score += SEO_SCORING_WEIGHTS.HEADING_STRUCTURE.poor_structure;
    breakdown.content += SEO_SCORING_WEIGHTS.HEADING_STRUCTURE.poor_structure;
  }

  // Content Quality Scoring (6 points max)
  if (wordCount >= 300) {
    score += SEO_SCORING_WEIGHTS.CONTENT_QUALITY.optimal_length;
    breakdown.content += SEO_SCORING_WEIGHTS.CONTENT_QUALITY.optimal_length;
  } else {
    score += SEO_SCORING_WEIGHTS.CONTENT_QUALITY.too_short;
    breakdown.content += SEO_SCORING_WEIGHTS.CONTENT_QUALITY.too_short;
  }

  // Technical SEO Scoring (25 points max)
  if (metrics.technical?.https) {
    score += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.https_secure;
    breakdown.technical += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.https_secure;
  } else {
    score += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.missing_https;
    breakdown.technical += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.missing_https;
  }

  if (metrics.technical?.viewport) {
    score += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.mobile_friendly;
    breakdown.technical += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.mobile_friendly;
  } else {
    score += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.missing_viewport;
    breakdown.technical += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.missing_viewport;
  }

  const loadTime = metrics.performance?.loadTime || 0;
  if (loadTime > 0 && loadTime <= 3000) {
    score += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.fast_loading;
    breakdown.technical += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.fast_loading;
  } else if (loadTime > 3000) {
    score += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.slow_loading;
    breakdown.technical += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.slow_loading;
  }

  if (metrics.technical?.charset) {
    score += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.charset_present;
    breakdown.technical += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.charset_present;
  }

  if (metrics.technical?.language) {
    score += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.language_declared;
    breakdown.technical += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.language_declared;
  }

  if (metrics.technical?.canonical) {
    score += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.canonical_url;
    breakdown.technical += SEO_SCORING_WEIGHTS.TECHNICAL_FOUNDATION.canonical_url;
  }

  // Image Optimization Scoring (8 points max)
  const totalImages = metrics.images?.total || 0;
  const imagesWithoutAlt = metrics.images?.withoutAlt || 0;

  if (totalImages > 0) {
    if (imagesWithoutAlt === 0) {
      score += SEO_SCORING_WEIGHTS.IMAGES.all_optimized;
      breakdown.images += SEO_SCORING_WEIGHTS.IMAGES.all_optimized;
    } else if (imagesWithoutAlt <= 2) {
      score += SEO_SCORING_WEIGHTS.IMAGES.missing_alt_minor;
      breakdown.images += SEO_SCORING_WEIGHTS.IMAGES.missing_alt_minor;
    } else {
      score += SEO_SCORING_WEIGHTS.IMAGES.missing_alt_major;
      breakdown.images += SEO_SCORING_WEIGHTS.IMAGES.missing_alt_major;
    }
  }

  // User Experience Scoring (4 points max)
  const internalLinks = metrics.links?.internal || 0;
  const totalLinks = metrics.links?.total || 0;

  if (internalLinks > 0) {
    score += SEO_SCORING_WEIGHTS.USER_EXPERIENCE.good_navigation;
    breakdown.userExperience += SEO_SCORING_WEIGHTS.USER_EXPERIENCE.good_navigation;
  } else if (totalLinks === 0) {
    score += SEO_SCORING_WEIGHTS.USER_EXPERIENCE.no_links;
    breakdown.userExperience += SEO_SCORING_WEIGHTS.USER_EXPERIENCE.no_links;
  } else {
    score += SEO_SCORING_WEIGHTS.USER_EXPERIENCE.poor_navigation;
    breakdown.userExperience += SEO_SCORING_WEIGHTS.USER_EXPERIENCE.poor_navigation;
  }

  if (metrics.technical?.favicon) {
    score += SEO_SCORING_WEIGHTS.USER_EXPERIENCE.has_favicon;
    breakdown.userExperience += SEO_SCORING_WEIGHTS.USER_EXPERIENCE.has_favicon;
  }

  // Advanced SEO Scoring (5 points max)
  if (metrics.technical?.schema) {
    score += SEO_SCORING_WEIGHTS.ADVANCED_SEO.structured_data;
    breakdown.advanced += SEO_SCORING_WEIGHTS.ADVANCED_SEO.structured_data;
  }

  if (metrics.social?.ogTitle && metrics.social?.ogDescription) {
    score += SEO_SCORING_WEIGHTS.ADVANCED_SEO.social_optimization;
    breakdown.advanced += SEO_SCORING_WEIGHTS.ADVANCED_SEO.social_optimization;
  }

  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, Math.round(score + 70))); // Base score of 70 + improvements/deductions

  return {
    totalScore: score,
    breakdown,
    grade: getScoreGrade(score),
    maxPossibleScore: 100
  };
}

// Get letter grade based on score
export function getScoreGrade(score) {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 50) return 'C-';
  if (score >= 40) return 'D';
  return 'F';
}

// Get score color for UI
export function getScoreColor(score) {
  if (score >= 80) return { bg: 'bg-altudo-yellow/20', text: 'text-altudo-black', border: 'border-altudo-yellow' };
  if (score >= 60) return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' };
  return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
}

// Rotating user agents to avoid detection
export const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

// Get random user agent
export const getRandomUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

// Enhanced headers to mimic real browsers
export const getBrowserHeaders = () => ({
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
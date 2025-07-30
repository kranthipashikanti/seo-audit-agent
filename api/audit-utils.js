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
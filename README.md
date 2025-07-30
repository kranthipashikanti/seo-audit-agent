# SEO Audit Agent

A complete React-based SEO audit tool with sitemap crawling, comprehensive SEO analysis, and batch processing capabilities.

## Features

🗺️ **Sitemap Crawler**
- Crawl XML sitemaps and sitemap indexes
- Discover all URLs from your website
- Support for robots.txt detection
- Extract URL metadata (priority, last modified, change frequency)

🔍 **Comprehensive SEO Audit**
- Title tag analysis (length, presence)
- Meta description optimization
- Heading structure validation (H1-H6)
- Image optimization (alt text, title attributes)
- Internal/external link analysis
- Schema.org structured data detection
- Open Graph and Twitter Card validation
- Mobile-friendliness checks
- Page load performance metrics
- Content analysis (word count, quality)
- Canonical URL validation
- Robots meta tag analysis

📊 **Advanced Results Dashboard**
- Overall SEO score calculation
- Detailed issue reporting
- Performance benchmarking
- Export results to CSV
- Batch audit progress tracking
- Mobile-responsive interface

🚀 **Proxy Server**
- Built-in Express server for CORS handling
- Rate limiting and error handling
- Puppeteer integration for accurate rendering
- RESTful API endpoints

🛡️ **Anti-Detection Features**
- Rotating user agents (6 different browsers)
- Stealth mode browser with puppeteer-extra
- Random delays between requests (2-5 seconds)
- Exponential backoff retry logic
- Fallback audit method when blocked
- Random viewport sizes and browser fingerprints
- Proper HTTP headers mimicking real browsers

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd seo-audit-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the React frontend (http://localhost:3000) and the Express server (http://localhost:3003) concurrently.

### Usage

1. **Crawl a Sitemap**
   - Navigate to the "Sitemap Crawler" tab
   - Enter your sitemap URL (e.g., `https://example.com/sitemap.xml`)
   - Click "Crawl Sitemap" to discover all URLs

2. **Run SEO Audits**
   - Switch to the "SEO Audit" tab
   - Choose between single URL audit or batch audit
   - For batch audits, select URLs from the discovered sitemap
   - Click "Run SEO Audit" to start the analysis

3. **View Results**
   - Navigate to the "Results" tab
   - Review detailed SEO scores and issues
   - Export results to CSV for reporting
   - Click "View Details" for in-depth analysis

## API Endpoints

### POST /api/crawl-sitemap
Crawl XML sitemap and extract URLs
```javascript
{
  "sitemapUrl": "https://example.com/sitemap.xml"
}
```

### POST /api/audit
Audit a single URL
```javascript
{
  "url": "https://example.com/page"
}
```

### POST /api/batch-audit
Audit multiple URLs with progress streaming
```javascript
{
  "urls": [
    { "loc": "https://example.com/page1" },
    { "loc": "https://example.com/page2" }
  ]
}
```

## SEO Metrics Analyzed

### Core SEO Elements
- **Title Tags**: Length (30-60 chars), uniqueness, keyword optimization
- **Meta Descriptions**: Length (120-160 chars), compelling copy
- **Heading Structure**: Proper H1-H6 hierarchy
- **Canonical URLs**: Duplicate content prevention
- **Robots Meta**: Crawling and indexing directives

### Content Quality
- **Word Count**: Minimum content requirements (300+ words)
- **Image Optimization**: Alt text coverage, file size analysis
- **Link Analysis**: Internal linking structure, external link quality

### Technical SEO
- **Page Speed**: Load time measurement and optimization
- **Mobile Friendliness**: Responsive design validation
- **Structured Data**: Schema.org markup detection
- **Social Media**: Open Graph and Twitter Card implementation

### Performance Metrics
- **Load Time**: Full page load measurement
- **DOM Content Loaded**: Critical rendering path analysis
- **First Paint**: Visual loading performance
- **First Contentful Paint**: User experience metrics

## Scoring Algorithm

The SEO score is calculated out of 100 points based on:

- **Title Tag** (15 points): Presence and optimal length
- **Meta Description** (15 points): Presence and optimal length  
- **H1 Tags** (15 points): Single, descriptive H1
- **Image Alt Text** (15 points): Coverage percentage
- **Page Speed** (10 points): Load time under 3 seconds
- **Mobile Friendly** (10 points): Responsive viewport meta tag
- **Content Length** (10 points): Minimum 300 words
- **Canonical URL** (5 points): Proper canonicalization
- **Structured Data** (5 points): Schema.org implementation

## Development

### Project Structure
```
seo-audit-agent/
├── src/
│   ├── components/
│   │   ├── SitemapCrawler.jsx    # Sitemap discovery
│   │   ├── SEOAudit.jsx          # Audit interface
│   │   └── Results.jsx           # Results dashboard
│   ├── App.jsx                   # Main application
│   └── main.jsx                  # React entry point
├── server/
│   └── index.js                  # Express API server
├── package.json                  # Dependencies
└── README.md                     # Documentation
```

### Available Scripts

- `npm run dev` - Start development server (frontend + backend)
- `npm run client` - Start only React frontend
- `npm run server` - Start only Express backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Configuration

The application uses these configuration files:
- `vite.config.js` - Vite bundler configuration
- `tailwind.config.js` - Tailwind CSS styling
- `postcss.config.js` - PostCSS processing
- `.eslintrc.cjs` - Code linting rules

## Deployment

### Production Build
```bash
npm run build
npm run preview
```

### Environment Variables
Create a `.env` file for production settings:
```env
VITE_API_URL=https://your-api-domain.com
PORT=3001
NODE_ENV=production
```

### Docker Support
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000 3001
CMD ["npm", "run", "dev"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the documentation for common solutions
- Review the API endpoints for integration help

---

**Built with React, Express, Puppeteer, and Tailwind CSS**
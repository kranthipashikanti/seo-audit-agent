# SEO Audit Agent

A complete React-based SEO audit tool with sitemap crawling, comprehensive SEO analysis, and batch processing capabilities. Built with React, Express.js, Puppeteer, and Tailwind CSS for professional SEO analysis and reporting.

## Features

🗺️ **Advanced Sitemap Crawler**
- Crawl XML sitemaps and sitemap indexes automatically
- Discover all URLs from your website structure
- Support for robots.txt detection and parsing
- Extract URL metadata (priority, last modified, change frequency)
- Handle nested sitemaps and large sitemap files

🔍 **Comprehensive SEO Audit Engine**
- Title tag analysis (length, presence, optimization)
- Meta description optimization and length validation
- Heading structure validation (H1-H6 hierarchy)
- Image optimization analysis (alt text, title attributes, file sizes)
- Internal and external link analysis with quality metrics
- Schema.org structured data detection and validation
- Open Graph and Twitter Card meta tag validation
- Mobile-friendliness and responsive design checks
- Page load performance metrics and Core Web Vitals
- Content analysis (word count, quality, readability)
- Canonical URL validation and duplicate content detection
- Robots meta tag analysis and crawling directives

📊 **Advanced Results Dashboard**
- Overall SEO score calculation (100-point scale)
- Detailed issue reporting with actionable recommendations
- Performance benchmarking against industry standards
- Export results to CSV and PDF formats
- Batch audit progress tracking with real-time updates
- Mobile-responsive interface with dark/light theme
- Interactive charts and performance visualizations

🚀 **Robust Proxy Server**
- Built-in Express.js server for CORS handling
- Intelligent rate limiting and error recovery
- Puppeteer integration for accurate JavaScript rendering
- RESTful API endpoints with comprehensive error handling
- Support for both single and batch audit operations

🛡️ **Advanced Anti-Detection Features**
- Rotating user agents (6+ different browser signatures)
- Stealth mode browser with puppeteer-extra-plugin-stealth
- Random delays between requests (2-5 seconds with jitter)
- Exponential backoff retry logic with circuit breaker
- Intelligent fallback audit method using Axios + Cheerio
- Random viewport sizes and browser fingerprinting
- Proper HTTP headers mimicking real browser behavior
- Request throttling to avoid rate limiting

## System Requirements

### Prerequisites
- **Node.js**: Version 16.0.0 or higher (recommended: 18+ LTS)
- **NPM**: Version 7+ (comes with Node.js) or **Yarn**: Version 1.22+
- **Operating System**: Windows 10+, macOS 10.15+, or Linux Ubuntu 18.04+
- **RAM**: Minimum 4GB (recommended: 8GB for large batch audits)
- **Storage**: 500MB free space (additional space needed for Chromium browser)

### Browser Dependencies
- Puppeteer will automatically download Chromium (~170MB) during installation
- Ensure your system allows automated browser processes
- For server deployments, install necessary browser dependencies

## Installation Guide

### Method 1: Quick Start (Recommended)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/seo-audit-agent.git
   cd seo-audit-agent
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   
   *Note: This will download Puppeteer's Chromium browser (~170MB). Installation may take 2-3 minutes.*

3. **Verify Installation**
   ```bash
   npm run lint
   ```

4. **Start Development Environment**
   ```bash
   npm run dev-full
   ```
   
   This command starts both:
   - **React Frontend**: http://localhost:3000
   - **Express Backend**: http://localhost:3003

### Method 2: Production Setup

1. **Install Dependencies**
   ```bash
   npm ci --production
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

### Method 3: Docker Installation

1. **Build Docker Image**
   ```bash
   docker build -t seo-audit-agent .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 -p 3003:3003 seo-audit-agent
   ```

## Troubleshooting Installation

### Common Issues

**Puppeteer Installation Fails**
```bash
# Manual Puppeteer installation
npm install puppeteer --unsafe-perm=true --allow-root
```

**Permission Errors on Linux/macOS**
```bash
sudo npm install -g npm@latest
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

**Port Already in Use**
```bash
# Kill processes on ports 3000 and 3003
npx kill-port 3000 3003
# Or set custom ports
PORT=3001 VITE_PORT=3001 npm run dev-full
```

**Missing System Dependencies (Linux)**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y gconf-service libasound2-dev libgbm-dev

# CentOS/RHEL
sudo yum install -y alsa-lib gtk3 libXcomposite libXcursor libXdamage libXext libXi libXtst cups-libs libXss libXrandr
```

### Verification Steps

1. **Check Node.js Version**
   ```bash
   node --version  # Should be 16.0.0+
   npm --version   # Should be 7.0.0+
   ```

2. **Test API Server**
   ```bash
   curl http://localhost:3003/api/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

3. **Test Frontend**
   - Navigate to http://localhost:3000
   - Should see SEO Audit Agent interface
   - All three tabs should be accessible

## Getting Started Guide

### Step-by-Step Usage

#### 1. **Discover Website URLs**
   - Navigate to the **"Sitemap Crawler"** tab
   - Enter your sitemap URL (e.g., `https://example.com/sitemap.xml`)
   - Click **"Crawl Sitemap"** to automatically discover all URLs
   - Review discovered URLs with their metadata (priority, last modified dates)
   - Filter URLs by date range or priority if needed

#### 2. **Run SEO Analysis**
   - Switch to the **"SEO Audit"** tab
   - **Single URL Audit**: Enter any URL directly for immediate analysis
   - **Batch Audit**: Select multiple URLs from the discovered sitemap
   - Configure audit settings (depth, timeout, etc.)
   - Click **"Run SEO Audit"** to start comprehensive analysis
   - Monitor real-time progress for batch audits

#### 3. **Analyze Results**
   - Navigate to the **"Results"** tab
   - Review overall SEO scores (0-100 scale)
   - Examine detailed issue reports with severity levels
   - View performance metrics and recommendations
   - **Export Options**:
     - CSV format for spreadsheet analysis
     - PDF reports for client presentations
   - Click **"View Details"** for comprehensive audit breakdown

### Advanced Features

#### **Batch Processing**
- Process up to 50 URLs simultaneously
- Real-time progress tracking with ETA
- Automatic retry for failed audits
- Resume interrupted batch operations

#### **Filtering & Search**
- Filter results by SEO score range
- Search specific issues across all audits
- Sort by various metrics (score, load time, issues)
- Export filtered results

#### **Performance Monitoring**
- Track Core Web Vitals metrics
- Monitor page load performance trends
- Compare before/after optimization results
- Generate performance improvement reports

## API Reference

### Health Check
**GET** `/api/health`
```bash
curl http://localhost:3003/api/health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Sitemap Crawling
**POST** `/api/crawl-sitemap`

Crawl XML sitemap and extract all URLs with metadata.

**Request:**
```json
{
  "sitemapUrl": "https://example.com/sitemap.xml"
}
```

**Response:**
```json
{
  "success": true,
  "urls": [
    {
      "loc": "https://example.com/page1",
      "priority": "1.0",
      "lastmod": "2024-01-15",
      "changefreq": "weekly"
    }
  ],
  "totalUrls": 150,
  "processingTime": 2.5
}
```

### Single URL Audit
**POST** `/api/audit`

Perform comprehensive SEO audit on a single URL.

**Request:**
```json
{
  "url": "https://example.com/page",
  "options": {
    "timeout": 30000,
    "mobile": true,
    "includeImages": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/page",
    "score": 85,
    "metrics": {
      "title": { "present": true, "length": 45, "score": 15 },
      "metaDescription": { "present": true, "length": 145, "score": 15 },
      "loadTime": 2.3,
      "mobileOptimized": true
    },
    "issues": [
      {
        "type": "warning",
        "category": "performance",
        "message": "Page load time exceeds 2 seconds",
        "recommendation": "Optimize images and enable compression"
      }
    ]
  }
}
```

### Batch URL Audit
**POST** `/api/batch-audit`

Audit multiple URLs with progress streaming and rate limiting.

**Request:**
```json
{
  "urls": [
    { "loc": "https://example.com/page1" },
    { "loc": "https://example.com/page2" },
    { "loc": "https://example.com/page3" }
  ],
  "options": {
    "maxConcurrent": 3,
    "delay": 2000,
    "timeout": 30000
  }
}
```

**Response (Server-Sent Events):**
```json
{
  "type": "progress",
  "completed": 1,
  "total": 3,
  "current": "https://example.com/page1",
  "eta": 45
}

{
  "type": "result",
  "url": "https://example.com/page1",
  "score": 78,
  "data": { /* full audit data */ }
}

{
  "type": "complete",
  "summary": {
    "totalProcessed": 3,
    "averageScore": 81.5,
    "totalTime": 67.3
  }
}
```

### Error Responses
All endpoints return consistent error responses:
```json
{
  "success": false,
  "error": "Invalid URL provided",
  "code": "INVALID_URL",
  "details": {
    "url": "invalid-url",
    "reason": "URL must include protocol (http:// or https://)"
  }
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

### Development Scripts

| Command | Description | Ports |
|---------|-------------|-------|
| `npm run dev` | Start Vite dev server only | 3000 |
| `npm run dev-full` | Start both frontend and backend | 3000, 3003 |
| `npm run client` | Start React frontend with Vite | 3000 |
| `npm run server` | Start Express API server (simple) | 3003 |
| `npm run server-full` | Start Express server (full features) | 3003 |
| `npm run build` | Build React app for production | - |
| `npm run preview` | Preview production build | 4173 |
| `npm run lint` | Run ESLint code analysis | - |
| `npm run vercel-build` | Build for Vercel deployment | - |
| `npm start` | Start production preview server | $PORT |

### Development Workflow

1. **Start Development Environment**
   ```bash
   npm run dev-full
   ```

2. **Code Quality Checks**
   ```bash
   npm run lint
   npm run build  # Test production build
   ```

3. **Testing Changes**
   - Frontend: http://localhost:3000
   - API: http://localhost:3003/api/health
   - Test sitemap: Use any public sitemap URL

4. **Production Testing**
   ```bash
   npm run build
   npm run preview
   ```

### Configuration

The application uses these configuration files:
- `vite.config.js` - Vite bundler configuration
- `tailwind.config.js` - Tailwind CSS styling
- `postcss.config.js` - PostCSS processing
- `.eslintrc.cjs` - Code linting rules

## Deployment Guide

### Production Deployment Options

#### Option 1: Traditional Server Deployment

1. **Prepare Production Build**
   ```bash
   npm ci --production
   npm run build
   ```

2. **Environment Configuration**
   Create `.env.production` file:
   ```env
   NODE_ENV=production
   VITE_API_URL=https://your-api-domain.com
   PORT=3001
   API_PORT=3003
   
   # Optional: Custom browser path for Puppeteer
   PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
   
   # Rate limiting
   MAX_REQUESTS_PER_MINUTE=60
   MAX_BATCH_SIZE=50
   ```

3. **Start Production Services**
   ```bash
   # Start API server
   npm run server &
   
   # Start frontend server
   npm start
   ```

#### Option 2: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   # Install Chromium dependencies
   RUN apk add --no-cache \
       chromium \
       nss \
       freetype \
       freetype-dev \
       harfbuzz \
       ca-certificates \
       ttf-freefont
   
   # Create app directory
   WORKDIR /app
   
   # Install dependencies
   COPY package*.json ./
   RUN npm ci --production && npm cache clean --force
   
   # Copy source code
   COPY . .
   
   # Build application
   RUN npm run build
   
   # Set Puppeteer to use installed Chromium
   ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
   ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
   
   # Expose ports
   EXPOSE 3000 3003
   
   # Start both services
   CMD ["npm", "run", "dev-full"]
   ```

2. **Build and Run Container**
   ```bash
   docker build -t seo-audit-agent .
   docker run -p 3000:3000 -p 3003:3003 seo-audit-agent
   ```

3. **Docker Compose Setup**
   ```yaml
   version: '3.8'
   services:
     seo-audit-agent:
       build: .
       ports:
         - "3000:3000"
         - "3003:3003"
       environment:
         - NODE_ENV=production
         - MAX_BATCH_SIZE=30
       volumes:
         - ./data:/app/data
       restart: unless-stopped
   ```

#### Option 3: Cloud Platform Deployment

**Vercel (Frontend Only)**
```bash
npm run vercel-build
# Deploy static files to Vercel
# API server needs separate hosting
```

**Heroku (Full Stack)**
```json
{
  "scripts": {
    "heroku-postbuild": "npm run build"
  },
  "engines": {
    "node": "18.x"
  }
}
```

**Digital Ocean App Platform**
```yaml
name: seo-audit-agent
services:
- name: web
  source_dir: /
  build_command: npm run build
  run_command: npm run dev-full
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```

### SSL/HTTPS Configuration

For production deployments, ensure HTTPS is configured:

```bash
# Using Let's Encrypt with nginx
sudo certbot --nginx -d yourdomain.com
```

Add to nginx config:
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:3003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Performance Optimization

1. **Enable Compression**
   ```bash
   # Install compression middleware
   npm install compression
   ```

2. **Configure Caching**
   ```javascript
   // In server/index.js
   app.use(express.static('dist', {
     maxAge: '1d',
     etag: true
   }));
   ```

3. **Monitor Resource Usage**
   ```bash
   # Monitor memory usage
   pm2 start server/index.js --name seo-api --max-memory-restart 1G
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
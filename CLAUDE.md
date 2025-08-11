# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Primary Commands
- `npm run dev-full` - Start both React frontend (port 3000) and Express backend (port 3003) concurrently
- `npm run dev` - Start only React frontend with Vite dev server (port 3000)
- `npm run client` - Alias for `npm run dev` - React frontend only
- `npm run server` - Start Express API server with simple configuration (port 3003)
- `npm run server-full` - Start Express server with full SEO audit features (port 3003)

### Build & Quality Commands
- `npm run build` - Build React app for production
- `npm run preview` - Preview production build locally (port 4173)
- `npm run lint` - Run ESLint code quality checks
- `npm run vercel-build` - Build optimized for Vercel deployment
- `npm start` - Start production preview server (uses $PORT env variable)

### Recommended Development Workflow
1. Use `npm run dev-full` for full-stack development with both frontend and backend
2. Use `npm run dev` when working only on frontend features
3. Always run `npm run lint` before committing changes
4. Test production builds with `npm run build && npm run preview`

## Architecture Overview

This is a React-based SEO audit tool with an Express.js backend proxy server. The application consists of three main functional areas:

**Frontend (React + Vite + Tailwind CSS)**
- Single-page application with tab-based navigation
- Three main components: SitemapCrawler, SEOAudit, Results
- State management handled in main App.jsx component
- Styled with Tailwind CSS utility classes

**Backend (Express.js + Puppeteer)**
- Proxy server running on port 3003 to handle CORS issues
- Three main API endpoints: `/api/crawl-sitemap`, `/api/audit`, `/api/batch-audit`
- Uses Puppeteer with stealth plugin for web scraping and SEO analysis
- Includes anti-detection features (rotating user agents, random delays, browser fingerprinting)
- Built-in fallback audit method using Axios + Cheerio when Puppeteer fails

**SEO Analysis Engine**
- Comprehensive SEO scoring algorithm (100-point scale) 
- Analyzes 15+ SEO factors including title tags, meta descriptions, headings, images, performance, mobile-friendliness
- Includes detailed issue resolution database with implementation guidance
- Supports both single URL audits and batch processing with rate limiting

## Key Technical Details

**Server Architecture**
- **Primary Server**: `server/index.js` - Full-featured SEO audit server with Puppeteer
- **Simple Server**: `server/simple-server.js` - Lightweight server for basic operations
- Main SEO audit function: `performSEOAudit()` with retry logic and intelligent fallback
- Fallback audit function: `performFallbackAudit()` using Axios + Cheerio
- Issue resolution system: `SEO_RESOLUTIONS` object with detailed fix guidance and implementation steps
- Advanced anti-detection: rotating user agents, stealth plugin, random delays, browser fingerprinting

**API Endpoints**
- `POST /api/crawl-sitemap` - XML sitemap parsing and URL extraction
- `POST /api/audit` - Single URL comprehensive SEO audit
- `POST /api/batch-audit` - Multiple URL processing with progress streaming
- `GET /api/health` - Server health check endpoint

**Frontend State Management**
- URLs discovered in SitemapCrawler component flow to SEOAudit component
- Audit results from SEOAudit component flow to Results component for display
- Loading states and progress tracking managed centrally in App.jsx
- Real-time batch audit progress via Server-Sent Events (SSE)

**Development vs Production Environment**
- **Development**: Vite dev server automatically proxies `/api` requests to Express server (port 3003)
- **Production**: Static build served separately from API server - requires both services running
- **Configuration**: Uses environment variables for API URLs and deployment settings

## Common Development Tasks

### SEO Analysis Engine Development
- **Primary Logic Location**: `server/index.js` - `performSEOAudit()` function contains core audit logic
- **Scoring Algorithm**: Centralized 100-point scoring system with weighted factors
- **Issue Detection**: All SEO problems detected and categorized in main audit function
- **Resolution System**: `SEO_RESOLUTIONS` object provides actionable fix guidance for each issue type
- **Testing**: Use simple test URLs or public websites for development testing

### Frontend Component Development
- **Main Components**: Located in `src/components/` directory
  - `SitemapCrawler.jsx` - Sitemap discovery and URL extraction interface
  - `SEOAudit.jsx` - Single and batch audit controls and progress display
  - `Results.jsx` - Comprehensive results dashboard with export functionality
- **State Management**: Centralized in `src/App.jsx` with props drilling to child components
- **Styling**: Uses Tailwind CSS utility classes - refer to existing components for patterns

### Backend API Development
- **Server Files**:
  - `server/index.js` - Full-featured server with Puppeteer integration
  - `server/simple-server.js` - Lightweight alternative for basic functionality
- **Anti-Detection Features**: Puppeteer with stealth plugin + rotating user agents + random delays
- **Fallback System**: Axios + Cheerio when Puppeteer detection occurs or fails
- **Rate Limiting**: Built-in throttling for batch operations to avoid blocking

### Testing and Debugging
- **Development Testing**: Use `npm run dev-full` and test with real websites
- **API Testing**: Use `curl` or Postman to test endpoints directly
- **Browser Testing**: Puppeteer issues can be debugged by setting `headless: false` in development
- **Fallback Testing**: Simulate Puppeteer failures to test Axios/Cheerio fallback path

### Performance Optimization
- **Batch Processing**: Configurable concurrency limits and delays between requests
- **Memory Management**: Puppeteer browser instances are properly closed after use
- **Caching**: Consider implementing response caching for frequently audited URLs
- **Error Handling**: Comprehensive error catching with graceful fallbacks

### Deployment Considerations
- **Environment Variables**: Configure API URLs, ports, and Puppeteer settings
- **Browser Dependencies**: Ensure Chromium/Chrome is available in production environment  
- **Resource Limits**: Monitor memory usage during batch processing operations
- **CORS Configuration**: Properly configured for cross-origin requests in production
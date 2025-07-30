# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start both React frontend (port 3000) and Express backend (port 3003) concurrently
- `npm run client` - Start only React frontend with Vite dev server
- `npm run server` - Start only Express API server
- `npm run build` - Build React app for production
- `npm run preview` - Preview production build locally  
- `npm run lint` - Run ESLint on codebase

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

**Server Architecture (`server/index.js`)**
- Main SEO audit function: `performSEOAudit()` with retry logic and fallback
- Fallback audit function: `performFallbackAudit()` using Axios/Cheerio
- Issue resolution system: `SEO_RESOLUTIONS` object with detailed fix guidance
- Anti-detection: rotating user agents, stealth plugin, random delays, browser fingerprinting

**Frontend State Flow**
- URLs discovered in SitemapCrawler flow to SEOAudit component
- Audit results from SEOAudit flow to Results component  
- Loading states managed centrally in App.jsx

**Development vs Production**
- Vite dev server proxies `/api` requests to Express server on port 3003
- Production build creates static files that need separate API server deployment

## Common Development Tasks

When working on SEO analysis features, the main logic is in `server/index.js` in the `performSEOAudit()` function. The scoring algorithm and issue detection are centralized there.

For UI changes, the three main components are in `src/components/`: SitemapCrawler.jsx, SEOAudit.jsx, and Results.jsx.

The application uses Puppeteer for accurate rendering and SEO analysis, with Axios/Cheerio as fallback when detection occurs.
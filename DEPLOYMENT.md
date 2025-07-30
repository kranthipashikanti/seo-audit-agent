# Deployment Guide for SEO Audit Agent

This guide will help you deploy the SEO Audit Agent to Vercel for production use.

## 🚀 Quick Deployment to Vercel

### Prerequisites
- Node.js 16+ installed locally
- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (free tier available)

### Step 1: Prepare Your Repository

1. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to your preferred Git provider**:
   ```bash
   # For GitHub
   git remote add origin https://github.com/yourusername/seo-audit-agent.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect the framework and configuration
5. Click "Deploy"

#### Option B: Deploy via Vercel CLI
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   cd seo-audit-agent
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N** (for first deployment)
   - Project name: **seo-audit-agent** (or your preferred name)
   - Directory: **./** (current directory)

### Step 3: Configuration

The deployment includes these key files:

- **`vercel.json`** - Vercel configuration with serverless function settings
- **`api/`** - Serverless functions for backend functionality
- **`dist/`** - Built React application (generated during deployment)

### Step 4: Environment Variables (Optional)

If you need environment variables:

1. In Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add any required variables from `.env.example`

## 📋 Production Features

### What's Included
- ✅ **Serverless API Functions**: All backend logic converted to Vercel functions
- ✅ **CORS Handling**: Proper cross-origin request configuration
- ✅ **Performance Optimized**: No Puppeteer dependency (uses faster Axios + Cheerio)
- ✅ **Rate Limiting**: Built-in delays to prevent blocking
- ✅ **Error Handling**: Comprehensive error handling and fallbacks
- ✅ **Mobile Responsive**: Tailwind CSS responsive design

### Limitations vs Local Development
- **No Puppeteer**: Uses Axios + Cheerio instead (faster but less comprehensive)
- **Function Timeouts**: 30-60 second limits per API call
- **Batch Size Limits**: Maximum 10 URLs per batch audit
- **No Real Browser Rendering**: Static HTML analysis only

## 🔧 API Endpoints

After deployment, your API endpoints will be available at:

- **Crawl Sitemap**: `https://your-app.vercel.app/api/crawl-sitemap`
- **Single Audit**: `https://your-app.vercel.app/api/audit`
- **Batch Audit**: `https://your-app.vercel.app/api/batch-audit`

## 🛠️ Local Development vs Production

### Local Development
```bash
npm run dev  # Runs both React frontend and Express server
```

### Production Build Testing
```bash
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## 📊 Performance Optimizations

The production version includes several optimizations:

1. **Lightweight Backend**: Removed Puppeteer (~170MB) for faster cold starts
2. **Efficient Parsing**: Uses Cheerio for fast HTML parsing
3. **Smart Rate Limiting**: Prevents IP blocking with random delays
4. **Compressed Assets**: Automatic gzip compression via Vercel
5. **CDN Distribution**: Global edge network via Vercel

## 🔒 Security Features

- ✅ **CORS Protection**: Configured for secure cross-origin requests
- ✅ **Input Validation**: URL validation and sanitization
- ✅ **Error Sanitization**: Safe error messages without exposing internals
- ✅ **Request Timeouts**: Prevents hanging requests
- ✅ **User Agent Rotation**: Mimics real browsers to avoid detection

## 🐛 Troubleshooting

### Common Issues

**1. Build Failures**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

**2. API Function Timeouts**
- Batch audits are limited to 10 URLs
- Individual audits timeout after 30 seconds
- Large sitemaps may need to be processed in chunks

**3. CORS Errors**
- Ensure `vercel.json` is properly configured
- Check that API calls use relative paths (`/api/...`)

**4. Environment Variables**
- Add variables in Vercel Dashboard under Settings
- Redeploy after adding new environment variables

### Getting Help

1. **Check Vercel Function Logs**: Vercel Dashboard → Your Project → Functions → View Function Details
2. **Local Testing**: Use `npm run preview` to test production build locally
3. **Browser DevTools**: Check Network tab for API request/response details

## 🚦 Monitoring & Analytics

### Vercel Built-in Analytics
- **Automatic Performance Monitoring**: Page load times, Core Web Vitals
- **Function Analytics**: Execution time, error rates, invocation counts
- **Usage Statistics**: Bandwidth, function invocations, build minutes

### Custom Monitoring (Optional)
You can add monitoring services like:
- Sentry for error tracking
- LogRocket for user session recording
- Google Analytics for usage analytics

## 💰 Cost Considerations

### Vercel Free Tier Includes:
- 100GB bandwidth per month
- 100GB-hrs of serverless function execution
- 6,000 serverless function invocations per day
- Unlimited static requests

### Optimization Tips:
- Batch audit limits help stay within function execution limits
- Static asset caching reduces bandwidth usage
- Efficient API design minimizes function invocations

---

## 🎉 You're All Set!

After following this guide, your SEO Audit Agent will be live at `https://your-project-name.vercel.app`

The application will automatically:
- ✅ Crawl XML sitemaps
- ✅ Perform comprehensive SEO audits
- ✅ Generate detailed reports with actionable recommendations
- ✅ Handle batch processing with smart rate limiting
- ✅ Provide mobile-responsive interface
- ✅ Scale automatically with traffic

**Happy auditing! 🔍📊**
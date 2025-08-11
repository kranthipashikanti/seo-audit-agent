# Production Deployment Guide

Comprehensive deployment guide for the SEO Audit Agent across multiple platforms including Vercel, traditional servers, Docker, and cloud services.

## 🎯 Deployment Options Overview

| Platform | Best For | Complexity | Cost | Full Stack Support |
|----------|----------|------------|------|-------------------|
| **Vercel** | Frontend + Serverless API | Easy | Free tier available | Limited (serverless functions) |
| **Traditional Server** | Full control | Medium | VPS costs | Full support |
| **Docker** | Containerized deployment | Medium | Infrastructure costs | Full support |
| **Digital Ocean** | Managed full-stack | Easy | $5+/month | Full support |
| **Heroku** | Quick deployment | Easy | $7+/month | Full support |

## 🚀 Method 1: Vercel Deployment (Frontend + Serverless)

### Prerequisites
- Node.js 18+ installed locally
- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (free tier available)

### Advantages
- ✅ Free tier available
- ✅ Global CDN
- ✅ Automatic SSL certificates
- ✅ Easy deployment
- ❌ Limited to serverless functions (no Puppeteer)
- ❌ Function timeout limits (30-60s)

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

## 🖥️ Method 2: Traditional Server Deployment (Full Features)

### Prerequisites
- Linux VPS (Ubuntu 20.04+ recommended)
- Root/sudo access
- Domain name (optional but recommended)

### Advantages
- ✅ Full Puppeteer support
- ✅ No function timeouts
- ✅ Complete control
- ✅ Better batch processing
- ❌ Requires server management
- ❌ Manual SSL setup

### Installation Steps

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install Puppeteer dependencies
   sudo apt-get install -y gconf-service libasound2-dev libgbm-dev \
   libatk1.0-dev libcairo-gobject2 libgtk-3-dev libgdk-pixbuf2.0-dev
   ```

2. **Application Deployment**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd seo-audit-agent
   
   # Install dependencies
   npm ci --production
   
   # Build frontend
   npm run build
   
   # Start services with PM2
   npm install -g pm2
   pm2 start server/index.js --name seo-api
   pm2 start "npm run preview" --name seo-frontend
   pm2 startup
   pm2 save
   ```

3. **Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/seo-audit-agent
   ```
   
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:4173;
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

4. **SSL Certificate (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## 🐳 Method 3: Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- Basic Docker knowledge

### Advantages
- ✅ Consistent environment
- ✅ Easy scaling
- ✅ Full feature support
- ✅ Platform independent

### Deployment Steps

1. **Create docker-compose.yml**
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
         - PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
       volumes:
         - ./data:/app/data
       restart: unless-stopped
   ```

2. **Deploy**
   ```bash
   docker-compose up -d
   ```

## ☁️ Method 4: Cloud Platform Deployment

### Digital Ocean App Platform

1. **Create app.yaml**
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
     envs:
     - key: NODE_ENV
       value: production
   ```

### Heroku Deployment

1. **Add Heroku buildpacks**
   ```bash
   heroku buildpacks:add heroku/nodejs
   heroku buildpacks:add jontewks/puppeteer
   ```

2. **Configure package.json**
   ```json
   {
     "scripts": {
       "heroku-postbuild": "npm run build",
       "start": "npm run dev-full"
     }
   }
   ```

## 🔧 API Endpoints Reference

After deployment, your API endpoints will be available at:

### Production URLs
- **Health Check**: `https://your-domain.com/api/health`
- **Crawl Sitemap**: `https://your-domain.com/api/crawl-sitemap`
- **Single Audit**: `https://your-domain.com/api/audit`
- **Batch Audit**: `https://your-domain.com/api/batch-audit`

### Testing Endpoints
```bash
# Health check
curl https://your-domain.com/api/health

# Test sitemap crawl
curl -X POST https://your-domain.com/api/crawl-sitemap \
  -H "Content-Type: application/json" \
  -d '{"sitemapUrl":"https://example.com/sitemap.xml"}'

# Test single audit
curl -X POST https://your-domain.com/api/audit \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

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
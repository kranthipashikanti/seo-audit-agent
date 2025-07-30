# Batch Audit Debugging Guide

## 🔍 Most Likely Issue: API Endpoints Not Available

The "No results received from batch audit" error usually means the API endpoints aren't accessible.

### **🚨 Are You Running in Development Mode?**

If you're using `npm run dev`, the API endpoints (`/api/batch-audit`) won't work because:
- `npm run dev` only runs the Vite frontend
- The API functions are serverless functions that need a serverless environment

### **✅ Quick Fix Options**

#### **Option 1: Run Full Development Setup**
```bash
npm run dev-full
```
This runs both the Express server AND the Vite client.

#### **Option 2: Use Production/Deployment**
Deploy to Vercel where the serverless functions work:
```bash
vercel --prod
```

#### **Option 3: Test Single URL Audit First**
Single URL audits might work if the old Express server is running.

---

## 🧪 Debugging Steps

### **Step 1: Check Console Logs**

With the new debugging code, open browser Dev Tools → Console and look for:

```
Starting batch audit with URLs: [...]
Testing API connectivity...
API test response: {...}  ← Should see this if API works
```

**If you see:**
- ✅ `API test response: {...}` → API is working, continue debugging
- ❌ `API test failed: 404` → API endpoints not available
- ❌ `Network Error` → Server not running

### **Step 2: Check Which Mode You're Running**

**Current Setup:**
- `npm run dev` → Only Vite frontend (API won't work)
- `npm run dev-full` → Express server + Vite frontend (API should work)
- `npm run server` → Only Express server
- `npm run client` → Only Vite frontend

### **Step 3: Verify API Endpoint**

Open browser and go to:
```
http://localhost:3000/api/test
```

**Expected Response:**
```json
{
  "message": "API is working!",
  "timestamp": "2025-01-XX...",
  "method": "GET"
}
```

**If 404 Error:** API endpoints not available

---

## 🛠️ Solutions by Scenario

### **Scenario 1: Running `npm run dev`**
**Problem:** Only frontend running, no API
**Solution:** 
```bash
# Stop current process (Ctrl+C)
npm run dev-full
```

### **Scenario 2: API Test Returns 404**
**Problem:** Serverless functions not available in development
**Solutions:**
1. **Use Express server:** `npm run dev-full`
2. **Deploy to Vercel:** `vercel` or `vercel --prod`
3. **Use production build:** `npm run build && npm run preview`

### **Scenario 3: API Test Works But Batch Audit Fails**
**Problem:** Issue with batch audit logic
**Console should show:**
```
Starting batch audit with URLs: [...]
API test response: {message: "API is working!"}
Calling batch audit API...
Full axios response: {...}
Batch audit response data: {...}
```

### **Scenario 4: Network Errors**
**Problem:** Server not running or wrong port
**Solutions:**
1. Check if server is running on port 3003
2. Restart development server
3. Check for port conflicts

---

## 📋 Quick Troubleshooting Checklist

### **✅ Basic Checks**
- [ ] Are you running `npm run dev-full` (not just `npm run dev`)?
- [ ] Can you access `http://localhost:3000/api/test`?
- [ ] Are there console errors in browser dev tools?
- [ ] Did the sitemap crawler work and find URLs?

### **✅ Console Log Checks**
Open browser Dev Tools → Console and look for:
- [ ] "Starting batch audit with URLs: [...]"
- [ ] "API test response: {...}" ← **Most important**
- [ ] "Calling batch audit API..."
- [ ] "Full axios response: {...}"

### **✅ Network Tab Checks**
Open browser Dev Tools → Network tab:
- [ ] Do you see a request to `/api/batch-audit`?
- [ ] What's the response status (200, 404, 500)?
- [ ] What's the response body?

---

## 🚀 Recommended Solution

**Try this first:**
```bash
# Stop current process (Ctrl+C if running)
npm run dev-full
```

Then:
1. Wait for both servers to start
2. Open `http://localhost:3000`
3. Try the batch audit again
4. Check console for the debugging messages

If that doesn't work, open browser Dev Tools → Console and share the console output - the new debugging code will show exactly what's happening!

---

## 📞 Next Steps

**Share the console output** after trying `npm run dev-full`. Look for these specific messages:
- "API test response" (shows if API is working)
- "Batch audit response data" (shows what API returned)
- Any error messages in red

This will tell us exactly where the issue is!
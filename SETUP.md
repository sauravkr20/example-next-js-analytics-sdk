# Setup Instructions

## Quick Fix for Current Errors

You're seeing errors because:
1. **No backend running** - HTTP endpoint `http://localhost:8080/track` doesn't exist
2. **Placeholder GTM ID** - Using 'GTM-XXXXXXX' which isn't valid

### Solution 1: Just Use GTM (Recommended for testing)

1. Get a real GTM Container ID from [Google Tag Manager](https://tagmanager.google.com/)
2. Create `.env.local`:
   ```bash
   NEXT_PUBLIC_GTM_ID=GTM-YOUR-REAL-ID
   ```
3. Restart the dev server

Events will still go to GTM even without a backend!

### Solution 2: Mock Backend (For full testing)

If you want to test both HTTP and GTM:

**Terminal 1 - Mock Server:**
```bash
# Create a simple mock server
npx json-server --watch db.json --port 8080 --routes routes.json
```

**Terminal 2 - Next.js:**
```bash
npm run dev
```

### Solution 3: Disable HTTP Endpoint Temporarily

Update `lib/analytics.ts`:

```typescript
initAnalytics({
  apiUrl: "https://httpbin.org/post", // Use a test endpoint
  gtm: {
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || "GTM-XXXXXXX",
    enabled: true,
  },
  debug: true,
});
```

## What Changed

The SDK now handles failures gracefully:
- ✅ HTTP failures won't crash your app
- ✅ GTM failures won't crash your app  
- ✅ Events still tracked by working transports
- ✅ Warnings logged instead of errors thrown

## Verify It's Working

Open browser console and look for:
```
[Analytics] GTM: Event pushed to dataLayer: {...}
```

Or inspect the dataLayer:
```javascript
console.log(window.dataLayer)
```

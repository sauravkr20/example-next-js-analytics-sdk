## ✨ Updates

### Backend Enable/Disable Support

You can now control whether the HTTP backend transport is enabled, just like GTM!

## Usage Examples

### Example 1: Both HTTP Backend + GTM (Default)
```bash
# .env.local
NEXT_PUBLIC_GTM_ID=GTM-5Q8MCHGP
NEXT_PUBLIC_BACKEND_ENABLED=true
NEXT_PUBLIC_GTM_ENABLED=true
NEXT_PUBLIC_ANALYTICS_API_URL=https://httpbin.org/post
```

Events are sent to **both** HTTP endpoint and GTM dataLayer.

### Example 2: GTM-Only Mode
```bash
# .env.local
NEXT_PUBLIC_GTM_ID=GTM-5Q8MCHGP
NEXT_PUBLIC_BACKEND_ENABLED=false  # ← Disable HTTP backend
NEXT_PUBLIC_GTM_ENABLED=true
```

Perfect for:
- Client-side only tracking
- When you only use Google Analytics/GTM
- No backend infrastructure needed

### Example 3: Backend-Only Mode
```bash
# .env.local
NEXT_PUBLIC_GTM_ENABLED=false  # ← Disable GTM
NEXT_PUBLIC_BACKEND_ENABLED=true
NEXT_PUBLIC_ANALYTICS_API_URL=https://api.your-server.com/track
```

Perfect for:
- Server-side analytics only
- Custom analytics solution
- Privacy-focused implementations

### Example 4: Dynamic Configuration
```typescript
// You can also control this programmatically
initAnalytics({
  apiUrl: "https://api.example.com/track",
  backend: {
    enabled: shouldUseBackend(),  // Dynamic toggle
  },
  gtm: {
    gtmId: "GTM-XXXXXXX",
    enabled: shouldUseGTM(),  // Dynamic toggle
  },
});
```

## Configuration Details

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `NEXT_PUBLIC_GTM_ID` | `GTM-XXXXXXX` | Your GTM Container ID |
| `NEXT_PUBLIC_GTM_ENABLED` | `true` | Enable/disable GTM tracking |
| `NEXT_PUBLIC_BACKEND_ENABLED` | `true` | Enable/disable HTTP backend |
| `NEXT_PUBLIC_ANALYTICS_API_URL` | `https://httpbin.org/post` | HTTP backend endpoint |

## Testing

### Test GTM-Only Mode
```bash
# Set environment
NEXT_PUBLIC_BACKEND_ENABLED=false

# Run dev server
npm run dev

# Check browser console - should see:
# [Analytics] No HTTP transport - events sent to GTM only
# [Analytics] GTM: Event pushed to dataLayer: {...}
```

### Test Backend-Only Mode
```bash
# Set environment
NEXT_PUBLIC_GTM_ENABLED=false

# Run dev server
npm run dev

# Check browser console - should see:
# [Analytics] No GTM transport - events sent to HTTP only
# [Analytics] Event sent successfully
```

## Benefits

✅ **Flexibility**: Choose the right transport for your needs  
✅ **Performance**: Disable unused transports  
✅ **Privacy**: Backend-only mode for sensitive data  
✅ **Testing**: Easy to test individual transports  
✅ **Cost**: Reduce API calls when using GTM-only

Restart your dev server to see the changes!

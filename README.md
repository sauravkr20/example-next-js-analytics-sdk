# Analytics SDK + GTM Integration - Next.js Example

This is a [Next.js](https://nextjs.org) example project demonstrating the Analytics SDK with **Google Tag Manager (GTM) integration**.

## 🚀 Features

- ✅ Analytics SDK with GTM and CleverTap integration
- ✅ Automatic GTM and CleverTap script loading
- ✅ Events sent to HTTP endpoint, GTM dataLayer, and CleverTap
- ✅ **Channel selection** - Send events to specific transports
- ✅ User identification and session tracking
- ✅ E-commerce event tracking examples
- ✅ TypeScript support
- ✅ Next.js 16 App Router

## 📋 Prerequisites

- Node.js 18+ 
- A Google Tag Manager account (optional for testing)
- Analytics backend endpoint (or use the mock endpoint)

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Google Tag Manager Container ID
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Enable/Disable GTM (default: true)
NEXT_PUBLIC_GTM_ENABLED=true

# Analytics API endpoint (optional if using GTM-only)
NEXT_PUBLIC_ANALYTICS_API_URL=https://api.example.com/track

# Enable/Disable HTTP Backend (default: true)
NEXT_PUBLIC_BACKEND_ENABLED=true
```

**Configuration Modes:**

- **Both enabled** (default): Events sent to both HTTP backend and GTM
- **GTM-only**: Set `NEXT_PUBLIC_BACKEND_ENABLED=false`
- **Backend-only**: Set `NEXT_PUBLIC_GTM_ENABLED=false`

**Replace `GTM-XXXXXXX` with your actual GTM Container ID.**

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📖 How It Works

### Analytics Initialization

The analytics SDK is initialized in `lib/analytics.ts` with GTM configuration:

```typescript
initAnalytics({
  apiUrl: "http://localhost:8080/track",
  gtm: {
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || "GTM-XXXXXXX",
    enabled: true,
    dataLayerName: "dataLayer", // Optional
  },
  debug: process.env.NODE_ENV === "development",
});
```

### Tracking Events

Events are tracked using the `track()` method:

```typescript
import { getAnalytics } from "analytics-js-sdk";

const analytics = getAnalytics();

// Send to all enabled channels (default)
analytics.track("purchase", {
  order_id: "order_123",
  total: 99.99,
  currency: "USD",
});

// Send to specific channels only
analytics.track("product_view", {
  product_id: "prod_123"
}, {
  channels: ['gtm', 'clevertap']  // Only GTM and CleverTap
});

// Send to single channel
analytics.track("page_view", {
  page: "/home"
}, {
  channels: ['gtm']  // GTM only
});
```

**Available channels:** `'backend'` | `'gtm'` | `'clevertap'`

### Event Flow

1. **Event tracked** → Analytics SDK
2. **Sent to HTTP endpoint** → Your analytics backend
3. **Pushed to GTM dataLayer** → Google Tag Manager
4. **GTM processes** → Triggers, variables, and tags fire

## 🎯 GTM Configuration

### Setting Up Triggers

1. Go to your GTM container
2. Create a new trigger:
   - **Trigger Type**: Custom Event
   - **Event name**: `purchase` (or any event name you're tracking)
3. Use this trigger to fire your tags

### Creating Variables

1. Create Data Layer Variables:
   - **Variable Type**: Data Layer Variable
   - **Data Layer Variable Name**: `order_id`, `total`, `currency`, etc.
2. Use these variables in your tags

### Example GTM Event Format

When you track an event, it's pushed to `window.dataLayer` in this format:

```javascript
{
  event: "purchase",
  timestamp: 1234567890,
  session_id: "sess_abc123",
  user_id: "user_123", // If user is identified
  order_id: "order_123",
  total: 99.99,
  currency: "USD"
}
```

## 🧪 Testing

### Verify GTM Events

1. Open browser console
2. Type `window.dataLayer` to see all events
3. Look for your tracked events with their properties

### GTM Preview Mode

1. In GTM, click **Preview**
2. Enter your localhost URL: `http://localhost:3000`
3. Interact with the demo page
4. See events fire in real-time in GTM debugger

### Debug Mode

In development, debug logs are automatically enabled:

```bash
[Analytics] GTM: Event pushed to dataLayer: {...}
[Analytics] Event sent successfully
```

## 📂 Project Structure

```button_clicked` - Track button clicks → **All channels**
- `page_view` - Track page views → **GTM only**
- `product_view` - Track product views → **GTM + CleverTap**
- `add_to_cart` - Track add to cart actions → **CleverTap only**
- `purchase` - Track completed purchases → **Backend + CleverTap**
- `analytics_event` - Analytics tracking → **GTM only**
- `user_engagement` - Engagement events → **CleverTap only**
- `server_log` - Server-side logs → **Backend only**

Each button in the demo shows which channels it uses!

lib/
└── analytics.ts        # Analytics SDK initialization

public/                 # Static assets

.env.local             # Environment variables (create this)
package.json           # Dependencies
tsconfig.json          # TypeScript config
```

## 📚 Available Events in Demo

- `page_view` - Track page views
- `button_clicked` - Track button clicks
- `product_view` - Track product views
- `add_to_cart` - Track add to cart actions
- `purchase` - Track completed purchases

## 🔍 Troubleshooting

### GTM Not Loading

- Check that `NEXT_PUBLIC_GTM_ID` is set correctly
- Verify the GTM ID format: `GTM-XXXXXXX`
- Check browser console for errors

### Events Not Appearing in GTM

- Ensure `enabled: true` in GTM config
- Check `window.dataLayer` in console
- Verify GTM container is published
- Use GTM Preview mode to debug

### TypeScript Errors

- Ensure `analytics-js-sdk` is properly installed
- Run `npm install` to install dependencies
- Check that SDK types are exported correctly

## 🚢 Deployment

### Environment Variables

Make sure to set environment variables in your deployment platform:

- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Other**: Check your platform's documentation

### Build

```bash
npm run build
npm run start
```Channel Selection Guide](CHANNEL_SELECTION.md) - Send events to specific channels
- [GTM Setup Guide](GTM_GUIDE.md)
- [CleverTap Setup Guide](CLEVERTAP_GUIDE.md)
- [Backend Configuration](BACKEND_CONFIG.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google Tag Manager](https://tagmanager.google.com/)
- [GTM Developer Guide](https://developers.google.com/tag-platform/tag-manager)
- [CleverTap Documentation](https://developer.clevertap.com/docs

- [Analytics SDK Documentation](../../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google Tag Manager](https://tagmanager.google.com/)
- [GTM Developer Guide](https://developers.google.com/tag-platform/tag-manager)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT

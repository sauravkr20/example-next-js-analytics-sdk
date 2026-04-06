# CleverTap Integration Guide

Complete guide for integrating CleverTap with the Analytics SDK.

## Quick Setup

### 1. Get Your CleverTap Account ID

1. Log in to your [CleverTap Dashboard](https://dashboard.clevertap.com/)
2. Go to **Settings** → **Project Settings**
3. Copy your **Account ID** (format: `ACCOUNT-ID` or similar)
4. Note your **Region** if applicable (e.g., `in1` for India, `sg1` for Singapore)

### 2. Configure Environment Variables

Update `.env.local`:

```bash
# CleverTap Configuration
NEXT_PUBLIC_CLEVERTAP_ACCOUNT_ID=YOUR-ACTUAL-ACCOUNT-ID
NEXT_PUBLIC_CLEVERTAP_ENABLED=true
NEXT_PUBLIC_CLEVERTAP_REGION=in1  # Optional: your region
```

### 3. Restart Your Dev Server

```bash
npm run dev
```

## Configuration Modes

### All Transports Enabled (Recommended)

```bash
# .env.local
NEXT_PUBLIC_BACKEND_ENABLED=true
NEXT_PUBLIC_GTM_ENABLED=true
NEXT_PUBLIC_CLEVERTAP_ENABLED=true
```

Events are sent to HTTP backend, GTM, **and** CleverTap simultaneously.

### CleverTap + GTM Only

```bash
NEXT_PUBLIC_BACKEND_ENABLED=false
NEXT_PUBLIC_GTM_ENABLED=true
NEXT_PUBLIC_CLEVERTAP_ENABLED=true
```

Perfect for client-side tracking without a custom backend.

### CleverTap Only

```bash
NEXT_PUBLIC_BACKEND_ENABLED=false
NEXT_PUBLIC_GTM_ENABLED=false
NEXT_PUBLIC_CLEVERTAP_ENABLED=true
```

Use only CleverTap for analytics.

## CleverTap Event Format

When you track an event, it's sent to CleverTap like this:

```javascript
// Your code
analytics.track('product_viewed', {
  product_id: 'prod_123',
  product_name: 'Widget',
  price: 99.99,
  currency: 'USD'
});

// CleverTap receives
clevertap.event.push('product_viewed', {
  timestamp: 1234567890,
  session_id: 'sess_abc123',
  user_id: 'user_123',  // if identified
  product_id: 'prod_123',
  product_name: 'Widget',
  price: 99.99,
  currency: 'USD'
});
```

## User Identification

When you identify a user, CleverTap profile is automatically updated:

```typescript
// Your code
analytics.identify('user_12345');

// CleverTap receives
clevertap.onUserLogin.push({
  Site: {
    Identity: 'user_12345'
  }
});
```

## Verifying Integration

### Check Browser Console

With debug mode enabled (development), you'll see:

```
[Analytics] CleverTap: Initialized with Account ID YOUR-ID
[Analytics] CleverTap: Event pushed: product_viewed {...}
```

### Check CleverTap Dashboard

1. Go to **Analytics** → **Events** in CleverTap
2. Events should appear within a few minutes
3. Check **Live Feed** for real-time events

### Inspect window.clevertap

Open browser console and type:

```javascript
// Check if CleverTap is loaded
window.clevertap

// Should show CleverTap SDK object with methods
```

## Common Event Examples

### Page View

```typescript
analytics.track('page_view', {
  page: '/products',
  title: 'Products Page',
  referrer: document.referrer
});
```

### Product Interactions

```typescript
// View product
analytics.track('product_viewed', {
  product_id: 'prod_123',
  product_name: 'Premium Widget',
  category: 'widgets',
  price: 99.99,
  currency: 'USD'
});

// Add to cart
analytics.track('add_to_cart', {
  product_id: 'prod_123',
  quantity: 1,
  price: 99.99
});
```

### E-commerce Purchase

```typescript
analytics.track('purchase', {
  order_id: 'order_xyz789',
  total: 149.99,
  tax: 10.00,
  shipping: 5.00,
  currency: 'USD',
  items_count: 3,
  payment_method: 'credit_card'
});
```

### User Engagement

```typescript
// Button click
analytics.track('button_clicked', {
  button_id: 'signup-cta',
  button_text: 'Sign Up Now',
  page: window.location.pathname
});

// Form submission
analytics.track('form_submitted', {
  form_id: 'contact-form',
  form_type: 'contact'
});
```

## CleverTap Regions

If your account is in a specific region, set the region:

```bash
# India
NEXT_PUBLIC_CLEVERTAP_REGION=in1

# Singapore  
NEXT_PUBLIC_CLEVERTAP_REGION=sg1

# US
NEXT_PUBLIC_CLEVERTAP_REGION=us1

# Europe
NEXT_PUBLIC_CLEVERTAP_REGION=eu1

# Middle East
NEXT_PUBLIC_CLEVERTAP_REGION=mena1
```

## Advanced Configuration

### Programmatic Control

```typescript
import { initAnalytics } from 'analytics-js-sdk';

const analytics = initAnalytics({
  clevertap: {
    accountId: process.env.NEXT_PUBLIC_CLEVERTAP_ACCOUNT_ID!,
    enabled: shouldEnableCleverTap(), // Dynamic toggle
    region: 'in1',
    targetDomain: 'custom.clevertap.com' // Custom domain
  }
});
```

### Custom Domain

If you have a custom CleverTap domain:

```bash
NEXT_PUBLIC_CLEVERTAP_TARGET_DOMAIN=analytics.yourcompany.com
```

## Troubleshooting

### Events Not Appearing in CleverTap

**Check Account ID:**
```bash
# Verify format
NEXT_PUBLIC_CLEVERTAP_ACCOUNT_ID=XXX-XXX-XXXX
```

**Check Console:**
```javascript
// Should show CleverTap object
console.log(window.clevertap);

// Check for errors
// Look for: [Analytics] CleverTap: ...
```

**Verify SDK Loaded:**
```javascript
// Should find CleverTap script
document.querySelector('script[src*="clevertap"]');
```

### CleverTap Script Not Loading

- Check your Account ID is correct
- Verify network connectivity
- Check browser console for errors
- Ensure no ad blockers are interfering

### Events Delayed

- CleverTap may have a few minutes delay
- Check **Live Feed** in dashboard for real-time
- Verify event appears in browser console first

### TypeScript Errors

If you see CleverTap type errors:

```typescript
// The SDK handles this automatically
// CleverTap types are declared in clevertap-transport.ts
```

## Best Practices

1. **Use Meaningful Event Names**: `product_viewed` not `pv`
2. **Consistent Properties**: Always use same property names
3. **Include Context**: Add `page`, `referrer`, etc.
4. **Test in Development**: Enable debug mode
5. **Monitor Dashboard**: Check CleverTap dashboard regularly
6. **User Identification**: Call `identify()` for logged-in users
7. **Privacy Compliance**: Follow data protection regulations

## CleverTap Features

Once integrated, you can use CleverTap for:

- 📊 **Analytics** - Rich event analysis and funnels
- 👥 **Segmentation** - Group users by behavior
- 📬 **Campaigns** - Push notifications and in-app messages
- 🎯 **Personalization** - Customize user experience
- 🔄 **Journeys** - Automated user flows
- 🧪 **A/B Testing** - Optimize conversions

## Resources

- [CleverTap Documentation](https://developer.clevertap.com/docs)
- [CleverTap Dashboard](https://dashboard.clevertap.com/)
- [Analytics SDK Docs](../../README.md)
- [Event Best Practices](https://developer.clevertap.com/docs/event-properties)

## Support

For CleverTap-specific issues:
- CleverTap Support: support@clevertap.com
- [CleverTap Community](https://community.clevertap.com/)

For SDK integration issues:
- Check the main [README](../../README.md)
- Enable debug mode to see detailed logs

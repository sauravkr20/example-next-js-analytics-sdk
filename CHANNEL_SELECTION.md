# Channel Selection Guide

Learn how to send events to specific transport channels for optimized tracking.

## Overview

By default, events are sent to **all enabled transports** (Backend, GTM, CleverTap). But you can specify exactly which channels should receive each event using the `channels` option.

## Basic Usage

```typescript
import { getAnalytics } from 'analytics-js-sdk';

const analytics = getAnalytics();

// Default: All channels
analytics.track('event_name', { prop: 'value' });

// Specific channels
analytics.track('event_name', { prop: 'value' }, {
  channels: ['gtm', 'clevertap']
});
```

## Channel Options

Available channels:
- `'backend'` - HTTP backend endpoint
- `'gtm'` - Google Tag Manager
- `'clevertap'` - CleverTap

## Common Patterns

### Analytics/Marketing Events → GTM Only

```typescript
// Page views
analytics.track('page_view', {
  page: '/products',
  title: 'Products Page'
}, { channels: ['gtm'] });

// Button clicks
analytics.track('button_click', {
  button_id: 'signup-cta',
  button_text: 'Sign Up'
}, { channels: ['gtm'] });

// Scroll depth
analytics.track('scroll_depth', {
  depth_percent: 75,
  page: '/blog/article'
}, { channels: ['gtm'] });
```

**Why GTM only?**
- Reduces backend load
- Analytics data stays in GA4/Google Ads
- Marketing team has full control

### User Engagement → CleverTap Only

```typescript
// Feature usage
analytics.track('feature_used', {
  feature: 'wishlist',
  action: 'add_item'
}, { channels: ['clevertap'] });

// In-app actions
analytics.track('notification_clicked', {
  notification_id: 'promo_123',
  campaign: 'summer_sale'
}, { channels: ['clevertap'] });

// User milestones
analytics.track('milestone_reached', {
  milestone: 'first_purchase',
  days_since_signup: 3
}, { channels: ['clevertap'] });
```

**Why CleverTap only?**
- Powers personalized campaigns
- Triggers push notifications
- Updates user segments in real-time

### Critical Events → Backend + CleverTap

```typescript
// Purchases (backend for records, CleverTap for campaigns)
analytics.track('purchase', {
  order_id: 'order_xyz123',
  total: 149.99,
  currency: 'USD',
  items_count: 3
}, { channels: ['backend', 'clevertap'] });

// Account events
analytics.track('account_created', {
  user_id: 'user_123',
  signup_method: 'google',
  plan: 'premium'
}, { channels: ['backend', 'clevertap'] });

// Important actions
analytics.track('subscription_started', {
  plan: 'premium',
  billing_cycle: 'monthly',
  price: 29.99
}, { channels: ['backend', 'clevertap'] });
```

**Why both?**
- Backend: Permanent record, analytics, business intelligence
- CleverTap: User engagement, retention campaigns

### Server-Side Only → Backend Only

```typescript
// API errors
analytics.track('api_error', {
  endpoint: '/api/users',
  status_code: 500,
  error_message: 'Database timeout'
}, { channels: ['backend'] });

// Audit logs
analytics.track('admin_action', {
  admin_id: 'admin_123',
  action: 'user_deleted',
  target_user: 'user_456'
}, { channels: ['backend'] });

// System events
analytics.track('cache_cleared', {
  cache_type: 'redis',
  keys_cleared: 1234
}, { channels: ['backend'] });
```

**Why backend only?**
- Internal operations
- No need for client-side analytics
- Security/audit requirements

## Strategy Examples

### E-commerce Site

```typescript
// Product browsing → GTM (for Google Analytics)
analytics.track('product_viewed', {...}, { channels: ['gtm'] });

// Add to cart → CleverTap (for abandoned cart campaigns)
analytics.track('add_to_cart', {...}, { channels: ['clevertap'] });

// Purchase → Backend + CleverTap (records + campaigns)
analytics.track('purchase', {...}, { channels: ['backend', 'clevertap'] });

// Returns → Backend only (internal process)
analytics.track('return_initiated', {...}, { channels: ['backend'] });
```

### SaaS Application

```typescript
// Page navigation → GTM
analytics.track('page_view', {...}, { channels: ['gtm'] });

// Feature usage → CleverTap (for engagement)
analytics.track('feature_used', {...}, { channels: ['clevertap'] });

// Upgrade → All channels
analytics.track('plan_upgraded', {...}); // Default: all

// API usage → Backend (for billing)
analytics.track('api_call', {...}, { channels: ['backend'] });
```

### Mobile App

```typescript
// Screen views → GTM + CleverTap
analytics.track('screen_view', {...}, { channels: ['gtm', 'clevertap'] });

// Button taps → CleverTap
analytics.track('button_tapped', {...}, { channels: ['clevertap'] });

// Purchases → Backend + CleverTap
analytics.track('in_app_purchase', {...}, { channels: ['backend', 'clevertap'] });

// Crashes → Backend
analytics.track('app_crashed', {...}, { channels: ['backend'] });
```

## Performance Considerations

### Reduce Backend Load

```typescript
// High-frequency events → Client-side only
analytics.track('scroll_event', {...}, { channels: ['gtm'] });
analytics.track('mouse_move', {...}, { channels: ['gtm'] });
```

### Reduce Client-Side Overhead

```typescript
// Low-priority events → Backend only
analytics track('background_sync', {...}, { channels: ['backend'] });
```

### Optimize for Use Case

```typescript
// Marketing team needs data → GTM
// Product team needs engagement → CleverTap
// Engineering needs logs → Backend

analytics.track('user_action', {...}, {
  channels: ['gtm', 'clevertap']  // Skip backend
});
```

## TypeScript Support

Full type safety:

```typescript
import type { TransportChannel } from 'analytics-js-sdk';

const channels: TransportChannel[] = ['backend', 'gtm'];

analytics.track('event', {}, { channels });
```

## Debug Mode

In development, see which channels are used:

```typescript
// Console output:
// [Analytics] Sending event "purchase" to channels: ['backend', 'clevertap']
```

## Best Practices

1. **Default to all channels** for important events
2. **Use GTM** for marketing/analytics tracking
3. **Use CleverTap** for user engagement/messaging
4. **Use Backend** for permanent records/logs
5. **Combine strategically** based on business needs
6. **Document your strategy** so team knows the pattern
7. **Test each channel** to ensure events arrive

## Common Mistakes

❌ **Don't send everything everywhere**
```typescript
// Wasteful - sending scroll events to backend
analytics.track('scroll', {...}); // Goes to all by default
```

✅ **Do optimize by channel**
```typescript
// Efficient - only to analytics platform
analytics.track('scroll', {...}, { channels: ['gtm'] });
```

❌ **Don't skip critical events**
```typescript
// Missing - purchase not in backend
analytics.track('purchase', {...}, { channels: ['gtm'] });
```

✅ **Do track important events in backend**
```typescript
// Correct - backend has permanent record
analytics.track('purchase', {...}, { channels: ['backend', 'clevertap'] });
```

## Questions?

- **Q: What if I specify a disabled channel?**
  - A: It's safely ignored. Only enabled transports receive events.

- **Q: Can I change channels per environment?**
  - A: Yes! Use environment variables to control channel selection.

- **Q: What's the performance impact?**
  - A: Minimal. Sending to fewer channels reduces network calls.

- **Q: Can I add custom channels?**
  - A: Not yet, but you can extend the SDK to add new transports.

## Related Guides

- [GTM Integration](GTM_GUIDE.md)
- [CleverTap Integration](CLEVERTAP_GUIDE.md)
- [Backend Configuration](BACKEND_CONFIG.md)

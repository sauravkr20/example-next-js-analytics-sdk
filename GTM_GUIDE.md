# GTM Integration Guide for Next.js

This guide explains how to set up and use Google Tag Manager with the Analytics SDK in your Next.js application.

## Quick Start

### 1. Get Your GTM Container ID

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new container (or use existing)
3. Copy your Container ID (format: `GTM-XXXXXXX`)

### 2. Configure Your App

Create `.env.local` file:

```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### 3. Verify Installation

1. Run your app: `npm run dev`
2. Open browser console
3. Type: `window.dataLayer`
4. You should see GTM events

## Event Structure

All tracked events are pushed to `window.dataLayer` with this structure:

```javascript
{
  event: "event_name",        // Event identifier
  timestamp: 1234567890,      // Unix timestamp
  session_id: "sess_abc",     // Unique session ID
  user_id: "user_123",        // User ID (if identified)
  // ... custom properties
}
```

## Setting Up GTM Triggers

### Example: Purchase Event Trigger

1. In GTM, go to **Triggers** → **New**
2. Choose **Custom Event**
3. Event name: `purchase`
4. Save the trigger

### Example: All Events Trigger

1. Event name: `.*` (regex)
2. Check "Use regex matching"
3. This catches all events

## Creating GTM Variables

### User ID Variable

1. Go to **Variables** → **New**
2. Variable Type: **Data Layer Variable**
3. Data Layer Variable Name: `user_id`
4. Save as `User ID`

### Common Variables to Create

- `session_id` - Session identifier
- `page` - Current page path
- `order_id` - Order/transaction ID
- `total` - Purchase total
- `currency` - Currency code
- `product_id` - Product identifier
- `timestamp` - Event timestamp

## Example Tags

### Google Analytics 4 Event Tag

1. Tag Type: **Google Analytics: GA4 Event**
2. Configuration Tag: [Your GA4 Config Tag]
3. Event Name: `{{Event}}` (use GTM's built-in Event variable)
4. Event Parameters:
   - `user_id`: `{{User ID}}`
   - `session_id`: `{{session_id}}`
   - Add more parameters as needed
5. Trigger: Your custom event trigger

### Facebook Pixel Purchase Event

1. Tag Type: **Facebook Pixel**
2. Pixel ID: [Your Facebook Pixel ID]
3. Event: Purchase
4. Object Properties:
   - value: `{{total}}`
   - currency: `{{currency}}`
   - content_ids: `{{product_id}}`
5. Trigger: `purchase` event

## Testing in GTM Preview Mode

1. In GTM, click **Preview**
2. Enter: `http://localhost:3000`
3. A new tab opens with GTM debugger
4. Interact with your app
5. See events fire in real-time
6. Debug any issues

## Common Event Examples

### Page View

```typescript
analytics.track("page_view", {
  page: "/products",
  title: "Products Page",
  referrer: document.referrer
});
```

**GTM dataLayer:**
```javascript
{
  event: "page_view",
  page: "/products",
  title: "Products Page",
  referrer: "...",
  timestamp: 1234567890,
  session_id: "sess_abc"
}
```

### Add to Cart

```typescript
analytics.track("add_to_cart", {
  product_id: "prod_123",
  product_name: "Widget",
  price: 29.99,
  quantity: 2,
  currency: "USD"
});
```

**GTM dataLayer:**
```javascript
{
  event: "add_to_cart",
  product_id: "prod_123",
  product_name: "Widget",
  price: 29.99,
  quantity: 2,
  currency: "USD",
  timestamp: 1234567890,
  session_id: "sess_abc",
  user_id: "user_123" // if identified
}
```

### Purchase

```typescript
analytics.track("purchase", {
  order_id: "order_xyz789",
  total: 149.99,
  tax: 10.00,
  shipping: 5.00,
  currency: "USD",
  items_count: 3
});
```

**GTM dataLayer:**
```javascript
{
  event: "purchase",
  order_id: "order_xyz789",
  total: 149.99,
  tax: 10.00,
  shipping: 5.00,
  currency: "USD",
  items_count: 3,
  timestamp: 1234567890,
  session_id: "sess_abc",
  user_id: "user_123"
}
```

## Advanced Patterns

### Conditional Tag Firing

Fire tags only for specific users:

1. Create a Variable: `User Type` = `{{user_id}}` matches regex `^premium_.*`
2. Use in trigger: Fire when `User Type` equals `true`

### Event Filtering

Track only high-value purchases:

1. Create Trigger: `purchase` event
2. Add condition: `{{total}}` greater than `100`

### Custom Event Properties

Any property you add to `track()` is available in GTM:

```typescript
analytics.track("custom_event", {
  custom_prop_1: "value1",
  custom_prop_2: 42,
  nested_data: { key: "value" }
});
```

Access in GTM as: `{{custom_prop_1}}`, `{{custom_prop_2}}`, etc.

## Debugging

### Check dataLayer in Console

```javascript
// See all events
console.log(window.dataLayer);

// Filter to your events
window.dataLayer.filter(e => e.event === 'purchase');

// Watch for new events
const original = window.dataLayer.push;
window.dataLayer.push = function(...args) {
  console.log('New dataLayer event:', args);
  return original.apply(this, args);
};
```

### Enable Debug Mode

In your app:

```typescript
initAnalytics({
  apiUrl: "...",
  gtm: {
    gtmId: "GTM-XXXXXXX",
    enabled: true
  },
  debug: true // Enable debug logs
});
```

### Common Issues

**Events not appearing:**
- Check `NEXT_PUBLIC_GTM_ID` is set correctly
- Verify GTM container is published
- Check browser console for errors
- Ensure `enabled: true` in GTM config

**Variables undefined:**
- Check variable names match exactly
- Verify data is in dataLayer
- Use GTM Preview to inspect values

**Tags not firing:**
- Check trigger conditions
- Verify trigger matches event name
- Use GTM Preview to debug
- Check tag configuration

## Best Practices

1. **Use meaningful event names**: `product_view`, not `pv`
2. **Be consistent**: Always use same property names
3. **Include context**: Add `page`, `referrer`, etc.
4. **Test thoroughly**: Use GTM Preview mode
5. **Document events**: Keep a list of events and properties
6. **Version control**: Export GTM container regularly
7. **Monitor performance**: GTM can impact page speed

## Resources

- [GTM Developer Guide](https://developers.google.com/tag-platform/tag-manager)
- [GTM Best Practices](https://support.google.com/tagmanager/answer/9442095)
- [DataLayer Reference](https://developers.google.com/tag-platform/tag-manager/datalayer)
- [Analytics SDK Docs](../../README.md)

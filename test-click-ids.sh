#!/bin/bash

# Click ID Tracking Test Script
# Tests gclid (Google Ads) and fbclid (Facebook Ads) parameter capture

echo "🔗 Testing Click ID Tracking (gclid & fbclid)..."
echo ""

# Example 1: Google Ads click with gclid
echo "📊 Example 1: Google Ads Click (gclid)"
open "http://localhost:3000/?gclid=EAIaIQobChMI_example_gclid_123&utm_source=google&utm_medium=cpc&utm_campaign=spring_sale"
echo ""
sleep 2

# Example 2: Facebook Ads click with fbclid
echo "📱 Example 2: Facebook Ads Click (fbclid)"
open "http://localhost:3000/?fbclid=IwAR3_example_fbclid_456&utm_source=facebook&utm_medium=cpc&utm_campaign=retargeting"
echo ""
sleep 2

# Example 3: Both gclid and fbclid (unusual but possible via redirects)
echo "🔀 Example 3: Both gclid + fbclid"
open "http://localhost:3000/?gclid=EAIaIQobChMI_both_789&fbclid=IwAR3_both_012&utm_source=google&utm_medium=cpc"
echo ""
sleep 2

# Example 4: Purchase page with gclid
echo "🛒 Example 4: Purchase Page with gclid"
open "http://localhost:3000/purchase?gclid=EAIaIQobChMI_purchase_345&utm_source=google&utm_medium=cpc&utm_campaign=shopping"
echo ""
sleep 2

# Example 5: Purchase page with fbclid
echo "🛒 Example 5: Purchase Page with fbclid"
open "http://localhost:3000/purchase?fbclid=IwAR3_purchase_678&utm_source=facebook&utm_medium=paid_social&utm_campaign=dpa"
echo ""

echo ""
echo "✨ Test complete!"
echo "👉 Click 'Load Session Info' to see captured gclid/fbclid in session data"
echo "👉 Click 'Push Purchase Event' on /purchase to fire an event with click IDs"
echo "👉 Check browser console for dataLayer events containing gclid/fbclid"

#!/bin/bash

# Cross-Domain Tracking Test Script
# This script demonstrates how to test cross-domain tracking with URL parameters

echo "🔗 Testing Cross-Domain Tracking..."
echo ""

# Example 1: Basic user and session tracking
echo "📝 Example 1: Basic User & Session Tracking"
echo "Opening: http://localhost:3000/?user_id=user_abc123&session_id=sess_xy z789"
open "http://localhost:3000/?user_id=user_abc123&session_id=sess_xyz789"
echo ""

# Wait a bit
sleep 2

# Example 2: Full marketing attribution
echo "📊 Example 2: Full Marketing Attribution (Google Email Campaign)"
echo "Opening with UTM parameters..."
open "http://localhost:3000/?user_id=user_abc123&session_id=sess_xyz789&utm_source=google&utm_medium=email&utm_campaign=newsletter_april&utm_term=spring_collection&utm_content=hero_banner&referrer=https://yoursite.com"
echo ""

sleep 2

# Example 3: Facebook Campaign
echo "📱 Example 3: Facebook Ad Campaign"
open "http://localhost:3000/?uid=user_fb456&sid=sess_fb789&utm_source=facebook&utm_medium=cpc&utm_campaign=spring_sale_2026&utm_content=carousel_ad&ref=https://facebook.com"
echo ""

sleep 2

# Example 4: Testing with curl
echo "🌐 Example 4: Testing with cURL (check your terminal output)"
curl -s "http://localhost:3000/?user_id=user_curl123&session_id=sess_curl456&utm_source=google&utm_medium=email&utm_campaign=newsletter_april&referrer=https://yoursite.com" > /dev/null
echo "✅ cURL request sent"
echo ""

echo "✨ Test complete!"
echo "👉 Click 'Load Session Info' on the page to see captured tracking data"
echo "👉 Open browser console to see dataLayer events"
echo "👉 Check GTM Preview mode to verify events"

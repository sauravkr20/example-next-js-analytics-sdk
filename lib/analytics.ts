"use client";

import { useEffect } from "react";
import { initAnalytics } from "analytics-js-sdk";

/**
 * Analytics Provider Component
 * Initializes the analytics SDK with GTM integration
 */
export function AnalyticsProvider() {
  useEffect(() => {
    // Initialize analytics with HTTP, GTM, and CleverTap
    initAnalytics({
      // HTTP Backend Configuration
      apiUrl: process.env.NEXT_PUBLIC_ANALYTICS_API_URL || "https://httpbin.org/post",
      backend: {
        enabled: process.env.NEXT_PUBLIC_BACKEND_ENABLED !== "false", // Set to "false" to disable
      },
      
      // Google Tag Manager Configuration
      gtm: {
        gtmId: process.env.NEXT_PUBLIC_GTM_ID || "GTM-XXXXXXX", // Replace with your GTM ID
        enabled: process.env.NEXT_PUBLIC_GTM_ENABLED !== "false", // Set to "false" to disable
        dataLayerName: "dataLayer", // Optional: custom dataLayer name
      },

      // CleverTap Configuration
      clevertap: {
        accountId: process.env.NEXT_PUBLIC_CLEVERTAP_ACCOUNT_ID || "CLEVERTAP-XXX-XXX", // Replace with your CleverTap Account ID
        enabled: process.env.NEXT_PUBLIC_CLEVERTAP_ENABLED !== "false", // Set to "false" to disable
        region: process.env.NEXT_PUBLIC_CLEVERTAP_REGION, // Optional: e.g., 'in1', 'sg1', 'us1'
      },
      
      // Enable debug mode in development
      debug: process.env.NODE_ENV === "development",
      
      // Retry configuration
      retry: true,
      maxRetries: 3,
      timeout: 5000,
    });

    // Track initial page view
    if (typeof window !== "undefined") {
      import("analytics-js-sdk").then(({ getAnalytics }) => {
        const analytics = getAnalytics();
        analytics.track("page_view", {
          page: window.location.pathname,
          title: document.title,
          referrer: document.referrer || "direct",
        });
      });
    }
  }, []);

  return null;
}
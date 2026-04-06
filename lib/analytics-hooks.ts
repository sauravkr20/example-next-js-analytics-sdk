/**
 * Analytics Hooks for Next.js
 * 
 * Custom React hooks for common analytics tracking patterns
 */

"use client";

import { useEffect, useCallback, useRef } from "react";
import { getAnalytics } from "analytics-js-sdk";

/**
 * Track page views on route changes
 * Use this in your layout or page components
 */
export function usePageTracking() {
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = window.location.pathname;
    
    // Only track if path changed
    if (previousPath.current !== currentPath) {
      const analytics = getAnalytics();
      analytics.track("page_view", {
        page: currentPath,
        title: document.title,
        referrer: previousPath.current || document.referrer || "direct",
      });
      
      previousPath.current = currentPath;
    }
  }, []);
}

/**
 * Track click events with custom properties
 * 
 * @example
 * const trackClick = useClickTracking();
 * <button onClick={() => trackClick('signup_button')}>Sign Up</button>
 */
export function useClickTracking() {
  return useCallback((elementId: string, additionalProps?: Record<string, unknown>) => {
    const analytics = getAnalytics();
    analytics.track("element_clicked", {
      element_id: elementId,
      page: window.location.pathname,
      ...additionalProps,
    });
  }, []);
}

/**
 * Track form submissions
 * 
 * @example
 * const trackFormSubmit = useFormTracking();
 * <form onSubmit={(e) => {
 *   e.preventDefault();
 *   trackFormSubmit('contact_form', { fields_count: 3 });
 * }}>
 */
export function useFormTracking() {
  return useCallback((formId: string, formData?: Record<string, unknown>) => {
    const analytics = getAnalytics();
    analytics.track("form_submitted", {
      form_id: formId,
      page: window.location.pathname,
      ...formData,
    });
  }, []);
}

/**
 * Track scroll depth
 * Triggers events at 25%, 50%, 75%, and 100% scroll depth
 */
export function useScrollTracking() {
  const maxScrollDepth = useRef(0);
  const trackedDepths = useRef(new Set<number>());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      // Update max scroll depth
      if (scrollPercent > maxScrollDepth.current) {
        maxScrollDepth.current = scrollPercent;
      }

      // Track at 25%, 50%, 75%, 100%
      const milestones = [25, 50, 75, 100];
      for (const milestone of milestones) {
        if (scrollPercent >= milestone && !trackedDepths.current.has(milestone)) {
          trackedDepths.current.add(milestone);
          
          const analytics = getAnalytics();
          analytics.track("scroll_depth", {
            depth_percent: milestone,
            page: window.location.pathname,
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}

/**
 * Track time spent on page
 * Tracks when user leaves the page
 */
export function useTimeOnPage() {
  const startTime = useRef<number>(0);

  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  useEffect(() => {
    const trackTimeOnPage = () => {
      if (startTime.current === 0) return;
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000); // in seconds
      
      const analytics = getAnalytics();
      analytics.track("time_on_page", {
        page: window.location.pathname,
        duration_seconds: timeSpent,
      });
    };

    // Track when user leaves page
    window.addEventListener("beforeunload", trackTimeOnPage);
    
    // Also track when component unmounts (for SPA navigation)
    return () => {
      window.removeEventListener("beforeunload", trackTimeOnPage);
      trackTimeOnPage();
    };
  }, []);
}

/**
 * Track video interactions
 * 
 * @example
 * const { onPlay, onPause, onEnded } = useVideoTracking('product_video');
 * <video onPlay={onPlay} onPause={onPause} onEnded={onEnded}>
 */
export function useVideoTracking(videoId: string) {
  const analytics = getAnalytics();

  return {
    onPlay: useCallback(() => {
      analytics.track("video_play", {
        video_id: videoId,
        page: window.location.pathname,
      });
    }, [analytics, videoId]),

    onPause: useCallback((currentTime: number) => {
      analytics.track("video_pause", {
        video_id: videoId,
        current_time: currentTime,
        page: window.location.pathname,
      });
    }, [analytics, videoId]),

    onEnded: useCallback(() => {
      analytics.track("video_complete", {
        video_id: videoId,
        page: window.location.pathname,
      });
    }, [analytics, videoId]),
  };
}

/**
 * Track e-commerce product views
 * 
 * @example
 * const trackProductView = useProductView();
 * useEffect(() => {
 *   trackProductView({
 *     product_id: 'prod_123',
 *     product_name: 'Widget',
 *     price: 99.99
 *   });
 * }, [productId]);
 */
export function useProductView() {
  return useCallback((product: {
    product_id: string;
    product_name: string;
    category?: string;
    price?: number;
    currency?: string;
  }) => {
    const analytics = getAnalytics();
    analytics.track("product_view", {
      ...product,
      page: window.location.pathname,
    });
  }, []);
}

/**
 * Track search queries
 * 
 * @example
 * const trackSearch = useSearchTracking();
 * <input onChange={(e) => trackSearch(e.target.value, resultsCount)} />
 */
export function useSearchTracking() {
  return useCallback((query: string, resultsCount?: number) => {
    const analytics = getAnalytics();
    analytics.track("search", {
      search_query: query,
      results_count: resultsCount,
      page: window.location.pathname,
    });
  }, []);
}

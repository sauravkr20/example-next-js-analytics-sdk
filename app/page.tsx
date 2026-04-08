"use client";

import { getAnalytics } from "analytics-js-sdk";
import type { TransportChannel } from "analytics-js-sdk";
import { useState } from "react";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [sessionInfo, setSessionInfo] = useState<{
    sessionId?: string;
    userId?: string;
    pageViewCount?: number;
    initialReferrer?: string;
    referrerDomain?: string;
    landingPage?: string;
    utmParams?: Record<string, string>;
  } | null>(null);
  
  // Channel selection state
  const [selectedChannels, setSelectedChannels] = useState<TransportChannel[]>(['backend', 'gtm', 'clevertap']);

  const loadSessionInfo = () => {
    const analytics = getAnalytics();
    const sessionData = analytics.getSessionData();
    const userId = analytics.getUserId();
    const sessionId = analytics.getSessionId();
    
    setSessionInfo({
      ...sessionData,
      userId,
      sessionId,
    });
    
    addToLog('Session info loaded');
  };

  const addToLog = (message: string) => {
    setEventLog((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  const toggleChannel = (channel: TransportChannel) => {
    setSelectedChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  const getChannelBadgeClass = (channel: TransportChannel) => {
    const isSelected = selectedChannels.includes(channel);
    const baseClass = "px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer";
    
    if (channel === 'backend') {
      return `${baseClass} ${isSelected ? 'bg-slate-600 text-white' : 'bg-slate-200 text-slate-600'}`;
    } else if (channel === 'gtm') {
      return `${baseClass} ${isSelected ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-600'}`;
    } else {
      return `${baseClass} ${isSelected ? 'bg-teal-600 text-white' : 'bg-teal-200 text-teal-600'}`;
    }
  };

  const formatChannelsForLog = (channels: TransportChannel[]) => {
    if (channels.length === 3) return 'All channels';
    if (channels.length === 0) return 'No channels';
    return channels.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' + ');
  };

  const handleButtonClick = () => {
    const analytics = getAnalytics();
    analytics.track("button_clicked", {
      button_name: "test_button",
      page: "/",
    }, { channels: selectedChannels.length > 0 ? selectedChannels : undefined });
    addToLog(`Tracked: button_clicked → ${formatChannelsForLog(selectedChannels)}`);
  };

  const handleProductView = () => {
    const analytics = getAnalytics();
    analytics.track("product_view", {
      product_id: "prod_abc123",
      product_name: "Premium Widget",
      category: "widgets",
      price: 99.99,
      currency: "USD",
    }, { channels: selectedChannels.length > 0 ? selectedChannels : undefined });
    addToLog(`Tracked: product_view → ${formatChannelsForLog(selectedChannels)}`);
  };

  const handleAddToCart = () => {
    const analytics = getAnalytics();
    analytics.track("add_to_cart", {
      product_id: "prod_abc123",
      quantity: 1,
      price: 99.99,
      currency: "USD",
    }, { channels: selectedChannels.length > 0 ? selectedChannels : undefined });
    addToLog(`Tracked: add_to_cart → ${formatChannelsForLog(selectedChannels)}`);
  };

  const handlePurchase = () => {
    const analytics = getAnalytics();
    analytics.track("purchase", {
      order_id: `order_${Math.random().toString(36).substr(2, 9)}`,
      total: 109.99,
      tax: 10.0,
      shipping: 0,
      currency: "USD",
      items_count: 1,
    }, { channels: selectedChannels.length > 0 ? selectedChannels : undefined });
    addToLog(`Tracked: purchase → ${formatChannelsForLog(selectedChannels)}`);
  };

  const handleIdentifyUser = () => {
    const analytics = getAnalytics();
    const newUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
    analytics.identify(newUserId);
    setUserId(newUserId);
    addToLog(`Identified user: ${newUserId}`);
  };

  const handleClearUser = () => {
    const analytics = getAnalytics();
    analytics.clearUser();
    setUserId(null);
    addToLog("Cleared user identification");
  };

  const handlePageView = () => {
    const analytics = getAnalytics();
    analytics.track("page_view", {
      page: window.location.pathname,
      title: document.title,
      referrer: document.referrer || "direct",
    }, { channels: selectedChannels.length > 0 ? selectedChannels : undefined });
    addToLog(`Tracked: page_view → ${formatChannelsForLog(selectedChannels)}`);
  };

  // Preset channel combinations
  const handleGtmOnly = () => {
    const analytics = getAnalytics();
    analytics.track("analytics_event", {
      category: "engagement",
      action: "scroll",
      value: 50,
    }, { channels: ['gtm'] });
    addToLog("Tracked: analytics_event → GTM only (preset)");
  };

  const handleCleverTapOnly = () => {
    const analytics = getAnalytics();
    analytics.track("user_engagement", {
      feature: "wishlist",
      action: "add",
    }, { channels: ['clevertap'] });
    addToLog("Tracked: user_engagement → CleverTap only (preset)");
  };

  const handleBackendOnly = () => {
    const analytics = getAnalytics();
    analytics.track("server_log", {
      level: "info",
      message: "Important server event",
    }, { channels: ['backend'] });
    addToLog("Tracked: server_log → Backend only (preset)");
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 Analytics SDK + GTM + CleverTap
          </h1>
          <p className="text-gray-600 mb-6">
            Test the analytics SDK with multi-channel support. Select which channels to send events to, then click any tracking button.
          </p>
          
          {userId && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">
                <span className="font-semibold">User Identified:</span> {userId}
              </p>
            </div>
          )}

          {/* Channel Selector */}
          <div className="bg-linear-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              Select Target Channels
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose which channels should receive tracking events. Click the badges to toggle.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => toggleChannel('backend')}
                className={getChannelBadgeClass('backend')}
              >
                <span className="mr-1">{selectedChannels.includes('backend') ? '✓' : '○'}</span>
                Backend
              </button>
              <button
                onClick={() => toggleChannel('gtm')}
                className={getChannelBadgeClass('gtm')}
              >
                <span className="mr-1">{selectedChannels.includes('gtm') ? '✓' : '○'}</span>
                GTM
              </button>
              <button
                onClick={() => toggleChannel('clevertap')}
                className={getChannelBadgeClass('clevertap')}
              >
                <span className="mr-1">{selectedChannels.includes('clevertap') ? '✓' : '○'}</span>
                CleverTap
              </button>
              <button
                onClick={() => setSelectedChannels(['backend', 'gtm', 'clevertap'])}
                className="px-3 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedChannels([])}
                className="px-3 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* User Identification */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">👤 User Identification</h2>
            <div className="space-y-3">
              <button
                onClick={handleIdentifyUser}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Identify User
              </button>
              <button
                onClick={handleClearUser}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Clear User
              </button>
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔍 Session & Cross-Domain Tracking</h2>
            <p className="text-gray-600 mb-4 text-xs">
              View session data including UTM parameters, referrer info, and cross-domain tracking details.
            </p>
            <button
              onClick={loadSessionInfo}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-4"
            >
              Load Session Info
            </button>
            
            {sessionInfo && (
              <div className="bg-gray-50 rounded-lg p-4 text-xs font-mono space-y-2">
                <div><span className="font-semibold">Session ID:</span> {sessionInfo.sessionId}</div>
                {sessionInfo.userId && (
                  <div><span className="font-semibold">User ID:</span> {sessionInfo.userId}</div>
                )}
                <div><span className="font-semibold">Page Views:</span> {sessionInfo.pageViewCount}</div>
                {sessionInfo.initialReferrer && (
                  <div><span className="font-semibold">Referrer:</span> {sessionInfo.initialReferrer}</div>
                )}
                {sessionInfo.referrerDomain && (
                  <div><span className="font-semibold">Referrer Domain:</span> {sessionInfo.referrerDomain}</div>
                )}
                {sessionInfo.landingPage && (
                  <div><span className="font-semibold">Landing Page:</span> {sessionInfo.landingPage}</div>
                )}
                {sessionInfo.utmParams && Object.keys(sessionInfo.utmParams).length > 0 && (
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="font-semibold mb-1">UTM Parameters:</div>
                    {Object.entries(sessionInfo.utmParams).map(([key, value]) => (
                      <div key={key} className="ml-2">• {key}: {value as string}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Basic Tracking */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">📤 Basic Tracking</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Track events using the selected channels above.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleButtonClick}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Track Button Click
              </button>
              <button
                onClick={handlePageView}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Track Page View
              </button>
            </div>
          </div>

          {/* E-commerce Events */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🛒 E-commerce Events</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Track product interactions using the selected channels.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              <button
                onClick={handleProductView}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                View Product
              </button>
              <button
                onClick={handleAddToCart}
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={handlePurchase}
                className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Complete Purchase
              </button>
            </div>
          </div>

          {/* Channel-Specific Examples */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎯 Preset Channel Examples</h2>
            <p className="text-gray-600 mb-4 text-sm">
              These buttons use hardcoded channel presets (ignore your selection above).
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              <button
                onClick={handleGtmOnly}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <div className="text-sm font-normal opacity-80">GTM Only</div>
                Analytics Event
              </button>
              <button
                onClick={handleCleverTapOnly}
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <div className="text-sm font-normal opacity-80">CleverTap Only</div>
                Engagement Event
              </button>
              <button
                onClick={handleBackendOnly}
                className="bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <div className="text-sm font-normal opacity-80">Backend Only</div>
                Server Log
              </button>
            </div>
          </div>

          {/* Event Log */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">📝 Event Log</h2>
            <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
              {eventLog.length === 0 ? (
                <p className="text-gray-400 italic">No events tracked yet. Click buttons above to track events.</p>
              ) : (
                eventLog.map((log, index) => (
                  <div key={index} className="py-1 border-b border-gray-200 last:border-0">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔧 GTM Setup Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Set your GTM Container ID in <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code>:
              <pre className="bg-gray-900 text-green-400 p-3 rounded-lg mt-2 overflow-x-auto">
                NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
              </pre>
            </li>
            <li>In GTM, create custom event triggers (e.g., &quot;purchase&quot;, &quot;add_to_cart&quot;)</li>
            <li>Create Data Layer Variables to access event properties</li>
            <li>Set up tags to fire on your custom event triggers</li>
            <li>Test using GTM Preview mode</li>
          </ol>
        </div>

        {/* Cross-Domain Tracking Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔗 Cross-Domain Tracking</h2>
          <p className="text-gray-600 mb-4">
            When redirecting from your main site, automatically preserve user and session data using URL parameters:
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">Try it now:</h3>
            <p className="text-sm text-blue-800 mb-2">Add these parameters to the URL:</p>
            <code className="bg-blue-900 text-blue-100 px-3 py-2 rounded block text-xs">
              ?uid=user123&sid=session456&utm_source=google&utm_medium=cpc&utm_campaign=spring_sale
            </code>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <span className="font-semibold">Supported Parameters:</span>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li><code className="bg-gray-100 px-2 py-0.5 rounded">uid</code> or <code className="bg-gray-100 px-2 py-0.5 rounded">user_id</code> - User identifier</li>
                <li><code className="bg-gray-100 px-2 py-0.5 rounded">sid</code> or <code className="bg-gray-100 px-2 py-0.5 rounded">session_id</code> - Session identifier</li>
                <li><code className="bg-gray-100 px-2 py-0.5 rounded">utm_*</code> - Marketing attribution (source, medium, campaign, etc.)</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-semibold">Automatic Session Tracking:</span>
              <p className="mt-1">The SDK automatically captures:</p>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li>UTM parameters from URL</li>
                <li>Initial referrer and referrer domain</li>
                <li>Landing page URL</li>
                <li>Page view count per session</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
              <span className="font-semibold text-green-900">GTM Integration:</span>
              <p className="mt-1 text-green-800">All session data is automatically pushed to GTM&apos;s dataLayer, including e-commerce structured data for Facebook Pixel, Google Analytics 4, and Pinterest tags.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
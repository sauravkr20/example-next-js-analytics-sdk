"use client";

import { getAnalytics } from "analytics-js-sdk";

export default function Home() {
  const handleClick = () => {
    const analytics = getAnalytics();

    analytics.track("button_clicked", {
      button_name: "test_button"
    });
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Analytics Test 🚀</h1>

      <button onClick={handleClick}>
        Click Me
      </button>
    </div>
  );
}
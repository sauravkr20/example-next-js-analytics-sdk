"use client";

import { useState } from "react";
import { getAnalytics } from "analytics-js-sdk";

export default function PurchasePage() {
  const [sent, setSent] = useState(false);

  const handlePushPurchase = () => {
    const payload = {
      ecommerce: {
        transaction_id: "T12345",
        value: 1299.0,
        revenue: 1299.0,
        currency: "INR",
        tax: 100,
        shipping: 50,
        purchase: {
          actionField:{
            revenue: 1299.0,
          }
        },
        coupon: "SUMMER10",
        items: [
          {
            item_id: "SKU_123",
            item_name: "Gold Ring",
            price: 1149.0,
            quantity: 1,
            item_brand: "GIVA",
            item_category: "Jewelry",
          },
        ],
      },
    };

    try {
      const analytics = getAnalytics();
      if (analytics && typeof analytics.track === "function") {
        analytics.track("dl_purchase", payload, { channels: ["gtm"] });
      }
    } catch (err) {
      console.error("Failed to push purchase event:", err);
    }

    setSent(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium">Purchase page (example)</h2>

      <div className="mt-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handlePushPurchase}
        >
          Push Purchase Event
        </button>

        {sent && (
          <div className="mt-2 text-sm text-green-700">Event pushed to dataLayer ✔</div>
        )}

        <div className="mt-6 text-xs text-gray-500 font-mono bg-gray-50 p-3 rounded">
          The pushed object:
          <pre className="whitespace-pre-wrap">{JSON.stringify(
            {
              event: "dl_purchase",
              ecommerce: {
                transaction_id: "T12345",
                value: 1299.0,
                currency: "INR",
                tax: 100,
                shipping: 50,
                coupon: "SUMMER10",
                items: [
                  {
                    item_id: "SKU_123",
                    item_name: "Gold Ring",
                    price: 1149.0,
                    quantity: 1,
                    item_brand: "GIVA",
                    item_category: "Jewelry",
                  },
                ],
              },
              user_id: "user_abc123",
              session_id: "sess_xyz789",
            },
            null,
            2
          )}</pre>
        </div>
      </div>
    </div>
  );
}
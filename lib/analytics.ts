"use client"; 

import { useEffect } from "react";
import { initAnalytics } from "analytics-js-sdk";

export function AnalyticsProvider(){ 
    useEffect(()=> {
        initAnalytics({ apiUrl: "http://localhost:8080/track" });
    }, [])

    return null; 
}
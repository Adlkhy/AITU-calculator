import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UserProvider } from './contexts/UserContext.tsx'
import { GeminiProvider } from './contexts/GeminiContext.tsx'
import { SpeedInsights } from "@vercel/speed-insights/react";
import { HelmetProvider } from 'react-helmet-async';

const GA_ID = import.meta.env.VITE_GA_ID; 

// Only inject the Google Tag if the ID exists (i.e., when deployed)
if (GA_ID) {
  // 1. Inject the main gtag script source
  const scriptSrc = document.createElement('script');
  scriptSrc.async = true;
  scriptSrc.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(scriptSrc);

  // 2. Inject the gtag initialization script
  const scriptInit = document.createElement('script');
  scriptInit.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
  `;
  document.head.appendChild(scriptInit);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <GeminiProvider>
        <UserProvider>
          <SpeedInsights />
          <App />
        </UserProvider>
      </GeminiProvider>
    </HelmetProvider>
  </React.StrictMode>
)

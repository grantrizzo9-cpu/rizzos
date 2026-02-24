'use client';

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { type ReactNode } from "react";

// The app will first look for NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID, and fall back to NEXT_PUBLIC_PAYPAL_CLIENT_ID for production.
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export function PayPalProvider({ children }: { children: ReactNode }) {
  // A more robust check to ensure the Client ID is not a placeholder.
  // If no ID is provided, use PayPal's 'sb' default for sandbox which shows buttons but with a warning.
  // This prevents the app from crashing if the .env variable is missing.
  const clientId = (PAYPAL_CLIENT_ID && !PAYPAL_CLIENT_ID.includes('YOUR_PAYPAL_')) ? PAYPAL_CLIENT_ID : 'sb';
  
  if (clientId === 'sb' && process.env.NODE_ENV !== 'production') {
      console.warn(`
        *****************************************************************
        * PAYPAL PAYMENTS ARE NOT CONFIGURED.                           *
        *                                                               *
        * To enable real PayPal payments, set NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID *
        * in your .env file and restart your Next.js development server.                  *
        * Using a fallback 'sb' client ID for now.                      *
        *****************************************************************
      `);
  }

  return (
    <PayPalScriptProvider options={{ clientId: clientId, currency: 'AUD', intent: 'capture' }}>
      {children}
    </PayPalScriptProvider>
  );
}

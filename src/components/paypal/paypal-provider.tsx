'use client';

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { createContext, useContext, type ReactNode } from "react";

// The app will first look for NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID, and fall back to NEXT_PUBLIC_PAYPAL_CLIENT_ID for production.
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

type PayPalContextType = {
  isPayPalConfigured: boolean;
}

const PayPalContext = createContext<PayPalContextType | undefined>(undefined);

export function PayPalProvider({ children }: { children: ReactNode }) {
  // A more robust check to ensure the Client ID is not a placeholder.
  const isConfigured = !!(PAYPAL_CLIENT_ID && !PAYPAL_CLIENT_ID.includes('YOUR_PAYPAL_'));

  if (!isConfigured) {
    if (process.env.NODE_ENV !== 'production') {
        console.warn(`
          *****************************************************************
          * PAYPAL PAYMENTS ARE NOT CONFIGURED.                           *
          *                                                               *
          * To enable PayPal payments, set NEXT_PUBLIC_PAYPAL_CLIENT_ID   *
          * or NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID in your .env file     *
          * and restart your Next.js development server.                  *
          *****************************************************************
        `);
    }
    
    return (
      <PayPalContext.Provider value={{ isPayPalConfigured: false }}>
        {children}
      </PayPalContext.Provider>
    );
  }

  return (
    <PayPalContext.Provider value={{ isPayPalConfigured: true }}>
      <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'AUD', intent: 'capture' }}>
        {children}
      </PayPalScriptProvider>
    </PayPalContext.Provider>
  );
}

export function usePayPal() {
  const context = useContext(PayPalContext);
  if (context === undefined) {
    throw new Error("usePayPal must be used within a PayPalProvider");
  }
  return context;
}

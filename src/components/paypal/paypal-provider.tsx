'use client';

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { type ReactNode } from "react";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export function PayPalProvider({ children }: { children: ReactNode }) {
  if (!PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID === 'YOUR_PAYPAL_CLIENT_ID_HERE') {
    if (process.env.NODE_ENV !== 'production') {
        console.warn(`
          *****************************************************************
          * PAYPAL PAYMENTS ARE NOT CONFIGURED.                           *
          *                                                               *
          * To enable PayPal payments, you must set an environment        *
          * variable named NEXT_PUBLIC_PAYPAL_CLIENT_ID in your .env file *
          * and restart your Next.js development server.                  *
          *****************************************************************
        `);
    }
    // Return children without provider if ID is missing, so app doesn't crash
    return <>{children}</>;
  }

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'AUD', intent: 'capture' }}>
      {children}
    </PayPalScriptProvider>
  );
}

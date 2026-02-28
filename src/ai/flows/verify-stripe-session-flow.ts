'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  // In a real app, you'd want to handle this more gracefully,
  // perhaps by disabling payment features and logging a critical error.
  console.error('STRIPE_SECRET_KEY environment variable not set.');
}

// Initialize Stripe only if the key exists.
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const VerifyStripeSessionInputSchema = z.object({
  sessionId: z.string().describe('The ID of the Stripe Checkout Session to verify.'),
});
export type VerifyStripeSessionInput = z.infer<typeof VerifyStripeSessionInputSchema>;

const VerifyStripeSessionOutputSchema = z.object({
  status: z.string().describe('The payment status of the session (e.g., "paid", "unpaid").'),
  planName: z.string().nullable().describe('The name of the plan purchased in the session.'),
  userId: z.string().nullable().describe('The user ID passed as the client_reference_id.'),
});
export type VerifyStripeSessionOutput = z.infer<typeof VerifyStripeSessionOutputSchema>;

export async function verifyStripeSession(input: VerifyStripeSessionInput): Promise<VerifyStripeSessionOutput> {
  return verifyStripeSessionFlow(input);
}

const verifyStripeSessionFlow = ai.defineFlow(
  {
    name: 'verifyStripeSessionFlow',
    inputSchema: VerifyStripeSessionInputSchema,
    outputSchema: VerifyStripeSessionOutputSchema,
  },
  async ({ sessionId }) => {
    if (!stripe) {
      throw new Error('Stripe is not configured on the server.');
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // This is the robust fix: Get the planName directly from the metadata
    // that we passed into the URL from the checkout button. This is much
    // more reliable than trying to parse the line_items.
    const planName = session.metadata?.planName || null;

    return {
        status: session.payment_status,
        planName: planName,
        userId: session.client_reference_id,
    };
  }
);

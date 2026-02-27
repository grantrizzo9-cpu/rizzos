'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable not set.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const CreateCheckoutSessionInputSchema = z.object({
  priceId: z.string().describe('The ID of the Stripe Price object for the one-time activation fee.'),
  userId: z.string().describe("The user's unique ID from your database."),
  userEmail: z.string().email().describe("The user's email address for the Stripe customer object."),
  planName: z.string().describe('The name of the plan being purchased, to be stored in metadata.'),
});
export type CreateCheckoutSessionInput = z.infer<typeof CreateCheckoutSessionInputSchema>;

const CreateCheckoutSessionOutputSchema = z.object({
  sessionId: z.string(),
});
export type CreateCheckoutSessionOutput = z.infer<typeof CreateCheckoutSessionOutputSchema>;

export async function createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CreateCheckoutSessionOutput> {
  return createCheckoutSessionFlow(input);
}

const createCheckoutSessionFlow = ai.defineFlow(
  {
    name: 'createCheckoutSessionFlow',
    inputSchema: CreateCheckoutSessionInputSchema,
    outputSchema: CreateCheckoutSessionOutputSchema,
  },
  async ({ priceId, userId, userEmail, planName }) => {
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

    const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: 'payment', // Use 'payment' mode for one-time activation fees.
        success_url: `${appUrl}/dashboard/upgrade?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/dashboard/upgrade`,
        client_reference_id: userId,
        customer_email: userEmail,
        metadata: {
            userId: userId,
            planName: planName,
        },
    });

    if (!checkoutSession.id) {
        throw new Error('Failed to create Stripe Checkout session.');
    }

    return { sessionId: checkoutSession.id };
  }
);

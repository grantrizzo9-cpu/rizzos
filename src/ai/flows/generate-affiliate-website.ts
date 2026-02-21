'use server';
/**
 * @fileOverview A Genkit flow for generating a complete, single-page affiliate website.
 *
 * - generateAffiliateWebsite - A function that generates the TSX code for a landing page.
 * - GenerateAffiliateWebsiteInput - The input type for the generateAffiliateWebsite function.
 * - GenerateAffiliateWebsiteOutput - The return type for the generateAffiliateWebsite function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAffiliateWebsiteInputSchema = z.object({
  niche: z.string().describe('The chosen niche for the affiliate website.'),
  targetAudience: z.string().describe('The target demographic for the website.'),
  affiliateUsername: z.string().describe("The user's affiliate username."),
});
export type GenerateAffiliateWebsiteInput = z.infer<
  typeof GenerateAffiliateWebsiteInputSchema
>;

const GenerateAffiliateWebsiteOutputSchema = z.object({
  pageComponent: z
    .string()
    .describe(
      'The complete, self-contained TSX code for the Next.js landing page component.'
    ),
});
export type GenerateAffiliateWebsiteOutput = z.infer<
  typeof GenerateAffiliateWebsiteOutputSchema
>;

export async function generateAffiliateWebsite(
  input: GenerateAffiliateWebsiteInput
): Promise<GenerateAffiliateWebsiteOutput> {
  return generateAffiliateWebsiteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAffiliateWebsitePrompt',
  input: {schema: GenerateAffiliateWebsiteInputSchema},
  output: {schema: GenerateAffiliateWebsiteOutputSchema},
  prompt: `You are an expert Next.js developer and professional copywriter. Your task is to generate the complete code for a single-file, self-contained Next.js landing page component for an affiliate website.

**Component Requirements:**
- Use Next.js App Router conventions.
- The component must be a client component ('use client').
- Use TailwindCSS for all styling.
- Use shadcn/ui components like Card, Button, etc., and lucide-react for icons.
- The generated code must be a single block of valid TSX. Do not include any explanations outside of the code comments.
- The page should be visually appealing, modern, and professional.

**Content Requirements:**
- The content must be persuasive and tailored to the provided Niche and Target Audience.
- The website's goal is to convert visitors into customers for 'Host Pro Ai'.
- All Call-to-Action (CTA) buttons and links must point to 'https://affiliateaihost.com/ref/{{{affiliateUsername}}}'.

**Structure:**
1.  **Header:** A simple header with the niche name as a logo/title and a CTA button.
2.  **Hero Section:** A compelling headline, a subheadline, and a primary CTA button. Use a placeholder image from 'picsum.photos'.
3.  **Features Section:** Highlight 3-4 key benefits of 'Host Pro Ai' (e.g., AI tools, fast hosting, daily payouts) tailored to the specified niche. Use icons from 'lucide-react'.
4.  **Testimonials Section:** Include 2-3 fictional but realistic testimonials from people in the target audience.
5.  **Final CTA Section:** A final, strong call to action to sign up.
6.  **Footer:** A simple footer with copyright information.

**Code Style & Customization:**
- Add comments to the code to indicate where the user can easily change text, images, and colors.
- For images, use the 'next/image' component with placeholders from 'https://picsum.photos/seed/your-seed/1200/800'. Add a 'data-ai-hint' attribute.
- Ensure all JSX is properly structured and there is a single root element.

**Input Data:**
- Niche: {{{niche}}}
- Target Audience: {{{targetAudience}}}
- Affiliate Username: {{{affiliateUsername}}}

Begin generating the code now.`,
});

const generateAffiliateWebsiteFlow = ai.defineFlow(
  {
    name: 'generateAffiliateWebsiteFlow',
    inputSchema: GenerateAffiliateWebsiteInputSchema,
    outputSchema: GenerateAffiliateWebsiteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate affiliate website code.');
    }
    return output;
  }
);

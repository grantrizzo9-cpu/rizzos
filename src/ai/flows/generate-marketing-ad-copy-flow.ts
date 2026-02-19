'use server';
/**
 * @fileOverview A Genkit flow for generating versatile marketing ad copy for various platforms.
 *
 * - generateMarketingAdCopy - A function that handles the generation of marketing ad copy.
 * - GenerateMarketingAdCopyInput - The input type for the generateMarketingAdCopy function.
 * - GenerateMarketingAdCopyOutput - The return type for the generateMarketingAdCopy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingAdCopyInputSchema = z.object({
  productDescription:
    z.string().describe('A detailed description of the product or service.'),
  targetAudience:
    z.string().describe('A description of the intended audience for the ad.'),
  keyFeaturesBenefits: z
    .array(z.string())
    .describe('A list of key features and benefits of the product or service.'),
  callToAction: z
    .string()
    .describe('The desired action for the user to take (e.g., "Shop Now", "Download App").'),
  platform: z
    .enum(['Social Media', 'Google Ads', 'Email', 'Landing Page', 'Print Ad'])
    .describe('The advertising platform for which to generate copy.'),
  adLength: z
    .enum(['Short', 'Medium', 'Long'])
    .describe('The desired length of the ad copy.'),
});
export type GenerateMarketingAdCopyInput = z.infer<
  typeof GenerateMarketingAdCopyInputSchema
>;

const GenerateMarketingAdCopyOutputSchema = z.object({
  headline:
    z.string().describe('A catchy and compelling headline for the ad copy.'),
  bodyCopy: z
    .string()
    .describe(
      'The main body content of the marketing ad, highlighting features and benefits.'
    ),
  callToActionPhrase: z
    .string()
    .describe(
      'The specific phrase for the call-to-action button or link (e.g., "Learn More", "Buy Now").'
    ),
  keywords: z
    .array(z.string())
    .describe('A list of relevant keywords for search engine advertising or content.'),
  hashtags: z
    .array(z.string())
    .describe('A list of relevant hashtags for social media platforms.'),
  emojis: z
    .array(z.string())
    .describe('A list of emojis to enhance engagement, especially for social media or email.'),
});
export type GenerateMarketingAdCopyOutput = z.infer<
  typeof GenerateMarketingAdCopyOutputSchema
>;

export async function generateMarketingAdCopy(
  input: GenerateMarketingAdCopyInput
): Promise<GenerateMarketingAdCopyOutput> {
  return generateMarketingAdCopyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMarketingAdCopyPrompt',
  input: {schema: GenerateMarketingAdCopyInputSchema},
  output: {schema: GenerateMarketingAdCopyOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in creating compelling ad copy for various digital and traditional platforms.

Your task is to generate marketing ad copy based on the provided details. Tailor the copy to the specified platform and desired length, ensuring it is engaging, persuasive, and drives the desired call to action.

Product/Service Description: {{{productDescription}}}
Target Audience: {{{targetAudience}}}
Key Features/Benefits: {{{#each keyFeaturesBenefits}}}- {{{this}}}
{{{/each}}}
Desired Call to Action: {{{callToAction}}}
Platform: {{{platform}}}
Desired Ad Length: {{{adLength}}}

Craft a headline and body copy that resonates with the target audience. Include relevant keywords for SEO/SEM purposes (if applicable), appropriate hashtags for social media platforms, and engaging emojis where suitable.
`,
});

const generateMarketingAdCopyFlow = ai.defineFlow(
  {
    name: 'generateMarketingAdCopyFlow',
    inputSchema: GenerateMarketingAdCopyInputSchema,
    outputSchema: GenerateMarketingAdCopyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate marketing ad copy.');
    }
    return output;
  }
);

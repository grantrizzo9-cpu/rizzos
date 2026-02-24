'use server';
/**
 * @fileOverview A Genkit flow for generating social media ad scripts.
 *
 * - generateSocialMediaAdScript - A function that handles the generation of social media ad scripts.
 * - GenerateSocialMediaAdScriptInput - The input type for the generateSocialMediaAdScript function.
 * - GenerateSocialMediaAdScriptOutput - The return type for the generateSocialMediaAdScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaAdScriptInputSchema = z.object({
  productName: z.string().describe('The name of the product or service being advertised.'),
  targetAudience: z.string().describe('A description of the target audience for the ad.'),
  keyBenefits: z
    .array(z.string())
    .describe('A list of key benefits or features of the product/service.'),
  callToAction: z
    .string()
    .describe('The desired action for the user to take (e.g., "Sign Up Now", "Learn More").'),
  platform: z
    .enum(['Facebook', 'Instagram', 'X', 'TikTok', 'LinkedIn', 'YouTube'])
    .describe('The social media platform where the ad will be posted.'),
});
export type GenerateSocialMediaAdScriptInput = z.infer<
  typeof GenerateSocialMediaAdScriptInputSchema
>;

const GenerateSocialMediaAdScriptOutputSchema = z.object({
  headline: z.string().describe('A catchy and attention-grabbing headline for the ad.'),
  bodyText: z.string().describe('The main body copy of the ad, highlighting benefits and features.'),
  callToActionPhrase: z
    .string()
    .describe('The specific phrase for the call-to-action button or link.'),
  hashtags: z.array(z.string()).describe('A list of relevant hashtags for the ad.'),
  emojis: z.array(z.string()).describe('A list of emojis to make the ad more engaging.'),
});
export type GenerateSocialMediaAdScriptOutput = z.infer<
  typeof GenerateSocialMediaAdScriptOutputSchema
>;

export async function generateSocialMediaAdScript(
  input: GenerateSocialMediaAdScriptInput
): Promise<GenerateSocialMediaAdScriptOutput> {
  return generateSocialMediaAdScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialMediaAdScriptPrompt',
  input: {schema: GenerateSocialMediaAdScriptInputSchema},
  output: {schema: GenerateSocialMediaAdScriptOutputSchema},
  prompt: `You are an expert social media advertising copywriter.

Your task is to generate a compelling social media ad script for the following product/service.
Ensure the ad is optimized for the specified platform, uses engaging language, and includes a clear call to action.

Product Name: {{{productName}}}
Target Audience: {{{targetAudience}}}
Key Benefits: {{{#each keyBenefits}}}- {{{this}}}\n{{{/each}}}
Call to Action: {{{callToAction}}}
Platform: {{{platform}}}

Craft a concise and persuasive ad that captures attention, highlights the value, and drives conversions.
Include relevant hashtags and emojis to maximize engagement on the chosen platform.`,
});

const generateSocialMediaAdScriptFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaAdScriptFlow',
    inputSchema: GenerateSocialMediaAdScriptInputSchema,
    outputSchema: GenerateSocialMediaAdScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate ad script. The model returned empty content.');
    }
    return output;
  }
);

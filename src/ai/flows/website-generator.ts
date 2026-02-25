'use server';
/**
 * @fileOverview A Genkit flow for generating the complete JSON content for a themed, single-page affiliate website.
 *
 * - generateWebsiteJson - A function that generates the JSON content structure for a landing page.
 * - GenerateWebsiteJsonInput - The input type for the generateWebsiteJson function.
 * - GenerateWebsiteJsonOutput - The return type for the generateWebsiteJson function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateWebsiteJsonInputSchema = z.object({
  username: z.string().describe("The affiliate's username."),
  niche: z.string().describe('The niche topic for the affiliate website.'),
});
export type GenerateWebsiteJsonInput = z.infer<
  typeof GenerateWebsiteJsonInputSchema
>;

const GenerateWebsiteJsonOutputSchema = z.object({
  homepage: z.object({
    title: z.string().describe('SEO-friendly site title for the niche.'),
    navLinks: z
      .array(z.object({ text: z.string(), href: z.string() }))
      .length(3)
      .describe('An array of 3 navigation links.'),
    headline: z.string().describe('A high-conversion, catchy headline.'),
    subheadline: z
      .string()
      .describe('A persuasive subheadline expanding on the main message, at least 40 words long.'),
    ctaButtonText: z.string().describe('A strong call-to-action text for the main button.'),
    features: z
      .array(
        z.object({
          title: z.string(),
          description: z.string().describe('A detailed description of the feature, at least 30 words long.'),
          iconEmoji: z.string().describe('A single emoji representing the feature.'),
        })
      )
      .length(3)
      .describe('An array of 3 key features with detailed descriptions.'),
    howItWorksSteps: z
      .array(z.object({ 
          title: z.string(), 
          description: z.string().describe('A detailed description of the step, at least 30 words long.') 
        }))
      .length(3)
      .describe('An array of 3 simple steps explaining the process, with detailed descriptions.'),
    testimonials: z
      .array(
        z.object({
          text: z.string().describe('A realistic, fictional testimonial of at least 2-3 sentences.'),
          name: z.string(),
          role: z.string(),
        })
      )
      .length(3)
      .describe('An array of 3 realistic, fictional testimonials.'),
    faqs: z
      .array(z.object({ 
          question: z.string(), 
          answer: z.string().describe('A comprehensive answer to the question, at least 50 words long.') 
        }))
      .min(3)
      .max(5)
      .describe('An array of 3 to 5 frequently asked questions with comprehensive answers.'),
    finalCta: z.object({
      headline: z.string(),
      subheadline: z.string(),
      buttonText: z.string(),
    }),
  }),
  legal: z.object({
    terms: z.string().describe('Full boilerplate text for Terms & Conditions, at least 400 words long.'),
    privacy: z.string().describe('Full boilerplate text for a Privacy Policy, at least 400 words long.'),
    disclaimer: z.string().describe('Full boilerplate text for an Earnings Disclaimer, at least 200 words long.'),
  }),
});

export type GenerateWebsiteJsonOutput = z.infer<
  typeof GenerateWebsiteJsonOutputSchema
>;

export async function generateWebsiteJson(
  input: GenerateWebsiteJsonInput
): Promise<GenerateWebsiteJsonOutput> {
  return websiteGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'websiteGeneratorPrompt',
  input: { schema: GenerateWebsiteJsonInputSchema },
  output: { schema: GenerateWebsiteJsonOutputSchema },
  prompt: `You are an expert copywriter and marketing strategist tasked with generating all the content for a high-converting affiliate marketing landing page for the "Host Pro Ai" platform. The website's goal is to get visitors to sign up using the affiliate's link.

The affiliate's niche is: {{{niche}}}.

Generate a complete JSON object that contains all the text and content needed for the website. The tone should be professional, persuasive, and exciting. All content should be tailored to the specified niche and be comprehensive and detailed as specified in the output schema.

- For the features, focus on the benefits of "Host Pro Ai" for someone in that niche.
- For testimonials, invent names and roles that fit the niche.
- For FAQs, anticipate questions someone from that niche might have and provide detailed answers.
- For legal text, generate standard, comprehensive boilerplate content of a suitable length for real websites.
- All CTA buttons will eventually link to "https://hostproai.com/?ref={{{username}}}". The button text should be action-oriented.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});

const websiteGeneratorFlow = ai.defineFlow(
  {
    name: 'websiteGeneratorFlow',
    inputSchema: GenerateWebsiteJsonInputSchema,
    outputSchema: GenerateWebsiteJsonOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate website content.');
    }
    return output;
  }
);

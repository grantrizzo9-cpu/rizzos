'use server';
/**
 * @fileOverview A Genkit flow for generating content ideas and a structural outline for a niche website.
 *
 * - generateNicheSiteContentIdeas - A function that generates content ideas and a structural outline.
 * - GenerateNicheSiteContentIdeasInput - The input type for the generateNicheSiteContentIdeas function.
 * - GenerateNicheSiteContentIdeasOutput - The return type for the generateNicheSiteContentIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNicheSiteContentIdeasInputSchema = z.object({
  niche: z.string().describe('The chosen niche for the website.'),
  targetDemographic: z
    .string()
    .describe('The target demographic for the niche website.'),
});
export type GenerateNicheSiteContentIdeasInput = z.infer<
  typeof GenerateNicheSiteContentIdeasInputSchema
>;

const GenerateNicheSiteContentIdeasOutputSchema = z.object({
  contentIdeas: z
    .array(z.string())
    .describe('A list of key content ideas for the niche website.'),
  siteOutline: z
    .string()
    .describe(
      'A detailed structural outline for the niche website, including main pages and potential sub-sections.'
    ),
});
export type GenerateNicheSiteContentIdeasOutput = z.infer<
  typeof GenerateNicheSiteContentIdeasOutputSchema
>;

export async function generateNicheSiteContentIdeas(
  input: GenerateNicheSiteContentIdeasInput
): Promise<GenerateNicheSiteContentIdeasOutput> {
  return generateNicheSiteContentIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNicheSiteContentIdeasPrompt',
  input: {schema: GenerateNicheSiteContentIdeasInputSchema},
  output: {schema: GenerateNicheSiteContentIdeasOutputSchema},
  prompt: `You are an expert niche website content strategist. Your task is to generate key content ideas and a structural outline for a new niche website.

Niche: {{{niche}}}
Target Demographic: {{{targetDemographic}}}

Generate at least 5 key content ideas that would resonate with the target demographic within this niche. These should be topics for articles, guides, or features.

Then, create a structural outline for the website. This outline should include main navigation pages (e.g., Home, About, Contact, Blog, Resources) and suggest relevant sub-sections or categories based on the content ideas and niche. The outline should be easy to understand and provide a clear roadmap for site development.`,
});

const generateNicheSiteContentIdeasFlow = ai.defineFlow(
  {
    name: 'generateNicheSiteContentIdeasFlow',
    inputSchema: GenerateNicheSiteContentIdeasInputSchema,
    outputSchema: GenerateNicheSiteContentIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate niche site content ideas and outline.');
    }
    return output;
  }
);

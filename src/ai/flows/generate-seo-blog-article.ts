'use server';
/**
 * @fileOverview A Genkit flow for generating SEO-optimized blog articles.
 *
 * - generateSeoBlogArticle - A function that generates an SEO-optimized blog article.
 * - GenerateSeoBlogArticleInput - The input type for the generateSeoBlogArticle function.
 * - GenerateSeoBlogArticleOutput - The return type for the generateSeoBlogArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSeoBlogArticleInputSchema = z.object({
  topic: z
    .string()
    .describe('The topic for which to generate an SEO-optimized blog article.'),
});
export type GenerateSeoBlogArticleInput = z.infer<
  typeof GenerateSeoBlogArticleInputSchema
>;

const GenerateSeoBlogArticleOutputSchema = z.object({
  articleContent: z.string().describe('The generated SEO-optimized blog article, at least 500 words long.'),
});
export type GenerateSeoBlogArticleOutput = z.infer<
  typeof GenerateSeoBlogArticleOutputSchema
>;

export async function generateSeoBlogArticle(
  input: GenerateSeoBlogArticleInput
): Promise<GenerateSeoBlogArticleOutput> {
  return generateSeoBlogArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSeoBlogArticlePrompt',
  input: {schema: GenerateSeoBlogArticleInputSchema},
  output: {schema: GenerateSeoBlogArticleOutputSchema},
  prompt: `You are an expert SEO content writer specializing in generating engaging and informative blog articles for affiliate marketers. Your goal is to write a comprehensive, SEO-optimized blog article of at least 500 words on the given topic.

The article should be designed to attract and educate an audience interested in affiliate marketing, web hosting, or AI tools. Naturally incorporate relevant keywords throughout the text. Structure the article with a compelling title, an engaging introduction, several descriptive subheadings, the main body content, and a strong conclusion that encourages further engagement.

Focus on providing valuable insights, demonstrating authority in the niche, and maintaining a professional yet accessible tone.

Topic: {{{topic}}} `,
});

const generateSeoBlogArticleFlow = ai.defineFlow(
  {
    name: 'generateSeoBlogArticleFlow',
    inputSchema: GenerateSeoBlogArticleInputSchema,
    outputSchema: GenerateSeoBlogArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate SEO blog article content.');
    }
    return output;
  }
);

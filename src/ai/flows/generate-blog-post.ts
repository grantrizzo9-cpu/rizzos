'use server';
/**
 * @fileOverview A Genkit flow for generating unique, SEO-optimized blog posts based on a topic and target keywords.
 *
 * - generateBlogPost - A function that generates an SEO-optimized blog post.
 * - GenerateBlogPostInput - The input type for the generateBlogPost function.
 * - GenerateBlogPostOutput - The return type for the generateBlogPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe('The topic for the blog post.'),
  targetKeywords: z
    .array(z.string())
    .describe('A list of target keywords to incorporate into the blog post for SEO.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

const GenerateBlogPostOutputSchema = z.object({
  articleContent: z
    .string()
    .describe(
      'The generated SEO-optimized blog article, at least 500 words long, naturally incorporating the target keywords.'
    ),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;

export async function generateBlogPost(
  input: GenerateBlogPostInput
): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: {schema: GenerateBlogPostInputSchema},
  output: {schema: GenerateBlogPostOutputSchema},
  prompt: `You are an expert SEO content writer specializing in generating unique, engaging, and informative blog articles. Your goal is to write a comprehensive, SEO-optimized blog article of at least 500 words on the given topic, naturally incorporating the provided target keywords.

The article should be designed to attract and educate an audience. Structure the article with a compelling title, an engaging introduction, several descriptive subheadings, the main body content, and a strong conclusion that encourages further engagement.

Focus on providing valuable insights and maintaining a professional yet accessible tone.

Topic: {{{topic}}}
Target Keywords: {{#each targetKeywords}}- {{{this}}}\n{{/each}}`,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate blog post content.');
    }
    return output;
  }
);

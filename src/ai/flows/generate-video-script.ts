'use server';
/**
 * @fileOverview A Genkit flow for generating structured video scripts or outlines.
 *
 * - generateVideoScript - A function that generates a video script or outline.
 * - GenerateVideoScriptInput - The input type for the generateVideoScript function.
 * - GenerateVideoScriptOutput - The return type for the generateVideoScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVideoScriptInputSchema = z.object({
  topic: z.string().describe('The specific topic for the video.'),
  targetAudience: z.string().describe('The target audience for the video.'),
});
export type GenerateVideoScriptInput = z.infer<
  typeof GenerateVideoScriptInputSchema
>;

const GenerateVideoScriptOutputSchema = z.object({
  scriptTitle: z.string().describe('A catchy and relevant title for the video script.'),
  introduction: z.string().describe('The introductory part of the video script, engaging the audience.'),
  mainPoints: z
    .array(
      z.object({
        heading: z.string().describe('A heading for a main section of the video.'),
        content: z.string().describe('The detailed content for this section, including key information and talking points.'),
      })
    )
    .describe('An array of main points or sections, each with a heading and detailed content.'),
  conclusion: z.string().describe('The concluding remarks of the video script, summarizing key takeaways.'),
  callToAction: z.string().describe('A clear and compelling call to action for the viewers.'),
});
export type GenerateVideoScriptOutput = z.infer<
  typeof GenerateVideoScriptOutputSchema
>;

export async function generateVideoScript(
  input: GenerateVideoScriptInput
): Promise<GenerateVideoScriptOutput> {
  return generateVideoScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVideoScriptPrompt',
  input: {schema: GenerateVideoScriptInputSchema},
  output: {schema: GenerateVideoScriptOutputSchema},
  prompt: `You are an expert video scriptwriter tasked with creating a structured video script or outline.

Generate a comprehensive video script based on the following information, ensuring it is engaging and tailored for the specified audience.

Topic: {{{topic}}}
Target Audience: {{{targetAudience}}}

Structure the script with:
1. A compelling title.
2. An engaging introduction that hooks the audience.
3. Several main points, each with a clear heading and detailed content.
4. A strong conclusion that summarizes the video's message.
5. A clear call to action.`,
});

const generateVideoScriptFlow = ai.defineFlow(
  {
    name: 'generateVideoScriptFlow',
    inputSchema: GenerateVideoScriptInputSchema,
    outputSchema: GenerateVideoScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate video script content.');
    }
    return output;
  }
);

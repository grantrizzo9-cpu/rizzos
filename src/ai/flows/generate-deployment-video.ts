'use server';
/**
 * @fileOverview A Genkit flow for generating a video that simulates a deployment process.
 *
 * - generateDeploymentVideo - A function that generates a deployment video.
 * - GenerateDeploymentVideoInput - The input type for the generateDeploymentVideo function.
 * - GenerateDeploymentVideoOutput - The return type for the generateDeploymentVideo function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const GenerateDeploymentVideoInputSchema = z.object({
  domainName: z.string().describe('The domain name being deployed.'),
});
export type GenerateDeploymentVideoInput = z.infer<typeof GenerateDeploymentVideoInputSchema>;

const GenerateDeploymentVideoOutputSchema = z.object({
  videoUrl: z.string().describe('The generated video as a data URI.'),
});
export type GenerateDeploymentVideoOutput = z.infer<typeof GenerateDeploymentVideoOutputSchema>;

export async function generateDeploymentVideo(
  input: GenerateDeploymentVideoInput
): Promise<GenerateDeploymentVideoOutput> {
  return generateDeploymentVideoFlow(input);
}

const generateDeploymentVideoFlow = ai.defineFlow(
  {
    name: 'generateDeploymentVideoFlow',
    inputSchema: GenerateDeploymentVideoInputSchema,
    outputSchema: GenerateDeploymentVideoOutputSchema,
  },
  async input => {
    let {operation} = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: `Generate a 5-second, 16:9 aspect ratio video that simulates a command-line interface (CLI) or "hacker" terminal during a website deployment.

The video should have a black background with green, monospaced text rapidly scrolling.

The text should show a sequence of deployment steps for the domain "${input.domainName}". The steps should look like this, with some random characters or progress indicators:

- Initializing deployment for ${input.domainName}... OK
- Connecting to Firebase services...
- Authenticating... gcloud token authenticated.
- Provisioning A records (199.36.158.100, 199.36.158.101)... Done.
- Provisioning CNAME record for www.${input.domainName}... Done.
- Compressing website assets... 1.2MB -> 340KB.
- Uploading website content [####################] 100%
- Verifying content integrity... Hash matches.
- Finalizing deployment on Firebase edge network...
- Cleaning up temporary files...
- SUCCESS: Deployment complete for ${input.domainName}.
- NOTE: Global propagation may take up to 10 minutes.`,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Poll for the result
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.checkOperation(operation);
    }

    if (operation.error) {
      throw new Error(`Failed to generate video: ${operation.error.message}`);
    }

    const videoPart = operation.output?.message?.content.find(p => !!p.media);
    if (!videoPart || !videoPart.media) {
      throw new Error('Failed to find the generated video in the result.');
    }

    // The Gemini API key is required to download the video.
    // It should be available in the environment variables on the server.
    const videoDownloadUrl = `${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`;
    const videoResponse = await fetch(videoDownloadUrl);

    if (!videoResponse.ok) {
      throw new Error(
        `Failed to download video file: ${videoResponse.statusText}`
      );
    }

    const videoBuffer = await videoResponse.arrayBuffer();
    const videoBase64 = Buffer.from(videoBuffer).toString('base64');

    return {
      videoUrl: `data:video/mp4;base64,${videoBase64}`,
    };
  }
);


import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// The googleAI() plugin will automatically use the service account credentials
// available in the App Hosting environment. An API key is not required for authentication
// in this production environment, as it relies on the service account's IAM permissions.
const googleAiPlugin = googleAI();

export const ai = genkit({
  plugins: [googleAiPlugin],
});

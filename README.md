# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables

This project uses a `.env` file to manage secret keys and other environment-specific configurations. You will need to add your own keys for services like Google AI Studio to enable all features.

- **`GEMINI_API_KEY`**: Required for AI video generation and analysis features.

**Important:** Any variable that needs to be accessed in the browser **MUST** be prefixed with `NEXT_PUBLIC_`.

## About Your Firebase Project

This application is connected to a dedicated Firebase project that is automatically provisioned for your development session. You may see a randomly generated project ID (like `studio-xxxxxxxx-xxxx`) in logs or configuration files. This is the correct project for this environment.

All backend services, including Hosting, Firestore, and Authentication, are managed within this project. If you have connected a custom domain, it is also linked to this project via the `apphosting.yaml` configuration file.

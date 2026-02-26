# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables

This project uses a `.env` file to manage secret keys and other environment-specific configurations. You will need to add your own keys for services like PayPal and Google AI Studio to enable all features.

- **`GEMINI_API_KEY`**: Required for AI video generation and analysis features.
- **`NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID`**: Your sandbox client ID from the PayPal Developer Dashboard for testing payments.

**Important:** Any variable that needs to be accessed in the browser (like the PayPal Client ID) **MUST** be prefixed with `NEXT_PUBLIC_`.

## About Your Firebase Project

This application is connected to a dedicated Firebase project that is automatically provisioned for your development session. You may see a randomly generated project ID (like `studio-xxxxxxxx-xxxx`) in logs or configuration files. This is the correct project for this environment.

All backend services, including Hosting, Firestore, and Authentication, are managed within this project. If you have connected a custom domain, it is also linked to this project via the `apphosting.yaml` configuration file.

import { AuthForm } from '@/components/auth/auth-form';

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ ref?: string, theme?: string }> }) {
  const params = await searchParams;
  return <AuthForm mode="signup" referrer={params?.ref} themeName={params?.theme} />;
}

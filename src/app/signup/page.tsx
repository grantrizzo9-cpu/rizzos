import { AuthForm } from '@/components/auth/auth-form';

export default function SignupPage({ searchParams }: { searchParams: { ref?: string, theme?: string } }) {
  return <AuthForm mode="signup" referrer={searchParams?.ref} themeName={searchParams?.theme} />;
}

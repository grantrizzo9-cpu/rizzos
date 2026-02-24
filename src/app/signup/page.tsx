import { AuthForm } from '@/components/auth/auth-form';

export default function SignupPage({ searchParams }: { searchParams: { ref?: string } }) {
  return <AuthForm mode="signup" referrer={searchParams?.ref} />;
}

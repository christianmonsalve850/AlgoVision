import { GoogleSignInButton } from "@/features/auth/components/google-signin-button";
import { ErrorBanner } from "@/components/ui/error-banner";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const hasError = params.error === "auth-failed";

  return ( 
    <main className="flex flex-col min-h-screen items-center justify-center bg-background">
      {hasError && <ErrorBanner message="Something went wrong. Please try again." />}
      <GoogleSignInButton />
    </main>
  );
}
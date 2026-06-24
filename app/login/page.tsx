import { GoogleSignInButton } from "@/features/auth/components/google-signin-button";
import { GitHubSignInButton } from "@/features/auth/components/github-signin-button";
import { ErrorBanner } from "@/components/ui/error-banner";
import Image from "next/image";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const hasError = params.error === "auth-failed";

  return ( 
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6">
      <div className="flex items-center mb-2">
        <Image
          src="/logo.svg"
          alt="AlgoVision Logo"
          className="mr-2 rounded-lg bg-white"
          width={40}
          height={40}
        />
        <h1 className="text-2xl font-bold text-foreground">AlgoVision</h1>
      </div>
      <span className="mb-6 text-muted-foreground">See the algorithm. Understand the pattern.</span>
      {hasError && <ErrorBanner message="Something went wrong. Please try again." />}
      <GoogleSignInButton />
      <GitHubSignInButton />
      <span className="mt-6 text-muted-foreground">By continuing, you agree to our Terms and Privacy Policy.</span>
    </main>
  );
}

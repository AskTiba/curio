import { SignInForm } from "@/components/features/auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-6 p-8">
        <h1 className="text-xl font-semibold text-text-primary">Sign In</h1>
        <p className="text-sm text-text-tertiary">
          Sign in to your account or try as guest
        </p>
        <SignInForm />
      </div>
    </div>
  );
}

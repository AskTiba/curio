import { SignUpForm } from "@/components/features/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-6 p-8">
        <h1 className="text-xl font-semibold text-text-primary">Create Account</h1>
        <p className="text-sm text-text-tertiary">
          Sign up to save your feeds and bookmarks
        </p>
        <SignUpForm />
      </div>
    </div>
  );
}

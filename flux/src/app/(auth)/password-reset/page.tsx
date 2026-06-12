import { PasswordResetForm } from "@/components/features/auth/PasswordResetForm";

export default function PasswordResetPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-6 p-8">
        <h1 className="text-xl font-semibold text-text-primary">Reset Password</h1>
        <p className="text-sm text-text-tertiary">
          Enter your email and we&apos;ll send you a reset link
        </p>
        <PasswordResetForm />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/Button";

export function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSent(true);
    setIsLoading(false);
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-sm text-center">
        <p className="text-text-secondary">
          Check your email for a password reset link.
        </p>
        <Link
          href="/sign-in"
          className="text-sm text-accent hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-text-secondary">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="px-3 py-2 rounded-md border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-error">{error}</p>
      )}

      <Button type="submit" isLoading={isLoading} className="w-full">
        Send Reset Link
      </Button>

      <p className="text-sm text-text-tertiary text-center">
        <Link href="/sign-in" className="text-accent hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}

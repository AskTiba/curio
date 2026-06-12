"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/Button";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/feed");
    router.refresh();
  };

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

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-text-secondary">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          required
          minLength={6}
          className="px-3 py-2 rounded-md border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-error">{error}</p>
      )}

      <Button type="submit" isLoading={isLoading} className="w-full">
        Create Account
      </Button>

      <p className="text-sm text-text-tertiary text-center">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

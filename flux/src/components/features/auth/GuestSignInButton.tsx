"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function GuestSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleGuestSignIn = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInAnonymously();

    if (error) {
      console.error(error);
      setIsLoading(false);
      return;
    }

    router.push("/feed");
    router.refresh();
  };

  return (
    <button
      onClick={handleGuestSignIn}
      disabled={isLoading}
      className="bg-bg-tertiary text-text-primary px-6 py-2.5 rounded-md font-semibold hover:bg-border transition-colors text-sm border border-border-subtle disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center min-w-[120px]"
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
      ) : (
        "Try as Guest"
      )}
    </button>
  );
}

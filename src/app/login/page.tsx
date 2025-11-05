"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const DEFAULT_REDIRECT_PATH = "/";

interface AuthError {
  message?: string;
}

function isAuthError(error: unknown): error is AuthError {
  return typeof error === "object" && error !== null && "message" in error;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAuthError(error) && error.message) {
    return error.message;
  }
  return fallback;
}

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? DEFAULT_REDIRECT_PATH;

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [busySignIn, setBusySignIn] = useState<boolean>(false);
  const [busySignUp, setBusySignUp] = useState<boolean>(false);
  const [busyGoogle, setBusyGoogle] = useState<boolean>(false);

  async function onPasswordSignIn(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    setBusySignIn(true);
    try {
      await signIn("password", { email, password });
      toast.success("Signed in");
      router.replace(redirectTo);
    } catch (error) {
      toast.error(getErrorMessage(error, "Sign-in failed"));
    } finally {
      setBusySignIn(false);
    }
  }

  async function onPasswordSignUp(): Promise<void> {
    setBusySignUp(true);
    try {
      // create: true → create account if it doesn't exist
      await signIn("password", { email, password, create: true });
      toast.success("Account created");
      router.replace(redirectTo);
    } catch (error) {
      toast.error(getErrorMessage(error, "Sign-up failed"));
    } finally {
      setBusySignUp(false);
    }
  }

  async function onGoogle(): Promise<void> {
    setBusyGoogle(true);
    try {
      // Triggers OAuth redirect
      await signIn("google", {});
      // No need to route here; provider will redirect back
    } catch (error) {
      toast.error(getErrorMessage(error, "Google sign-in failed"));
      setBusyGoogle(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto pt-12 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Use your email & password or continue with Google.
        </p>
      </div>

      <form onSubmit={onPasswordSignIn} className="space-y-3">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={busySignIn || busyGoogle}>
            {busySignIn ? "Signing in..." : "Sign in"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onPasswordSignUp}
            disabled={busySignUp || busyGoogle}
          >
            {busySignUp ? "Creating..." : "Create account"}
          </Button>
        </div>
      </form>

      <div className="pt-2">
        <Button
          variant="outline"
          onClick={onGoogle}
          disabled={busyGoogle || busySignIn || busySignUp}
        >
          {busyGoogle ? "Redirecting..." : "Continue with Google"}
        </Button>
      </div>
    </div>
  );
}

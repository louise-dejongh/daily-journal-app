"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

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

  async function onPasswordSignIn(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    setBusySignIn(true);
    try {
      await signIn("password", { email, password, flow: "signIn" });
      toast.success("Signed in");
      router.replace(redirectTo);
    } catch (error) {
      toast.error(getErrorMessage(error, "Sign-in failed"));
    } finally {
      setBusySignIn(false);
    }
  }

  // Uncomment when Google OAuth is configured
  // async function onGoogle(): Promise<void> {
  //   setBusyGoogle(true);
  //   try {
  //     // Triggers OAuth redirect
  //     await signIn("google", {});
  //     // No need to route here; provider will redirect back
  //   } catch (error) {
  //     toast.error(getErrorMessage(error, "Google sign-in failed"));
  //     setBusyGoogle(false);
  //   }
  // }

  return (
    <div className="max-w-sm mx-auto pt-12 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password to sign in
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
        <Button type="submit" disabled={busySignIn} className="w-full">
          {busySignIn ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Create account
        </Link>
      </div>

      {/* Uncomment when Google OAuth is configured in .env.local */}
      {/* <div className="pt-2">
        <Button
          variant="outline"
          onClick={onGoogle}
          disabled={busyGoogle || busySignIn}
        >
          {busyGoogle ? "Redirecting..." : "Continue with Google"}
        </Button>
      </div> */}
    </div>
  );
}

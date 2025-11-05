"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
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

export default function SignUpPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateProfile);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  const [busy, setBusy] = useState<boolean>(false);

  async function onSignUp(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!dateOfBirth) {
      toast.error("Please enter your date of birth");
      return;
    }

    if (!gender) {
      toast.error("Please select your gender");
      return;
    }

    setBusy(true);
    try {
      // First, create the account with email/password
      await signIn("password", { email, password, flow: "signUp" });

      // Then update the user profile with additional information
      await updateProfile({
        name,
        dateOfBirth,
        gender,
      });

      toast.success("Account created successfully!");
      router.replace(DEFAULT_REDIRECT_PATH);
    } catch (error) {
      toast.error(getErrorMessage(error, "Sign-up failed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto pt-12 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your information to get started
        </p>
      </div>

      <form onSubmit={onSignUp} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium block mb-1.5">
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium block mb-1.5">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium block mb-1.5"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div>
          <label
            htmlFor="dateOfBirth"
            className="text-sm font-medium block mb-1.5"
          >
            Date of Birth
          </label>
          <Input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="gender" className="text-sm font-medium block mb-1.5">
            Gender
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

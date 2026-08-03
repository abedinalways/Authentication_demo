"use client";

import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your account to continue."
      footer={
        <>
          Don't have an account? <Link href="/register">Create one</Link>
          {" · "}
          <Link href="/forgot-password">Forgot password?</Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
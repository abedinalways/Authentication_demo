"use client";

import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your account email and we'll send you a verification code."
      footer={
        <>
          Remembered it? <Link href="/login">Back to login</Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
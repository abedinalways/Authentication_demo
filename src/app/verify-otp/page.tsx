"use client";

import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";

export default function VerifyOtpPage() {
  return (
    <AuthShell
      title="Verify your code"
      subtitle="Enter the 6-digit code we sent to your email."
      footer={
        <>
          Wrong email? <Link href="/forgot-password">Start over</Link>
        </>
      }
    >
      <VerifyOtpForm />
    </AuthShell>
  );
}
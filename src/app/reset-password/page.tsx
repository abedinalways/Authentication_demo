"use client";

import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before."
      footer={
        <>
          Changed your mind? <Link href="/login">Back to login</Link>
        </>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
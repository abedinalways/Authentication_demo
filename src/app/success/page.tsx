"use client";

import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";

export default function SuccessPage() {
  return (
    <AuthShell
      title="Password updated"
      subtitle="Your password has been reset successfully. You can now sign in with your new password."
      footer={
        <>
          Ready to continue? <Link href="/login">Go to login</Link>
        </>
      }
    >
      <div className="success-banner">All set. Sign in to continue.</div>
    </AuthShell>
  );
}
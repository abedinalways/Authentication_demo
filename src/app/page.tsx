"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessTokenCookie } from "@/lib/cookie";

export default function HomePage() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(getAccessTokenCookie()));
  }, []);

  useEffect(() => {
    router.replace(hasToken ? "/dashboard" : "/login");
  }, [hasToken, router]);

  return (
    <main className="auth-layout">
      <div className="spinner" />
    </main>
  );
}
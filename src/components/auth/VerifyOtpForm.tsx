"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field } from "./Field";
import { ErrorBanner } from "./Banners";
import { useAuth } from "@/hooks/useAuth";
import { verifyOTPSchema, type VerifyOTPFormData } from "@/lib/validation/auth.schema";

export function VerifyOtpForm() {
  const router = useRouter();
  const { emailForReset, verifyOTP } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOTPFormData>({ resolver: zodResolver(verifyOTPSchema) });

  const onSubmit = async (values: VerifyOTPFormData) => {
    setSubmitting(true);
    setFormError(null);
    const result = await verifyOTP(values.otp);
    if (result.ok) {
      router.push("/reset-password");
    } else {
      setFormError(result.message ?? "Verification failed");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <ErrorBanner message={formError} />

      <Field label="Verification code" error={errors.otp?.message}>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          className="field-input"
          {...register("otp")}
        />
      </Field>

      <p className="small-note">
        Code sent to: <code>{emailForReset ?? "your email"}</code>
      </p>

      <button type="submit" className="btn" disabled={submitting}>
        {submitting ? "Verifying…" : "Verify code"}
      </button>
    </form>
  );
}
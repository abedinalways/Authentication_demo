"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field } from "./Field";
import { ErrorBanner } from "./Banners";
import { useAuth } from "@/hooks/useAuth";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validation/auth.schema";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordFormData) => {
    setSubmitting(true);
    setFormError(null);
    const result = await forgotPassword(values.email);
    if (result.ok) {
      router.push("/verify-otp");
    } else {
      setFormError(result.message ?? "Something went wrong");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <ErrorBanner message={formError} />

      <Field label="Email" error={errors.email?.message}>
        <input
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          className="field-input"
          {...register("email")}
        />
      </Field>

      <button type="submit" className="btn" disabled={submitting}>
        {submitting ? "Sending OTP…" : "Send OTP"}
      </button>
    </form>
  );
}
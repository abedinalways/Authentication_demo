"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field } from "./Field";
import { ErrorBanner } from "./Banners";
import { useAuth } from "@/hooks/useAuth";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validation/auth.schema";

export function ResetPasswordForm() {
  const router = useRouter();
  const { resetPassword, emailForReset } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (values: ResetPasswordFormData) => {
    setSubmitting(true);
    setFormError(null);
    const result = await resetPassword(values.password);
    if (result.ok) {
      router.push("/success");
    } else {
      setFormError(result.message ?? "Reset failed");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <ErrorBanner message={formError} />

      <Field label="New password" error={errors.password?.message}>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className="field-input"
          {...register("password")}
        />
      </Field>

      <Field label="Confirm new password" error={errors.confirmPassword?.message}>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className="field-input"
          {...register("confirmPassword")}
        />
      </Field>

      <p className="small-note">
        Account: <code>{emailForReset ?? "unknown"}</code>
      </p>

      <button type="submit" className="btn" disabled={submitting}>
        {submitting ? "Resetting…" : "Reset password"}
      </button>
    </form>
  );
}
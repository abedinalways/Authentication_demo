"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field } from "./Field";
import { ErrorBanner } from "./Banners";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterFormData } from "@/lib/validation/auth.schema";

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterFormData) => {
    setSubmitting(true);
    setFormError(null);
    const result = await registerUser({
      name: values.name,
      email: values.email,
      password: values.password,
    });
    if (result.ok) {
      router.push("/dashboard");
    } else {
      setFormError(result.message ?? "Registration failed");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <ErrorBanner message={formError} />

      <Field label="Name" error={errors.name?.message}>
        <input
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          className="field-input"
          {...register("name")}
        />
      </Field>

      <Field label="Email" error={errors.email?.message}>
        <input
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          className="field-input"
          {...register("email")}
        />
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className="field-input"
          {...register("password")}
        />
      </Field>

      <Field label="Confirm password" error={errors.confirmPassword?.message}>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className="field-input"
          {...register("confirmPassword")}
        />
      </Field>

      <button type="submit" className="btn" disabled={submitting}>
        {submitting ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
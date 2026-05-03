"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { loginSchema } from "../schemas/auth.schema";

export function useLoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isDisabled = !username || !password || submitting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ username, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal. Periksa kembali kredensial Anda.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    submitting,
    isDisabled,
    handleSubmit,
  };
}

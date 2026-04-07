"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/admin?reset=success");
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#1c1b19] text-[#FDFBF7] flex items-center justify-center px-8">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-heading font-semibold mb-4">
            Invalid Link
          </h1>
          <p className="text-white/40 font-body text-sm mb-8">
            This reset link is invalid or has expired.
          </p>
          <a
            href="/admin"
            className="text-[#8A7B66] font-mono text-xs tracking-widest uppercase hover:text-white transition-colors"
          >
            Back to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1b19] text-[#FDFBF7] flex items-center justify-center px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <h1 className="text-3xl font-heading font-semibold mb-2">
          Reset Password
        </h1>
        <p className="text-white/40 font-body text-sm mb-8">
          Enter your new admin password
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-none px-6 py-4 focus:outline-none focus:border-[#8A7B66] transition-colors font-body text-sm mb-4"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              setError("");
            }}
            className="w-full bg-white/5 border border-white/10 rounded-none px-6 py-4 focus:outline-none focus:border-[#8A7B66] transition-colors font-body text-sm mb-4"
          />

          {error && (
            <p className="text-red-400 text-sm font-body mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8A7B66] text-[#FDFBF7] font-heading tracking-wide uppercase px-6 py-4 rounded-none hover:bg-[#FDFBF7] hover:text-[#1c1b19] transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/admin"
            className="text-[#8A7B66] font-mono text-xs tracking-widest uppercase hover:text-white transition-colors"
          >
            Back to login
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1c1b19] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#8A7B66] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

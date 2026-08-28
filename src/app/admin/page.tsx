"use client";

import { useState, useEffect, useCallback, type FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import StatsCards from "@/components/admin/StatsCards";
import SubmissionsTable from "@/components/admin/SubmissionsTable";
import TrafficChart from "@/components/admin/TrafficChart";
import SectionEngagement from "@/components/admin/SectionEngagement";
import ScrollDepth from "@/components/admin/ScrollDepth";

interface Stats {
  totalSubmissions: number;
  weekSubmissions: number;
  totalChildren: number;
  totalPageViews: number;
  uniqueSessions: number;
  avgTimeOnPage: number;
  dailyChart: { date: string; count: number }[];
  sectionEngagement: Record<string, number>;
  scrollDepth: Record<string, number>;
}

interface Submission {
  id: string;
  family_name: string;
  email: string;
  num_kids: number | null;
  created_at: string;
  ip_address: string;
}

function AdminContent() {
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Forgot password state
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(resetSuccess);

  // Auto-dismiss success banner
  useEffect(() => {
    if (showBanner) {
      const t = setTimeout(() => setShowBanner(false), 5000);
      return () => clearTimeout(t);
    }
  }, [showBanner]);

  // Check if already authenticated
  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true);
          return res.json();
        }
        setAuthenticated(false);
        return null;
      })
      .then((data) => {
        if (data) setStats(data);
      });
  }, []);

  const fetchData = useCallback(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
    fetch("/api/admin/submissions")
      .then((r) => r.json())
      .then((d) => setSubmissions(d.submissions || []));
  }, []);

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated, fetchData]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(false);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setAuthenticated(true);
    } else {
      setLoginError(true);
      setLoginLoading(false);
    }
  }

  async function handleForgotPassword(e: FormEvent) {
    e.preventDefault();
    setResetLoading(true);

    await fetch("/api/admin/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail }),
    });

    setResetSent(true);
    setResetLoading(false);
  }

  function handleSort(field: string, order: string) {
    fetch(`/api/admin/submissions?sort=${field}&order=${order}`)
      .then((r) => r.json())
      .then((d) => setSubmissions(d.submissions || []));
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setStats(null);
    setSubmissions([]);
    setPassword("");
    setLoginLoading(false);
  }

  function handleExportCSV() {
    if (!submissions.length) return;
    const header = "Family Name,Email,Children,Date,IP Address";
    const rows = submissions.map((s) => {
      const date = new Date(s.created_at).toLocaleDateString("en-US");
      return `"${s.family_name}","${s.email}","${s.num_kids ?? ""}","${date}","${s.ip_address || ""}"`;
    });
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alpha-napa-submissions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Loading state
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#1c1b19] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#8A7B66] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#1c1b19] text-[#FDFBF7] flex items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Reset success banner */}
          <AnimatePresence>
            {showBanner && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 mb-6"
              >
                <p className="text-emerald-400 text-sm font-body">
                  Password updated successfully. Log in with your new password.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <h1 className="text-3xl font-heading font-semibold mb-2">
            Admin Access
          </h1>
          <p className="text-white/40 font-body text-sm mb-8">
            Alpha Napa Dashboard
          </p>

          <AnimatePresence mode="wait">
            {!forgotMode ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
              >
                <motion.div
                  animate={loginError ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError(false);
                    }}
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-none px-6 py-4 focus:outline-none focus:border-[#8A7B66] transition-colors font-body text-sm mb-4"
                  />
                </motion.div>
                {loginError && (
                  <p className="text-red-400 text-sm font-body mb-4">
                    Invalid password
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-[#8A7B66] text-[#FDFBF7] font-heading tracking-wide uppercase px-6 py-4 rounded-none hover:bg-[#FDFBF7] hover:text-[#1c1b19] transition-colors disabled:opacity-50"
                >
                  {loginLoading ? "Verifying..." : "Enter"}
                </button>
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotMode(true);
                      setResetSent(false);
                      setResetEmail("");
                    }}
                    className="text-white/30 font-mono text-xs tracking-widest uppercase hover:text-[#8A7B66] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {!resetSent ? (
                  <form onSubmit={handleForgotPassword}>
                    <input
                      type="email"
                      placeholder="Recovery email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      autoFocus
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-none px-6 py-4 focus:outline-none focus:border-[#8A7B66] transition-colors font-body text-sm mb-4"
                    />
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full bg-[#8A7B66] text-[#FDFBF7] font-heading tracking-wide uppercase px-6 py-4 rounded-none hover:bg-[#FDFBF7] hover:text-[#1c1b19] transition-colors disabled:opacity-50"
                    >
                      {resetLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </form>
                ) : (
                  <div className="bg-white/5 border border-white/10 px-6 py-6">
                    <p className="text-white/60 font-body text-sm leading-relaxed">
                      If that email is authorized, you&rsquo;ll receive a reset
                      link shortly. Check your inbox.
                    </p>
                  </div>
                )}
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotMode(false);
                      setResetSent(false);
                    }}
                    className="text-white/30 font-mono text-xs tracking-widest uppercase hover:text-[#8A7B66] transition-colors"
                  >
                    Back to login
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // Dashboard
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#1c1b19] text-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Greeting */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-2">
              Welcome back
            </h1>
            <p className="font-mono text-sm text-[#8A7B66] tracking-wide">
              {dateStr}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="font-mono text-xs tracking-widest uppercase text-white/30 hover:text-white transition-colors mt-2"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8"
          >
            <StatsCards
              totalSubmissions={stats.totalSubmissions}
              weekSubmissions={stats.weekSubmissions}
              totalChildren={stats.totalChildren}
              totalPageViews={stats.totalPageViews}
              uniqueSessions={stats.uniqueSessions}
              avgTimeOnPage={stats.avgTimeOnPage}
            />

            {/* Submissions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl font-medium">
                  Submissions
                </h2>
                {submissions.length > 0 && (
                  <button
                    onClick={handleExportCSV}
                    className="font-mono text-xs tracking-widest uppercase text-[#8A7B66] hover:text-white transition-colors"
                  >
                    Export CSV
                  </button>
                )}
              </div>
              <SubmissionsTable
                submissions={submissions}
                onSort={handleSort}
              />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TrafficChart dailyChart={stats.dailyChart} />
              <SectionEngagement
                sectionEngagement={stats.sectionEngagement}
              />
            </div>

            <ScrollDepth scrollDepth={stats.scrollDepth} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1c1b19] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#8A7B66] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}

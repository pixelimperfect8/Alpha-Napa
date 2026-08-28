import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalSubmissions,
    weekSubmissions,
    childrenRows,
    totalPageViews,
    uniqueSessions,
    timeOnPageEvents,
    dailyPageViews,
    sectionViews,
    scrollDepthEvents,
  ] = await Promise.all([
    supabaseAdmin
      .from("submissions")
      .select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString()),
    supabaseAdmin.from("submissions").select("num_kids"),
    supabaseAdmin
      .from("page_events")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "page_view"),
    supabaseAdmin
      .from("page_events")
      .select("session_id")
      .eq("event_type", "page_view"),
    supabaseAdmin
      .from("page_events")
      .select("metadata")
      .eq("event_type", "time_on_page"),
    supabaseAdmin
      .from("page_events")
      .select("created_at")
      .eq("event_type", "page_view")
      .gte("created_at", thirtyDaysAgo.toISOString()),
    supabaseAdmin
      .from("page_events")
      .select("metadata")
      .eq("event_type", "section_view"),
    supabaseAdmin
      .from("page_events")
      .select("metadata")
      .eq("event_type", "scroll_depth"),
  ]);

  const totalChildren = (childrenRows.data || []).reduce(
    (sum: number, row: { num_kids: number | null }) =>
      sum + (typeof row.num_kids === "number" ? row.num_kids : 0),
    0
  );

  const uniqueSessionCount = new Set(
    (uniqueSessions.data || []).map(
      (row: { session_id: string }) => row.session_id
    )
  ).size;

  const timeValues = (timeOnPageEvents.data || [])
    .map(
      (row: { metadata: Record<string, unknown> }) =>
        (row.metadata as { seconds?: number })?.seconds
    )
    .filter((v: unknown): v is number => typeof v === "number");
  const avgTimeOnPage =
    timeValues.length > 0
      ? Math.round(timeValues.reduce((a, b) => a + b, 0) / timeValues.length)
      : 0;

  const dailyCounts: Record<string, number> = {};
  for (const row of dailyPageViews.data || []) {
    const day = new Date(
      (row as { created_at: string }).created_at
    )
      .toISOString()
      .split("T")[0];
    dailyCounts[day] = (dailyCounts[day] || 0) + 1;
  }
  const dailyChart: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    dailyChart.push({ date: key, count: dailyCounts[key] || 0 });
  }

  const sectionCounts: Record<string, number> = {};
  for (const row of sectionViews.data || []) {
    const section =
      ((row as { metadata: Record<string, unknown> }).metadata as { section_id?: string })?.section_id || "unknown";
    sectionCounts[section] = (sectionCounts[section] || 0) + 1;
  }

  const scrollCounts: Record<string, number> = {
    "25": 0,
    "50": 0,
    "75": 0,
    "100": 0,
  };
  for (const row of scrollDepthEvents.data || []) {
    const depth = String(
      ((row as { metadata: Record<string, unknown> }).metadata as { depth?: number })?.depth || ""
    );
    if (depth in scrollCounts) {
      scrollCounts[depth]++;
    }
  }

  return NextResponse.json({
    totalSubmissions: totalSubmissions.count || 0,
    weekSubmissions: weekSubmissions.count || 0,
    totalChildren,
    totalPageViews: totalPageViews.count || 0,
    uniqueSessions: uniqueSessionCount,
    avgTimeOnPage,
    dailyChart,
    sectionEngagement: sectionCounts,
    scrollDepth: scrollCounts,
  });
}

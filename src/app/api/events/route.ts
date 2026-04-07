import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

const VALID_EVENT_TYPES = [
  "page_view",
  "scroll_depth",
  "section_view",
  "time_on_page",
  "cta_click",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { events } = body;

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: "Events array required" },
        { status: 400 }
      );
    }

    if (events.length > 50) {
      return NextResponse.json(
        { error: "Too many events in batch" },
        { status: 400 }
      );
    }

    const validEvents = events
      .filter(
        (e: { event_type: string; session_id: string }) =>
          VALID_EVENT_TYPES.includes(e.event_type) && e.session_id
      )
      .map((e: { event_type: string; metadata?: Record<string, unknown>; session_id: string; referrer?: string }) => ({
        event_type: e.event_type,
        metadata: e.metadata || {},
        session_id: e.session_id,
        referrer: e.referrer || null,
        user_agent: request.headers.get("user-agent") || null,
      }));

    if (validEvents.length === 0) {
      return NextResponse.json({ error: "No valid events" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("page_events")
      .insert(validEvents);

    if (error) {
      console.error("Supabase event insert error:", error);
      return NextResponse.json(
        { error: "Failed to save events" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, count: validEvents.length });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

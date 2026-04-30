import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FOUNDER_EMAILS = [
  "austin@pacaso.com",
  "tylerx@hundred.com",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { family_name, email } = body;

    if (
      !family_name ||
      typeof family_name !== "string" ||
      family_name.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Family name is required" },
        { status: 400 }
      );
    }
    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const trimmedName = family_name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    const ip_address =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const user_agent = request.headers.get("user-agent") || "unknown";

    const { error } = await supabaseAdmin.from("submissions").insert({
      family_name: trimmedName,
      email: trimmedEmail,
      ip_address,
      user_agent,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save submission" },
        { status: 500 }
      );
    }

    // Notify founders via email
    try {
      await resend.emails.send({
        from: "Alpha Napa <notifications@napa.pixelimperfect.io>",
        to: FOUNDER_EMAILS,
        subject: `New Interest: ${trimmedName}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px;">
            <h2 style="color: #2D2C2A; margin-bottom: 24px;">New Interest Submission</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888; width: 120px;">Family Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #2D2C2A; font-weight: 500;">${trimmedName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #2D2C2A;"><a href="mailto:${trimmedEmail}" style="color: #8A7B66;">${trimmedEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #888;">Submitted</td>
                <td style="padding: 12px 0; color: #2D2C2A;">${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "medium", timeStyle: "short" })}</td>
              </tr>
            </table>
            <p style="margin-top: 24px; font-size: 13px; color: #aaa;">Alpha School Napa Valley — alphanapa.org</p>
          </div>
        `,
      });
    } catch (emailErr) {
      // Log but don't fail the submission if email fails
      console.error("Failed to send notification email:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

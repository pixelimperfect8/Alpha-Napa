import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { Resend } from "resend";

const AUTHORIZED_EMAILS = ["tylerx@hundred.com", "ivan@pixelimperfect.io"];

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const normalizedEmail = (email || "").trim().toLowerCase();

    // Generic response to prevent email enumeration
    const genericResponse = NextResponse.json({
      message:
        "If that email is authorized, you'll receive a reset link shortly.",
    });

    if (!AUTHORIZED_EMAILS.includes(normalizedEmail)) {
      return genericResponse;
    }

    // Generate token (UUID)
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token in DB
    const { error: dbError } = await supabaseAdmin
      .from("password_reset_tokens")
      .insert({
        token,
        email: normalizedEmail,
        expires_at: expiresAt.toISOString(),
      });

    if (dbError) {
      console.error("Failed to store reset token:", dbError);
      return genericResponse;
    }

    // Send email via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error("RESEND_API_KEY not configured");
      return genericResponse;
    }

    const resend = new Resend(resendKey);
    const origin =
      request.headers.get("origin") ||
      request.headers.get("x-forwarded-host") ||
      "https://alpha-napa.vercel.app";

    const resetUrl = `${origin}/admin/reset-password?token=${token}`;

    await resend.emails.send({
      from: "Alpha Napa <notifications@napa.pixelimperfect.io>",
      to: normalizedEmail,
      subject: "Reset your Alpha Napa admin password",
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #2D2C2A; margin-bottom: 8px;">Password Reset</h2>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Someone requested a password reset for the Alpha Napa admin dashboard.
            Click the button below to set a new password. This link expires in 1 hour.
          </p>
          <a href="${resetUrl}" style="display: inline-block; background: #8A7B66; color: #FDFBF7; text-decoration: none; padding: 14px 28px; font-size: 14px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; margin: 24px 0;">
            Reset Password
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 32px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return genericResponse;
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      {
        message:
          "If that email is authorized, you'll receive a reset link shortly.",
      }
    );
  }
}

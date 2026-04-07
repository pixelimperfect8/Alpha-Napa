import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    let valid = false;

    // 1. Check bcrypt hash from DB
    const { data } = await supabaseAdmin
      .from("admin_settings")
      .select("value")
      .eq("key", "admin_password_hash")
      .single();

    if (data?.value) {
      valid = bcrypt.compareSync(password, data.value);
    } else if (password === process.env.ADMIN_PASSWORD) {
      // 2. Env var fallback — auto-seed hash into DB for future logins
      valid = true;
      const hash = bcrypt.hashSync(password, 10);
      await supabaseAdmin.from("admin_settings").upsert(
        { key: "admin_password_hash", value: hash, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    }

    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = Buffer.from(`admin:${password}`).toString("base64");

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

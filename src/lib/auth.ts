import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function isAdminAuthenticated(
  request: NextRequest
): Promise<boolean> {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return false;

  // Decode the Base64 token → "admin:<password>"
  let submittedPassword: string;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    if (!decoded.startsWith("admin:")) return false;
    submittedPassword = decoded.slice(6);
  } catch {
    return false;
  }

  // 1. Check bcrypt hash from DB first
  const { data } = await supabaseAdmin
    .from("admin_settings")
    .select("value")
    .eq("key", "admin_password_hash")
    .single();

  if (data?.value) {
    return bcrypt.compareSync(submittedPassword, data.value);
  }

  // 2. Fall back to env var
  return submittedPassword === process.env.ADMIN_PASSWORD;
}

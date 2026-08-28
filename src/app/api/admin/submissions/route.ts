import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sort") || "created_at";
  const order = searchParams.get("order") === "asc";

  const validSortFields = ["family_name", "email", "num_kids", "created_at"];
  const sortField = validSortFields.includes(sortBy) ? sortBy : "created_at";

  const { data, error } = await supabaseAdmin
    .from("submissions")
    .select("*")
    .order(sortField, { ascending: order });

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }

  return NextResponse.json({ submissions: data });
}

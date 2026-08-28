"use client";

import { useState } from "react";

interface Submission {
  id: string;
  family_name: string;
  email: string;
  num_kids: number | null;
  created_at: string;
  ip_address: string;
}

interface SubmissionsTableProps {
  submissions: Submission[];
  onSort: (field: string, order: string) => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function SubmissionsTable({
  submissions,
  onSort,
}: SubmissionsTableProps) {
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  function handleSort(field: string) {
    const newOrder =
      field === sortField && sortOrder === "desc" ? "asc" : "desc";
    setSortField(field);
    setSortOrder(newOrder);
    onSort(field, newOrder);
  }

  const sortIndicator = (field: string) => {
    if (field !== sortField) return "";
    return sortOrder === "asc" ? " \u2191" : " \u2193";
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {[
                { key: "family_name", label: "Family Name" },
                { key: "email", label: "Email" },
                { key: "num_kids", label: "Children" },
                { key: "created_at", label: "Date" },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="text-left px-6 py-4 font-mono text-[0.65rem] tracking-widest uppercase text-[#8A7B66] cursor-pointer hover:text-[#FDFBF7] transition-colors select-none"
                >
                  {col.label}
                  {sortIndicator(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-16 text-center text-white/30 font-body"
                >
                  No submissions yet
                </td>
              </tr>
            ) : (
              submissions.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 font-heading font-medium">
                    {sub.family_name}
                  </td>
                  <td className="px-6 py-4 font-body text-white/60">
                    {sub.email}
                  </td>
                  <td className="px-6 py-4 font-body text-white/60">
                    {sub.num_kids ?? "—"}
                  </td>
                  <td
                    className="px-6 py-4 font-mono text-xs text-white/40"
                    title={new Date(sub.created_at).toLocaleString()}
                  >
                    {timeAgo(sub.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

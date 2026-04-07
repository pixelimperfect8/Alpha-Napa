"use client";

interface SectionEngagementProps {
  sectionEngagement: Record<string, number>;
}

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  "the-problem": "The Problem",
  "why-napa": "Why Napa",
  "who-this-is-for": "Who This Is For",
  "alpha-campuses": "Alpha Campuses",
  community: "Join the Vision",
  footer: "Footer",
};

export default function SectionEngagement({
  sectionEngagement,
}: SectionEngagementProps) {
  const entries = Object.entries(sectionEngagement).sort(
    ([, a], [, b]) => b - a
  );
  const maxCount = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="font-mono text-[0.65rem] tracking-widest uppercase text-[#8A7B66] mb-6">
        Section Engagement
      </h3>
      {entries.length === 0 ? (
        <p className="text-white/30 font-body text-sm">No data yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map(([section, count]) => (
            <div key={section} className="flex items-center gap-4">
              <span className="text-xs font-mono text-white/50 w-32 shrink-0 truncate">
                {SECTION_LABELS[section] || section}
              </span>
              <div className="flex-1 h-6 bg-white/5 rounded overflow-hidden">
                <div
                  className="h-full bg-[#8A7B66] rounded transition-all"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono text-white/40 w-10 text-right">
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

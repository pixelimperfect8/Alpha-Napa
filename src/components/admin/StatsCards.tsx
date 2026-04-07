"use client";

interface StatsCardsProps {
  totalSubmissions: number;
  weekSubmissions: number;
  totalPageViews: number;
  uniqueSessions: number;
  avgTimeOnPage: number;
}

export default function StatsCards({
  totalSubmissions,
  weekSubmissions,
  totalPageViews,
  uniqueSessions,
  avgTimeOnPage,
}: StatsCardsProps) {
  const minutes = Math.floor(avgTimeOnPage / 60);
  const seconds = avgTimeOnPage % 60;
  const timeDisplay = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  const cards = [
    { label: "Total Submissions", value: totalSubmissions },
    { label: "This Week", value: weekSubmissions },
    { label: "Page Views", value: totalPageViews },
    { label: "Unique Sessions", value: uniqueSessions },
    { label: "Avg Time on Page", value: timeDisplay },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="font-mono text-[0.65rem] tracking-widest uppercase text-[#8A7B66] mb-3">
            {card.label}
          </div>
          <div className="text-3xl md:text-4xl font-heading font-semibold">
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}

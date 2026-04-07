"use client";

interface TrafficChartProps {
  dailyChart: { date: string; count: number }[];
}

export default function TrafficChart({ dailyChart }: TrafficChartProps) {
  const maxCount = Math.max(...dailyChart.map((d) => d.count), 1);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="font-mono text-[0.65rem] tracking-widest uppercase text-[#8A7B66] mb-6">
        Page Views &mdash; Last 30 Days
      </h3>
      <div className="flex items-end gap-[3px] h-40">
        {dailyChart.map((day) => {
          const height = Math.max((day.count / maxCount) * 100, 2);
          const date = new Date(day.date + "T00:00:00");
          const label = `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}: ${day.count} views`;

          return (
            <div
              key={day.date}
              className="flex-1 bg-[#8A7B66] rounded-t hover:bg-[#FDFBF7] transition-colors cursor-default"
              style={{ height: `${height}%` }}
              title={label}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-[0.6rem] font-mono text-white/30">
        <span>
          {new Date(dailyChart[0]?.date + "T00:00:00").toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric" }
          )}
        </span>
        <span>
          {new Date(
            dailyChart[dailyChart.length - 1]?.date + "T00:00:00"
          ).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>
    </div>
  );
}

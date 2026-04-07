"use client";

interface ScrollDepthProps {
  scrollDepth: Record<string, number>;
}

export default function ScrollDepth({ scrollDepth }: ScrollDepthProps) {
  const milestones = ["25", "50", "75", "100"];
  const maxCount = Math.max(
    ...milestones.map((m) => scrollDepth[m] || 0),
    1
  );

  const opacityMap: Record<string, string> = {
    "25": "bg-[#8A7B66]/40",
    "50": "bg-[#8A7B66]/60",
    "75": "bg-[#8A7B66]/80",
    "100": "bg-[#8A7B66]",
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="font-mono text-[0.65rem] tracking-widest uppercase text-[#8A7B66] mb-6">
        Scroll Depth
      </h3>
      <div className="flex flex-col gap-3">
        {milestones.map((m) => {
          const count = scrollDepth[m] || 0;
          const width = (count / maxCount) * 100;

          return (
            <div key={m} className="flex items-center gap-4">
              <span className="text-xs font-mono text-white/50 w-10 shrink-0">
                {m}%
              </span>
              <div className="flex-1 h-6 bg-white/5 rounded overflow-hidden">
                <div
                  className={`h-full rounded transition-all ${opacityMap[m]}`}
                  style={{ width: `${Math.max(width, 2)}%` }}
                />
              </div>
              <span className="text-xs font-mono text-white/40 w-10 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

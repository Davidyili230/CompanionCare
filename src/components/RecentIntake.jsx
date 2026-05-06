import { useEffect, useState } from "react";
import { subscribeToRecentLogs } from "../services/reminderService";

const CATEGORY_META = {
  supplement: { icon: "💊", bg: "#fff3ed" },
  walk:       { icon: "🦮", bg: "#edf7f2" },
  vet:        { icon: "🏥", bg: "#eef3fd" },
  grooming:   { icon: "✂️", bg: "#f4eeff" },
  medication: { icon: "💊", bg: "#fff3ed" },
  feeding:    { icon: "🍖", bg: "#fff3e8" },
  other:      { icon: "📋", bg: "#f0f3f6" },
};

function todayDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatRelativeTime(log) {
  const ts = log.completedAt?.toDate?.();
  if (!ts) return "";

  const now = new Date();
  const diff = now - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(diff / 86400000);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  return ts.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-[14px] border border-[#ecdcc8] bg-white px-3 py-2.5">
      <div className="h-8 w-8 shrink-0 rounded-[10px] bg-[#f2ece6]" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-2/3 rounded-full bg-[#f2ece6]" />
        <div className="h-2.5 w-1/3 rounded-full bg-[#f7f2ee]" />
      </div>
      <div className="h-3 w-10 rounded-full bg-[#f7f2ee]" />
    </div>
  );
}

function DayHeader({ label, count }) {
  return (
    <div className="mb-2 flex items-center gap-2 px-0.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9a8a7e]">
        {label}
      </span>
      <div className="flex h-4 min-w-[18px] items-center justify-center rounded-full bg-[#f2ece6] px-1.5 text-[10px] font-bold text-[#b67a5d]">
        {count}
      </div>
      <div className="h-px flex-1 bg-[#f0e9e0]" />
    </div>
  );
}

function LogRow({ log }) {
  const meta =
    CATEGORY_META[log.category] ??
    CATEGORY_META[log.sourceType] ??
    CATEGORY_META.other;

  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-[#ecdcc8] bg-white px-3 py-2.5 transition hover:border-[#de7e52]/30">
      {/* Icon box */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[15px]"
        style={{ background: meta.bg }}
      >
        {meta.icon}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-[#1f1f1f]">
          {log.title}
        </p>
        <div className="mt-0.5 flex items-center gap-1.5">
          {log.petName && (
            <span className="rounded-full bg-[#f7efe7] px-1.5 py-0.5 text-[10px] font-medium text-[#b67a5d]">
              {log.petName}
            </span>
          )}
          {log.frequency && (
            <span className="text-[10px] capitalize text-[#9a8a7e]">
              {log.frequency}
            </span>
          )}
        </div>
      </div>

      {/* Time + badge */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="rounded-full bg-[#e8f5e9] px-2 py-0.5 text-[10px] font-semibold text-[#4caf50]">
          Given ✓
        </span>
        <span className="text-[10px] text-[#b0a49c]">
          {formatRelativeTime(log)}
        </span>
      </div>
    </div>
  );
}

export default function RecentIntake() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub;
    try {
      unsub = subscribeToRecentLogs((data) => {
        setLogs(data);
        setLoading(false);
      }, 20);
    } catch {
      setLoading(false);
    }
    return () => unsub?.();
  }, []);

  // Group logs into "Today" and "Earlier"
  const today = todayDateString();
  const todayLogs = logs.filter((l) => l.scheduledDate === today);
  const earlierLogs = logs.filter((l) => l.scheduledDate !== today);

  const totalCount = logs.length;

  return (
    <div className="mt-5 rounded-[22px] border border-[#ecdcc8] bg-[#fffaf6] px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-[#1f1f1f]">Recent Intake</h3>
        {totalCount > 0 && (
          <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#de7e52] px-2 text-[11px] font-bold text-white">
            {totalCount}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-3 space-y-2">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      )}

      {/* Empty */}
      {!loading && logs.length === 0 && (
        <div className="mt-4 flex min-h-[90px] flex-col items-center justify-center rounded-[14px] border border-dashed border-[#e7cdbd] bg-white px-5 py-4 text-center">
          <span className="text-[22px]">📋</span>
          <p className="mt-1.5 text-[12px] leading-5 text-[#8a786c]">
            Check off reminders in Today's section to log them here.
          </p>
        </div>
      )}

      {/* Groups */}
      {!loading && logs.length > 0 && (
        <div className="mt-3 space-y-4">
          {todayLogs.length > 0 && (
            <div>
              <DayHeader label="Today" count={todayLogs.length} />
              <div className="space-y-2">
                {todayLogs.map((log) => (
                  <LogRow key={log.id} log={log} />
                ))}
              </div>
            </div>
          )}

          {earlierLogs.length > 0 && (
            <div>
              <DayHeader label="Earlier" count={earlierLogs.length} />
              <div className="space-y-2">
                {earlierLogs.map((log) => (
                  <LogRow key={log.id} log={log} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

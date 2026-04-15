import { useState } from "react";

const MOCK_REMINDERS = [
  {
    id: "1",
    title: "Omega-3 Fish Oil",
    type: "supplement",
    petName: "Max",
    petInitial: "M",
    dueTime: "8:00 AM",
    notes: "Give with food",
    completed: false,
  },
  {
    id: "2",
    title: "Annual Vet Checkup",
    type: "vet",
    petName: "Luna",
    petInitial: "L",
    dueTime: "2:30 PM",
    notes: "Bring vaccination records",
    completed: false,
  },
  {
    id: "3",
    title: "Flea & Tick Treatment",
    type: "medication",
    petName: "Max",
    petInitial: "M",
    dueTime: "6:00 PM",
    notes: "",
    completed: true,
  },
];

const TYPE_CONFIG = {
  supplement: { label: "Supplement", color: "#d87c5a", bg: "#fff3ee", icon: "💊" },
  vet: { label: "Vet Visit", color: "#5a8fd8", bg: "#eef3ff", icon: "🏥" },
  medication: { label: "Medication", color: "#7c5ad8", bg: "#f3eeff", icon: "💉" },
  grooming: { label: "Grooming", color: "#5ab87c", bg: "#eefff3", icon: "✂️" },
  custom: { label: "Custom", color: "#9a9a9a", bg: "#f5f5f5", icon: "📌" },
};

function ReminderCard({ reminder, onToggle }) {
  const cfg = TYPE_CONFIG[reminder.type] || TYPE_CONFIG.custom;

  return (
    <div
      className={[
        "flex items-start gap-3 rounded-2xl border p-4 transition-all",
        reminder.completed
          ? "border-[#e8e0d8] bg-[#faf7f4] opacity-60"
          : "border-[#ecdcc8] bg-white shadow-sm",
      ].join(" ")}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(reminder.id)}
        className={[
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
          reminder.completed
            ? "border-[#d87c5a] bg-[#d87c5a]"
            : "border-[#ecdcc8] hover:border-[#d87c5a]",
        ].join(" ")}
      >
        {reminder.completed && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={[
              "text-[15px] font-semibold",
              reminder.completed ? "line-through text-[#9a9490]" : "text-[#1f1f1f]",
            ].join(" ")}
          >
            {reminder.title}
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{ color: cfg.color, backgroundColor: cfg.bg }}
          >
            {cfg.icon} {cfg.label}
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[#5f5a55]">
          <span className="flex items-center gap-1">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f7e9df] text-[9px] font-bold text-[#d87c5a]">
              {reminder.petInitial}
            </span>
            {reminder.petName}
          </span>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#9a9490" strokeWidth="1.2" />
              <path d="M6 3v3l2 1.5" stroke="#9a9490" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {reminder.dueTime}
          </span>
        </div>

        {reminder.notes && (
          <p className="mt-1.5 text-xs text-[#9a9490]">{reminder.notes}</p>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [reminders, setReminders] = useState(MOCK_REMINDERS);

  function toggleReminder(id) {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  }

  const pendingCount = reminders.filter((r) => !r.completed).length;

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1f1f1f]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#5f5a55]">
          Here's what's on the schedule for your pets today.
        </p>
      </div>

      {/* Today's Reminders section */}
      <section className="rounded-3xl border border-[#ecdcc8] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-[#1f1f1f]">Today's Reminders</h2>
            <p className="mt-0.5 text-xs text-[#9a9490]">
              {pendingCount === 0
                ? "All done for today!"
                : `${pendingCount} task${pendingCount > 1 ? "s" : ""} remaining`}
            </p>
          </div>
          <span className="rounded-full bg-[#fff3ee] px-3 py-1 text-sm font-semibold text-[#d87c5a]">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        <div className="space-y-3">
          {reminders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#ecdcc8] py-12 text-center">
              <span className="text-4xl">🐾</span>
              <p className="mt-3 font-semibold text-[#1f1f1f]">No reminders today</p>
              <p className="mt-1 text-sm text-[#9a9490]">Your pets are all caught up!</p>
            </div>
          ) : (
            reminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onToggle={toggleReminder}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

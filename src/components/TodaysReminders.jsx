import { useEffect, useRef, useState } from "react";
import {
  completeReminder,
  deleteReminder,
  subscribeToAllSupplements,
  subscribeToCustomReminders,
  subscribeToTodayLogs,
  uncompleteReminder,
} from "../services/reminderService";
import CreateReminderModal from "./CreateReminderModal";

const CATEGORY_META = {
  supplement: { icon: "💊", color: "#de7e52", bg: "#fff3ed" },
  walk:       { icon: "🦮", color: "#4a9f6e", bg: "#edf7f2" },
  vet:        { icon: "🏥", color: "#5b8dd9", bg: "#eef3fd" },
  grooming:   { icon: "✂️", color: "#9b6dd4", bg: "#f4eeff" },
  medication: { icon: "💊", color: "#de7e52", bg: "#fff3ed" },
  feeding:    { icon: "🍖", color: "#c87941", bg: "#fff3e8" },
  other:      { icon: "📋", color: "#7a8b9c", bg: "#f0f3f6" },
};

function timeToMinutes(timeStr) {
  if (!timeStr) return Infinity;
  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  }
  const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (match) {
    let h = parseInt(match[1]);
    const m = parseInt(match[2]);
    if (match[3].toUpperCase() === "PM" && h !== 12) h += 12;
    if (match[3].toUpperCase() === "AM" && h === 12) h = 0;
    return h * 60 + m;
  }
  return Infinity;
}

function formatTime(timeOfDay) {
  if (!timeOfDay) return null;
  if (/^\d{2}:\d{2}$/.test(timeOfDay)) {
    const [h, m] = timeOfDay.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
  }
  return timeOfDay;
}

function getTodayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function isOverdue(timeOfDay) {
  const mins = timeToMinutes(timeOfDay);
  if (mins === Infinity) return false;
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes() > mins;
}

/* ── Skeleton ── */
function SkeletonItem() {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-[14px] border border-[#ecdcc8] bg-white px-4 py-3">
      <div className="h-8 w-8 shrink-0 rounded-[10px] bg-[#f2ece6]" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-3/5 rounded-full bg-[#f2ece6]" />
        <div className="h-2.5 w-1/3 rounded-full bg-[#f7f2ee]" />
      </div>
      <div className="h-6 w-6 shrink-0 rounded-full bg-[#f2ece6]" />
    </div>
  );
}

/* ── Progress bar ── */
function ProgressBar({ done, total }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const allDone = done === total && total > 0;
  return (
    <div className="mb-4 mt-3">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[12px] font-medium text-[#8a786c]">
          {done} of {total} completed today
        </span>
        <span
          className={`text-[12px] font-bold ${
            allDone ? "text-[#4caf50]" : "text-[#de7e52]"
          }`}
        >
          {pct}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#f2ece6]">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            allDone ? "bg-[#4caf50]" : "bg-[#de7e52]"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ── All-done celebration ── */
function AllDoneState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f5e9] text-[32px]">
        🎉
      </div>
      <p className="mt-3 text-[16px] font-bold text-[#1f1f1f]">
        All done for today!
      </p>
      <p className="mt-1.5 max-w-[220px] text-[13px] leading-5 text-[#7b6e65]">
        Great job taking care of your pet. Check back tomorrow.
      </p>
    </div>
  );
}

/* ── Single reminder row ── */
function ReminderItem({ item, isComplete, logId, onComplete, onUncomplete }) {
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleToggle() {
    if (busy) return;
    setBusy(true);
    try {
      if (isComplete) await onUncomplete(logId);
      else await onComplete(item);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await deleteReminder(item.id);
    } finally {
      setBusy(false);
      setConfirmDelete(false);
    }
  }

  const timeLabel = formatTime(item.timeOfDay);
  const overdue = !isComplete && isOverdue(item.timeOfDay);
  const meta = CATEGORY_META[item.category] ?? CATEGORY_META.other;

  return (
    <div
      className={`flex items-start gap-3 rounded-[14px] border px-4 py-3 transition-all duration-200 ${
        isComplete
          ? "border-[#e7e0d9] bg-[#f9f6f2] opacity-60"
          : overdue
          ? "border-[#f4c4a8] bg-[#fffaf7] hover:border-[#de7e52]/50"
          : "border-[#ecdcc8] bg-white hover:border-[#de7e52]/40 hover:shadow-[0_1px_6px_rgba(222,126,82,0.08)]"
      }`}
    >
      {/* Category icon box */}
      <div
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[16px]"
        style={{ background: meta.bg }}
      >
        {meta.icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`text-[14px] font-semibold leading-snug ${
              isComplete
                ? "text-[#9a8a7e] line-through decoration-[#b8aca4]"
                : "text-[#1f1f1f]"
            }`}
          >
            {item.title}
          </span>
          {item.petName && (
            <span className="rounded-full bg-[#f7efe7] px-2 py-0.5 text-[11px] font-medium text-[#b67a5d]">
              {item.petName}
            </span>
          )}
          {overdue && (
            <span className="rounded-full bg-[#fde9dd] px-2 py-0.5 text-[11px] font-semibold text-[#c1622f]">
              Overdue
            </span>
          )}
          {isComplete && (
            <span className="rounded-full bg-[#e8f5e9] px-2 py-0.5 text-[11px] font-semibold text-[#4caf50]">
              Done ✓
            </span>
          )}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          {timeLabel && (
            <span
              className={`text-[12px] ${
                overdue
                  ? "font-semibold text-[#c1622f]"
                  : "text-[#8a786c]"
              }`}
            >
              {timeLabel}
            </span>
          )}
          {!timeLabel && !item.frequency && (
            <span className="text-[12px] text-[#b0a49c]">Anytime</span>
          )}
          {item.frequency && (
            <span className="rounded-full bg-[#f2ece6] px-2 py-0.5 text-[11px] font-medium capitalize text-[#7b6e65]">
              {item.frequency}
            </span>
          )}
          {item.notes && !isComplete && (
            <span className="max-w-[180px] truncate text-[11px] italic text-[#9a8a7e]">
              {item.notes}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Inline delete confirm (custom reminders only) */}
        {item.sourceType === "custom" && !isComplete && (
          <div className="flex items-center">
            {confirmDelete ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={busy}
                  className="rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-full bg-[#f2ece6] px-2.5 py-1 text-[11px] font-semibold text-[#7b6e65] transition hover:bg-[#ecdcc8]"
                >
                  Keep
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-[#d0c5bd] transition hover:bg-red-50 hover:text-red-400"
                title="Remove reminder"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M1 1L9 9M9 1L1 9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Checkbox */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={busy}
          title={isComplete ? "Mark as pending" : "Mark as done"}
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200 ${
            isComplete
              ? "border-[#de7e52] bg-[#de7e52]"
              : "border-[#d0c5bd] bg-white hover:border-[#de7e52] hover:shadow-[0_0_0_3px_rgba(222,126,82,0.12)]"
          } ${busy ? "opacity-50" : ""}`}
        >
          {busy && !isComplete ? (
            <div className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-[#de7e52] border-t-transparent" />
          ) : isComplete ? (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </button>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function TodaysReminders({ pets = [] }) {
  const [supplements, setSupplements] = useState([]);
  const [customReminders, setCustomReminders] = useState([]);
  const [todayLogs, setTodayLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const firedRef = useRef([false, false, false]);
  function markLoaded(i) {
    if (!firedRef.current[i]) {
      firedRef.current[i] = true;
      setLoadedCount((c) => c + 1);
    }
  }

  useEffect(() => {
    try {
      const u1 = subscribeToAllSupplements((d) => { setSupplements(d); markLoaded(0); });
      const u2 = subscribeToCustomReminders((d) => { setCustomReminders(d); markLoaded(1); });
      const u3 = subscribeToTodayLogs((d) => { setTodayLogs(d); markLoaded(2); });
      return () => { u1(); u2(); u3(); };
    } catch {
      setLoadedCount(3);
    }
  }, []);

  const isLoading = loadedCount < 3;

  const supplementItems = supplements
    .filter((s) => s.name)
    .map((s) => {
      const pet = pets.find((p) => p.id === s.petId);
      const dosageStr = s.dosage
        ? `${s.dosage}${s.unit ? " " + s.unit : ""}`
        : "";
      return {
        id: s.id,
        sourceType: "supplement",
        sourceId: s.id,
        title: s.name + (dosageStr ? ` — ${dosageStr}` : ""),
        supplementName: s.name,
        dosage: dosageStr,
        category: "supplement",
        petId: s.petId,
        petName: pet?.name ?? "",
        frequency: s.frequency,
        timeOfDay: s.timeOfDay,
        notes: s.notes,
      };
    });

  const customItems = customReminders.map((r) => ({
    id: r.id,
    sourceType: "custom",
    sourceId: r.id,
    title: r.title,
    category: r.category,
    petId: r.petId,
    petName: r.petName ?? "",
    frequency: r.frequency,
    timeOfDay: r.timeOfDay,
    notes: r.notes,
  }));

  const allItems = [...supplementItems, ...customItems].sort(
    (a, b) => timeToMinutes(a.timeOfDay) - timeToMinutes(b.timeOfDay)
  );

  const completedMap = {};
  todayLogs.forEach((log) => {
    completedMap[log.sourceId] = log.id;
  });

  const pending = allItems.filter((item) => !completedMap[item.sourceId]);
  const completed = allItems.filter((item) => !!completedMap[item.sourceId]);
  const allDone = !isLoading && allItems.length > 0 && pending.length === 0;

  async function handleComplete(item) {
    await completeReminder({
      sourceType: item.sourceType,
      sourceId: item.sourceId,
      petId: item.petId,
      petName: item.petName,
      title: item.title,
      frequency: item.frequency,
      category: item.category,
      supplementName: item.supplementName,
      dosage: item.dosage,
    });
  }

  return (
    <>
      <section className="rounded-[28px] border border-[#ecdcc8] bg-white px-5 py-5 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[20px] font-bold text-[#1f1f1f]">
              Today's Reminders
            </h2>
            <p className="mt-0.5 text-[12px] text-[#9a8a7e]">
              {getTodayLabel()}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="shrink-0 rounded-full bg-[#de7e52] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#cf7045]"
          >
            + Add Reminder
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="mt-4 space-y-2">
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
          </div>
        )}

        {/* Empty */}
        {!isLoading && allItems.length === 0 && (
          <div className="mt-5 flex min-h-[180px] flex-col items-center justify-center rounded-[22px] border border-dashed border-[#e7cdbd] bg-[#fffaf6] px-6 text-center">
            <span className="text-[36px]">🐾</span>
            <p className="mt-2 text-[15px] font-semibold text-[#1f1f1f]">
              No reminders yet
            </p>
            <p className="mt-1 max-w-[240px] text-[12px] leading-5 text-[#7b6e65]">
              Add supplements in My Pet, or create a custom reminder below.
            </p>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-4 rounded-full bg-[#de7e52] px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#cf7045]"
            >
              + Create Reminder
            </button>
          </div>
        )}

        {/* List */}
        {!isLoading && allItems.length > 0 && (
          <>
            <ProgressBar done={completed.length} total={allItems.length} />

            {allDone ? (
              <AllDoneState />
            ) : (
              <div className="space-y-2">
                {pending.map((item) => (
                  <ReminderItem
                    key={item.id}
                    item={item}
                    isComplete={false}
                    logId={null}
                    onComplete={handleComplete}
                    onUncomplete={uncompleteReminder}
                  />
                ))}
              </div>
            )}

            {/* Completed section */}
            {completed.length > 0 && (
              <div className="mt-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#f0e9e0]" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b0a49c]">
                    Completed · {completed.length}
                  </span>
                  <div className="h-px flex-1 bg-[#f0e9e0]" />
                </div>
                <div className="space-y-2">
                  {completed.map((item) => (
                    <ReminderItem
                      key={item.id}
                      item={item}
                      isComplete={true}
                      logId={completedMap[item.sourceId]}
                      onComplete={handleComplete}
                      onUncomplete={uncompleteReminder}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {showModal && (
        <CreateReminderModal
          pets={pets}
          onClose={() => setShowModal(false)}
          onSaved={() => setShowModal(false)}
        />
      )}
    </>
  );
}

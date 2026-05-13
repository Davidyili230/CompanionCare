import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase.js";

function getCurrentUid() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("User is not signed in.");
  return uid;
}

const remindersCol = collection(db, "reminders");
const reminderLogsCol = collection(db, "reminderLogs");
const supplementsCol = collection(db, "supplements");

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* ---- subscriptions ---- */

export function subscribeToAllSupplements(callback) {
  const uid = getCurrentUid();
  const q = query(supplementsCol, where("ownerUid", "==", uid));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          petId: data.petId ?? "",
          ownerUid: data.ownerUid ?? "",
          name: data.name ?? "",
          brand: data.brand ?? "",
          dosage: data.dosage ?? "",
          unit: data.unit ?? "",
          frequency: data.frequency ?? "",
          timeOfDay: data.timeOfDay ?? "",
          startDate: data.startDate ?? "",
          notes: data.notes ?? "",
        };
      });
      callback(list);
    },
    (err) => console.error("subscribeToAllSupplements:", err)
  );
}

export function subscribeToCustomReminders(callback) {
  const uid = getCurrentUid();
  const q = query(
    remindersCol,
    where("ownerUid", "==", uid),
    where("isActive", "==", true)
  );
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => {
        const at = a.createdAt?.seconds ?? 0;
        const bt = b.createdAt?.seconds ?? 0;
        return at - bt;
      });
      callback(list);
    },
    (err) => console.error("subscribeToCustomReminders:", err)
  );
}

export function subscribeToTodayLogs(callback) {
  const uid = getCurrentUid();
  const q = query(
    reminderLogsCol,
    where("ownerUid", "==", uid),
    where("scheduledDate", "==", todayString())
  );
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    },
    (err) => console.error("subscribeToTodayLogs:", err)
  );
}

export function subscribeToRecentLogs(callback, count = 20) {
  const uid = getCurrentUid();
  // No orderBy — avoids needing a composite index that may not be deployed.
  // We sort client-side instead.
  const q = query(
    reminderLogsCol,
    where("ownerUid", "==", uid),
    limit(count * 3)
  );
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => {
        const at = a.completedAt?.seconds ?? 0;
        const bt = b.completedAt?.seconds ?? 0;
        return bt - at;
      });
      callback(list.slice(0, count));
    },
    (err) => console.error("subscribeToRecentLogs:", err)
  );
}

/* ---- mutations ---- */

export async function completeReminder({
  sourceType,
  sourceId,
  petId,
  petName,
  title,
  frequency,
  category,
  supplementName,
  dosage,
}) {
  const uid = getCurrentUid();
  if (!sourceType || !sourceId) {
    throw new Error("completeReminder requires sourceType and sourceId.");
  }
  const now = new Date();

  // Mirror supplements to supplementHistory first, so we can store the
  // resulting doc id on the log for cascade-delete on uncomplete.
  let historyDocId = null;
  if (sourceType === "supplement") {
    const histRef = await addDoc(collection(db, "supplementHistory"), {
      pet: petName || "",
      supplement: supplementName || title,
      dosage: dosage || "",
      scheduled: frequency || "",
      status: "Given",
      dateTime: now.toISOString(),
    });
    historyDocId = histRef.id;
  }

  await addDoc(reminderLogsCol, {
    ownerUid: uid,
    petId: petId || null,
    petName: petName || null,
    sourceType,
    sourceId,
    title: title || "",
    category: category || sourceType || "other",
    frequency: frequency || "",
    scheduledDate: todayString(),
    completedAt: serverTimestamp(),
    historyDocId,
  });

  // One-time custom reminders disappear after completion; the matching log
  // keeps them visible in the "Completed" section for the rest of the day.
  if (sourceType === "custom" && frequency === "once") {
    try {
      await updateDoc(doc(db, "reminders", sourceId), { isActive: false });
    } catch (err) {
      console.error("Failed to deactivate one-time reminder:", err);
    }
  }
}

export async function uncompleteReminder(logId) {
  const logRef = doc(db, "reminderLogs", logId);
  let logData = null;
  try {
    const snap = await getDoc(logRef);
    if (snap.exists()) logData = snap.data();
  } catch (err) {
    console.error("Failed to read reminderLog for uncomplete:", err);
  }

  if (logData?.historyDocId) {
    try {
      await deleteDoc(doc(db, "supplementHistory", logData.historyDocId));
    } catch (err) {
      console.error("Failed to delete supplementHistory mirror:", err);
    }
  }

  // Reactivate a one-time custom reminder that was auto-deactivated on
  // completion. Other custom reminders are already active — this is a no-op.
  if (
    logData?.sourceType === "custom" &&
    logData?.sourceId &&
    logData?.frequency === "once"
  ) {
    try {
      await updateDoc(doc(db, "reminders", logData.sourceId), {
        isActive: true,
      });
    } catch {
      // Reminder may have been hard-deleted; ignore.
    }
  }

  await deleteDoc(logRef);
}

export async function saveReminder(reminder) {
  const uid = getCurrentUid();
  const id =
    reminder.id ||
    (typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now()));

  const payload = {
    ownerUid: uid,
    petId: reminder.petId || null,
    petName: reminder.petName || null,
    title: reminder.title?.trim() || "",
    category: reminder.category || "other",
    frequency: reminder.frequency || "daily",
    date: reminder.date?.trim() || "",
    timeOfDay: reminder.timeOfDay?.trim() || "",
    notes: reminder.notes?.trim() || "",
    isActive: true,
    updatedAt: serverTimestamp(),
  };

  if (!reminder.id) payload.createdAt = serverTimestamp();

  await setDoc(doc(db, "reminders", id), payload, { merge: true });
  return id;
}

export async function deleteReminder(reminderId) {
  await updateDoc(doc(db, "reminders", reminderId), { isActive: false });
}

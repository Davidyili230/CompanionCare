import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
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
  const now = new Date();

  await addDoc(reminderLogsCol, {
    ownerUid: uid,
    petId: petId || null,
    petName: petName || null,
    sourceType,
    sourceId,
    title,
    category: category || sourceType || "other",
    frequency: frequency || "",
    scheduledDate: todayString(),
    completedAt: serverTimestamp(),
  });

  // Mirror to supplementHistory so the /history page reflects completions.
  if (sourceType === "supplement") {
    await addDoc(collection(db, "supplementHistory"), {
      pet: petName || "",
      supplement: supplementName || title,
      dosage: dosage || "",
      scheduled: frequency || "",
      status: "Given",
      dateTime: now.toISOString(),
    });
  }
}

export async function uncompleteReminder(logId) {
  await deleteDoc(doc(db, "reminderLogs", logId));
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

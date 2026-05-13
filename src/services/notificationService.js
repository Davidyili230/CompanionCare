const STORAGE_KEY = "companion_care_notified_reminders";
const ENABLED_KEY = "companion_care_notifications_enabled";
const ICON = "/Logo.PNG";

export function getNotificationsEnabled() {
  try {
    return localStorage.getItem(ENABLED_KEY) === "1";
  } catch {
    return false;
  }
}

export function setNotificationsEnabled(enabled) {
  try {
    if (enabled) localStorage.setItem(ENABLED_KEY, "1");
    else localStorage.removeItem(ENABLED_KEY);
  } catch {
    // storage unavailable; non-fatal
  }
}

export function isNotificationSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission() {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

export function showReminderNotification({ title, body, tag }) {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, tag, icon: ICON });
  } catch (err) {
    console.error("Failed to show notification:", err);
  }
}

function loadNotifiedMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveNotifiedMap(map) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // storage may be full or unavailable; non-fatal
  }
}

export function hasNotifiedToday(dateStr, key) {
  const map = loadNotifiedMap();
  return map.date === dateStr && Array.isArray(map.keys) && map.keys.includes(key);
}

export function markNotifiedToday(dateStr, key) {
  const map = loadNotifiedMap();
  if (map.date !== dateStr) {
    saveNotifiedMap({ date: dateStr, keys: [key] });
    return;
  }
  const keys = Array.isArray(map.keys) ? map.keys : [];
  if (!keys.includes(key)) {
    keys.push(key);
    saveNotifiedMap({ date: dateStr, keys });
  }
}

import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
  deleteDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadString,
  deleteObject,
} from "firebase/storage";
import { auth, db, storage } from "../firebase.js";

function getCurrentUid() {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("User is not signed in.");
  }

  return uid;
}

const petsCollection = collection(db, "pets");
const supplementsCollection = collection(db, "supplements");

async function uploadPetAvatar(uid, petId, imageDataUrl) {
  if (!imageDataUrl || !imageDataUrl.startsWith("data:")) {
    return "";
  }

  const avatarRef = ref(storage, `pets/${petId}/avatar`);
  await uploadString(avatarRef, imageDataUrl, "data_url");
  return await getDownloadURL(avatarRef);
}

/* ---------------- PET ---------------- */

export function subscribeToPets(callback) {
  const uid = getCurrentUid();

  const q = query(petsCollection, where("ownerUid", "==", uid));

  return onSnapshot(
    q,
    (snapshot) => {
      const pets = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
          id: docSnap.id,
          name: data.name ?? "",
          species: data.species ?? "",
          breed: data.breed ?? "",
          weight: data.weight ?? "",
          unit: data.unit ?? "lb",
          age: data.age ?? "",
          birthDate: data.birthDate ?? "",
          healthConditions: data.healthConditions ?? "",
          image: data.imageUrl ?? "",
          imageUrl: data.imageUrl ?? "",
          ownerUid: data.ownerUid ?? "",
          createdAt: data.createdAt ?? null,
        };
      });

      // Perform sorting locally on the frontend to avoid Firestore composite index errors.
      pets.sort((a, b) => {
        const aTime = a.createdAt?.seconds ?? 0;
        const bTime = b.createdAt?.seconds ?? 0;
        return bTime - aTime;
      });

      callback(pets);
    },
    (error) => {
      console.error("subscribeToPets error:", error);
    }
  );
}

export async function savePet(pet) {
  const uid = getCurrentUid();

  const petId =
    pet.id ||
    (typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now()));

  let imageUrl = pet.imageUrl || "";

  if (pet.image?.startsWith("data:")) {
    imageUrl = await uploadPetAvatar(uid, petId, pet.image);
  }

  const payload = {
    name: pet.name?.trim() || "",
    species: pet.species || "",
    breed: pet.breed || "",
    weight: pet.weight === "" ? null : Number(pet.weight),
    unit: pet.unit || "lb",
    age: pet.age === "" ? null : Number(pet.age),
    birthDate: pet.birthDate || "",
    healthConditions: pet.healthConditions?.trim() || "",
    imageUrl,
    ownerUid: uid,
    updatedAt: serverTimestamp(),
  };

  if (!pet.id) {
    payload.createdAt = serverTimestamp();
  }

  await setDoc(doc(db, "pets", petId), payload, {
    merge: true,
  });

  return petId;
}

export async function deletePet(petId) {
  const uid = getCurrentUid();

  // 1. First, find the supplements corresponding to this pet.
  const supplementsQuery = query(
    supplementsCollection,
    where("ownerUid", "==", uid),
    where("petId", "==", petId)
  );

  const supplementSnapshot = await getDocs(supplementsQuery);

  // 2. Batch Delete: Supplements + Pets
  const batch = writeBatch(db);

  supplementSnapshot.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  batch.delete(doc(db, "pets", petId));

  await batch.commit();

  // 3. Try deleting your avatar (it's fine if you don't have one).
  try {
    const avatarRef = ref(storage, `pets/${petId}/avatar`);
    await deleteObject(avatarRef);
  } catch (error) {
    console.log("No avatar to delete or delete avatar failed:", error.message);
  }
}

/* ---------------- SUPPLEMENT ---------------- */

export function subscribeToSupplements(petId, callback) {
  const uid = getCurrentUid();

  if (!petId) {
    callback([]);
    return () => {};
  }

  const q = query(
    supplementsCollection,
    where("ownerUid", "==", uid),
    where("petId", "==", petId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const supplements = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
          id: docSnap.id,
          petId: data.petId ?? "",
          ownerUid: data.ownerUid ?? "",
          name: data.name ?? "",
          brand: data.brand ?? "",
          dosage: data.dosage ?? "",
          frequency: data.frequency ?? "",
          notes: data.notes ?? "",
          createdAt: data.createdAt ?? null,
        };
      });

      supplements.sort((a, b) => {
        const aTime = a.createdAt?.seconds ?? 0;
        const bTime = b.createdAt?.seconds ?? 0;
        return bTime - aTime;
      });

      callback(supplements);
    },
    (error) => {
      console.error("subscribeToSupplements error:", error);
    }
  );
}

export async function saveSupplement(petId, supplement) {
  const uid = getCurrentUid();

  if (!petId) {
    throw new Error("petId is required.");
  }

  const supplementId =
    supplement.id ||
    (typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now()));

  const payload = {
    petId,
    ownerUid: uid,
    name: supplement.name?.trim() || "",
    brand: supplement.brand?.trim() || "",
    dosage: supplement.dosage?.trim() || "",
    frequency: supplement.frequency?.trim() || "",
    notes: supplement.notes?.trim() || "",
    updatedAt: serverTimestamp(),
  };

  if (!supplement.id) {
    payload.createdAt = serverTimestamp();
  }

  await setDoc(doc(db, "supplements", supplementId), payload, {
    merge: true,
  });

  return supplementId;
}

export async function deleteSupplement(supplementId) {
  await deleteDoc(doc(db, "supplements", supplementId));
}
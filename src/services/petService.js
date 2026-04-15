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
import { auth, db } from "../firebase.js";
import { uploadPetAvatarToCloudinary } from "./PetCloudinary";

function getCurrentUid() {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("User is not signed in.");
  }

  return uid;
}

const petsCollection = collection(db, "pets");
const supplementsCollection = collection(db, "supplements");

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
          imagePublicId: data.imagePublicId ?? "",
          ownerUid: data.ownerUid ?? "",
          createdAt: data.createdAt ?? null,
        };
      });

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
  let imagePublicId = pet.imagePublicId || "";

  if (pet.image?.startsWith("data:")) {
    const uploadResult = await uploadPetAvatarToCloudinary(uid, petId, pet.image);
    imageUrl = uploadResult.url;
    imagePublicId = uploadResult.publicId;
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
    imagePublicId,
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

  const supplementsQuery = query(
    supplementsCollection,
    where("ownerUid", "==", uid),
    where("petId", "==", petId)
  );

  const supplementSnapshot = await getDocs(supplementsQuery);

  const batch = writeBatch(db);

  supplementSnapshot.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  batch.delete(doc(db, "pets", petId));

  await batch.commit();
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
    unit: supplement.unit?.trim() || "",
    frequency: supplement.frequency?.trim() || "",
    timeOfDay: supplement.timeOfDay?.trim() || "",
    startDate: supplement.startDate?.trim() || "",
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
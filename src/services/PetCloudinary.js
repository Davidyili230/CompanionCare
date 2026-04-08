export async function uploadPetAvatarToCloudinary(uid, petId, imageDataUrl) {
  if (!imageDataUrl || !imageDataUrl.startsWith("data:")) {
    return {
      url: "",
      publicId: "",
    };
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary environment variables.");
  }

  const formData = new FormData();
  formData.append("file", imageDataUrl);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", `companioncare/pets/${uid}`);
  formData.append("public_id", `pet_${petId}_avatar`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Cloudinary upload failed.");
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}

import { db, storage } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 } from 'uuid'

export async function submitReport(formData) {
    const auth = getAuth();
    const user = auth.currentUser;

    if(user == null) {
        console.log("User is not signed in or trouble getting user auth");
        return;
    }

    try {
        let imageUrl = "";

        if (formData.imageFile) {
            const imageRef = ref(storage, `lostPets/${formData.petName + v4()}`);
            await uploadBytes(imageRef, formData.imageFile);
            imageUrl = await getDownloadURL(imageRef);
        }

        const data = {
            ...formData,
            userId: user.uid,
            image: imageUrl,
        };

        delete data.imageFile;

        await addDoc(collection(db, "lostPetReports"), data);
        console.log("Report was submitted");
    } catch (error) {
        console.error("There is an error submitting the report: ", error)
    }
}
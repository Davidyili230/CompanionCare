import { db } from "../../firebase/firebase";
import { deleteDoc, doc} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";


export async function deleteReport(id, imageUrl) {
    try {
        const report = doc(db, "AdoptionPetReports", id);
        await deleteDoc(report)

        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef)

        console.log("Report was deleted");
    } catch (error) {
        console.log("Failed to delete a report", error);
    }
}


import { db } from "../firebase/firebase";
import { deleteDoc, doc} from "firebase/firestore";


export async function deleteReport(id) {
    try {
        const report = doc(db, "lostPetReports", id);
        await deleteDoc(report)
        console.log("Report was deleted");
    } catch (error) {
        console.log("Failed to delte a report", error);
    }
}
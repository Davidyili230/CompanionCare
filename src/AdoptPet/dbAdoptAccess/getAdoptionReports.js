
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";

export async function getAllAdoptionReports() {
    try {
        const res = await getDocs(collection(db, "AdoptionPetReports"));
        const reports = res.docs.map(r => ({
            id: r.id,
            ...r.data()
        }));

        console.log("All pet adoption reports:", reports);

        const defaultRes = await getDocs(collection(db, "defaultAdoptionReports"));
        const defaultReports = defaultRes.docs.map(r => ({
            id: r.id,
            ...r.data()
        }))

        console.log("All the default adoption reports:", defaultReports);
        return [...reports, ...defaultReports];
    } catch(error) {
        console.log("There was an error getting all adoption reports: ", error)
        return [];
    }
}


export async function getUserAdoptionReport() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user == null) {
        console.log("User is not signed in");
        return ;
    }

    try {
        const res = query (
            collection(db, "AdoptionPetReports"),
            where("userId", "==", user.uid)
        )

        const r = await getDocs(res);
        const reports = r.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("Just the current user report", reports)
        return reports;
    } catch (error) {
        console.log ("Error getting user reports: ", error);
        return [];
    }
}
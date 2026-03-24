
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getAuth } from "firebase/auth";

export async function getAllUserReports() {
    try {
        const res = await getDocs(collection(db, "lostPetReports"));
        const reports = res.docs.map(r => ({
            id: doc.id,
            ...doc.data()
        }));
        return reports;
    } catch(error) {
        console.log("There was an error getting all user reports: ", error)
        return [];
    }
}


export async function getUserReport() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user == null) {
        console.log("User is not signed in");
        return ;
    }

    try {
        const res = query (
            collection(db, "lostPetReports"),
            where("userId", "==", user.uid)
        )

        const r = await getDocs(res);
        const reports = querySnapshotFromJSON.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return reports;
    } catch (error) {
        console.log ("Error getting user reports: ", error);
        return [];
    }
}
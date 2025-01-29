import type { Auth } from "firebase/auth";
import {
  doc,
  collection,
  addDoc,
  Timestamp,
  Firestore,
  getDocs,
  query,
  orderBy,
  writeBatch,
} from "firebase/firestore";

export const useKickStore = () => {
  const { $auth, $firestore } = useNuxtApp(); // Get Firebase instances
  const auth = $auth as Auth;
  const firestore = $firestore as Firestore;

  const addKick = async (): Promise<Kick | null> => {
    const user = auth.currentUser; // Get the logged-in user

    if (!user) throw new Error("User not logged in");

    const userId = user.uid;
    const kicksRef = collection(doc(firestore, "users", userId), "kicks"); // Path: users/{userId}/kicks

    try {
      const timestamp = Timestamp.now();
      await addDoc(kicksRef, {
        date: timestamp, // Add the current timestamp
      });
      console.log("Kick recorded successfully");
      // FIXME add other attributes
      return { date: timestamp.toDate() };
    } catch (error) {
      console.error("Error recording kick: ", error);
      return null;
    }
  };

  const uploadKicksToFirestore = async (localKicks: Array<Kick>) => {
    if (!Array.isArray(localKicks)) {
      console.error("localKicks must be an array.");
      return;
    }

    const user = auth.currentUser; // Get the logged-in user

    if (!user) throw new Error("User not logged in");

    const userId = user.uid;

    const userKicksCollection = collection(firestore, `users/${userId}/kicks`);
    const batch = writeBatch(firestore);

    localKicks.forEach((kick) => {
      // Convert localStorage date string to Firestore Timestamp
      const date = new Date(kick.date);
      const kickDoc = doc(userKicksCollection); // Create a new document in kicks collection
      batch.set(kickDoc, { date: Timestamp.fromDate(date) });
    });

    // Commit the batch
    await batch.commit();
    console.log("Kicks successfully uploaded to Firestore!");
  };

  const getKicks = async (): Promise<Kick[]> => {
    const user = auth.currentUser; // Get the logged-in user

    if (!user) throw new Error("User not logged in");

    const userId = user.uid;
    const kicksRef = collection(doc(firestore, "users", userId), "kicks"); // Path: users/{userId}/kicks

    try {
      const q = query(kicksRef, orderBy("date", "desc")); // Sort by date
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const data = doc.data();

        // Convert the 'date' field from Firestore Timestamp to JavaScript Date
        if (data.date instanceof Timestamp) {
          data.date = data.date.toDate();
        }

        // TODO validate all fields match as per Kick interface
        return data as Kick;
      });
    } catch (error) {
      console.error("Error fetching kicks: ", error);
      return [];
    }
  };

  return {
    addKick,
    getKicks,
    uploadKicksToFirestore,
  };
};

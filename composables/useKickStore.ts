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
} from "firebase/firestore";

export const useKickStore = () => {
  const { $auth, $firestore } = useNuxtApp(); // Get Firebase instances
  const auth = $auth as Auth;
  const firestore = $firestore as Firestore;

  const addKick = async () => {
    const user = auth.currentUser; // Get the logged-in user

    if (!user) throw new Error("User not logged in");

    const userId = user.uid;
    const kicksRef = collection(doc(firestore, "users", userId), "kicks"); // Path: users/{userId}/kicks

    try {
      await addDoc(kicksRef, {
        date: Timestamp.now(), // Add the current timestamp
      });
      console.log("Kick recorded successfully");
    } catch (error) {
      console.error("Error recording kick: ", error);
    }
  };

  const getKicks = async () => {
    const user = auth.currentUser; // Get the logged-in user

    if (!user) throw new Error("User not logged in");

    const userId = user.uid;
    const kicksRef = collection(doc(firestore, "users", userId), "kicks"); // Path: users/{userId}/kicks

    try {
      const q = query(kicksRef, orderBy("date", "desc")); // Sort by date
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching kicks: ", error);
      return [];
    }
  };

  return {
    addKick,
    getKicks,
  };
};

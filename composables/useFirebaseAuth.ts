import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  type User,
  onAuthStateChanged,
} from "firebase/auth";

export default function () {
  const { $auth } = useNuxtApp();

  const user = useState("fb_user"); // Use globally initialized state

  const signInGooglePopup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");

      const userCreds = await signInWithPopup($auth, provider);
      if (userCreds) {
        return true;
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return false;
    }
  };

  const registerUser = async (email: string, password: string) => {
    try {
      const userCreds = await createUserWithEmailAndPassword(
        $auth,
        email,
        password
      );
      if (userCreds) {
        return true;
      }
    } catch (error) {
      console.error("Error creating user with email:", error);
      return false;
    }
  };

  const signInEmailPassword = async (email: string, password: string) => {
    try {
      const userCreds = await signInWithEmailAndPassword(
        $auth,
        email,
        password
      );
      if (userCreds) {
        return true;
      }
    } catch (error) {
      console.error("Error signing in with email and password:", error);
      return false;
    }
  };

  const signOutFb = async () => {
    try {
      await signOut($auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    user,
    registerUser,
    signInEmailPassword,
    signInGooglePopup,
    signOutFb,
  };
}

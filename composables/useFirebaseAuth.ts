import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
  type User,
  type Auth,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function () {
  const { $auth } = useNuxtApp();
  const auth: Auth = $auth as Auth;

  // Use a reactive state to store the user
  const user = useState<User | null>("fb_user", () => null);

  // Initialize authentication state listener
  const initializeAuthStateListener = () => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        user.value = currentUser;
      }
    });
  };

  const signInGooglePopup = async () => {
    // Set persistence to local (persists even after page reload)
    await setPersistence(auth, browserLocalPersistence);

    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");

    try {
      const userCreds = await signInWithPopup(auth, provider);
      if (userCreds) {
        user.value = userCreds.user; // Update state with signed-in user
        return true;
      }
      initializeAuthStateListener();
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return false;
    }
    return false;
  };

  const registerUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const userCreds = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCreds) {
        user.value = userCreds.user;
        initializeAuthStateListener();
        return true;
      }
    } catch (error: unknown) {
      console.error("Error creating user with email:", error);
      return false;
    }
    return false;
  };

  const signInEmailPassword = async (email: string, password: string) => {
    // Set persistence to local (persists even after page reload)
    await setPersistence(auth, browserLocalPersistence);

    try {
      const userCreds = await signInWithEmailAndPassword(auth, email, password);
      if (userCreds) {
        user.value = userCreds.user; // Update state with signed-in user
        initializeAuthStateListener();
        return true;
      }
    } catch (error) {
      console.error("Error signing in with email and password:", error);
      return false;
    }
    return false;
  };

  const signOutFb = async () => {
    try {
      await signOut(auth);
      user.value = null;
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

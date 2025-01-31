import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  type User,
  onAuthStateChanged,
  AuthErrorCodes,
} from "firebase/auth";

export default function () {
  const { $auth } = useNuxtApp();

  const user = useState("fb_user"); // Use globally initialized state

  const signInGooglePopup = async (): Promise<{ success: Boolean; message: string; user?: User; code?: string;  }> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");

      const response = await signInWithPopup($auth, provider);
      const user = response.user; // User information

      return { success: true, message: "Google sign-in successful!", user };
    } catch (error) {
      console.error("Google sign-in failed:", error);
      // Handle specific error codes

      // Return an error message based on the error code
      let message;
      // @ts-expect-error
      switch (error.code) {
        case AuthErrorCodes.POPUP_CLOSED_BY_USER:
          message = "The popup was closed before completing sign-in.";
          break;
        case AuthErrorCodes.EXPIRED_POPUP_REQUEST:
          message = "Another sign-in attempt was made. Please try again.";
          break;
        case AuthErrorCodes.POPUP_BLOCKED:
          message =
            "The popup was blocked by the browser. Enable popups for this site.";
          break;
        case AuthErrorCodes.NETWORK_REQUEST_FAILED:
          message =
            "Network error occurred during sign-in. Please check your connection.";
          break;
        default:
          message = "An unknown error occurred. Please try again later.";
      }

      // @ts-expect-error
      return { success: false, message, code: error.code };
    }
  };

  const registerUser = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword($auth, email, password);
  };

  // FIXME should error handling live here instead?
  const signInEmailPassword = async (email: string, password: string) => {
    return await signInWithEmailAndPassword($auth, email, password);
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

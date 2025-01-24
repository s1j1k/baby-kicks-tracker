import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, type User, signOut, type Auth} from 'firebase/auth';

export default function() {
  const { $auth } = useNuxtApp();
  const auth: Auth = ($auth as Auth);

  const user = useState<User | null>("fb_user", () => null);

//   const registerUser = async (email: string, password: string): Promise<boolean> => {
//     try {
//       const userCreds = await createUserWithEmailAndPassword($auth, email, password)
//       if (userCreds) {
//         user.value = userCreds.user
//         return true
//       }
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         // handle error
//       }
//       return false
//     }
//     return false
//   }

const signInGooglePopup = async function () {
// Sign in with GoogleAuth Using a popup.
var provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');

try {
    const userCreds = await signInWithPopup(auth, provider);
    if (userCreds) {
        // The signed-in user info.
        user.value = userCreds.user;
        return true;
    }
    // // This gives you a Google Access Token.
    // var token = result.credential.accessToken;
    //
    // var user = result.user;
   
} catch (error: unknown) {
    if (error instanceof Error) {
      // handle error
    }
    return false
  }
  return false
}


const signOutFb = async function () { 
    try {
        await signOut(auth);
        user.value = null;
    } catch(error) {
        // An error happened.
    }
}




  return {
    user,
    // registerUser
    signInGooglePopup,
    signOutFb
  }
}
import { createUserWithEmailAndPassword, type User} from 'firebase/auth';

export default function() {
  const { $auth } = useNuxtApp();

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

const { $firebase } = useNuxtApp();

const signInGooglePopup = async function () {
// Sign in with GoogleAuth Using a popup.
var provider = new $firebase.auth.GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');

try {
    const userCreds = await $firebase.auth().signInWithPopup(provider);
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



  return {
    user,
    // registerUser
    signInGooglePopup
  }
}
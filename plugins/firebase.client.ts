// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  const firebaseConfig = {
    apiKey: config.FB_API_KEY,
    authDomain: config.FB_AUTH_DOMAIN,
    projectId: config.FB_PROJECT_ID,
    storageBucket: config.FB_STORAGE_BUCKET,
    messagingSenderId: config.FB_MESSAGING_SENDER_ID,
    appId: config.FB_APP_ID,
    measurementId: config.FB_MEASUREMENT_ID,
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
});

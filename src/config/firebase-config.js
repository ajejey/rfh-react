// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDTxtMrdzE0_8rhgouvR_jK9nkB0ZMdx-k",
    authDomain: "rupeeforhumanity.firebaseapp.com",
    projectId: "rupeeforhumanity",
    storageBucket: "rupeeforhumanity.appspot.com",
    messagingSenderId: "161592036397",
    appId: "1:161592036397:web:a69fe8753ebe807aac3ca4"
};

// Initialize Firebase
// initializeApp(firebaseConfig);
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const messaging = getMessaging(app);


import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyARTKNdaX6vqo_ueM22kiCT4z13d9nujNc",
  authDomain: "invoice-rocket-3f44c.firebaseapp.com",
  projectId: "invoice-rocket-3f44c",
  storageBucket: "invoice-rocket-3f44c.appspot.com",
  messagingSenderId: "553591087895",
  appId: "1:553591087895:web:9df057a9164a2b65ff8d52"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export default app
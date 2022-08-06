import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDbWC-vPscoNE1UN7oEk6hxCP-hTjwttU8",
  authDomain: "mychatapp-3c465.firebaseapp.com",
  projectId: "mychatapp-3c465",
  storageBucket: "mychatapp-3c465.appspot.com",
  messagingSenderId: "598144816273",
  appId: "1:598144816273:web:15f02cd1c0cd6ef9509b30"
};

export const app = initializeApp(firebaseConfig);

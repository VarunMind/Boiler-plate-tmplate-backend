import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA17pBEdRy7hAhz1dQingi4AxpdKHxUe3U",
  authDomain: "nenotech.firebaseapp.com",
  projectId: "nenotech",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const snapshot = await getDocs(collection(db, "users"));

snapshot.forEach((doc) => {
  console.log(doc.id, doc.data());
});

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"
import { getAuth } from "firebase/auth";

const PAGE_SIZE = 20;

//  Save new chat
export const saveChatHistory = async (title = "New Chat") => {
  const user = getAuth().currentUser;
  if (!user) return null;

  try {
    const docRef = await addDoc(collection(db, "usershistory"), {
      userId: user.uid,
      title,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
       // start empty, append later
      messages: [], 
      favorite: false,
    });

    return docRef.id;
  } catch (error) {
    console.error("Error saving chat:", error);
    return null;
  }
};

//  Step 1: Fetch first page
export const fetchInitialHistory = async () => {
  const user = getAuth().currentUser;
  if (!user) return { chats: [], lastDoc: null };

  const q = query(
    collection(db, "usershistory"), 
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc"),
    limit(PAGE_SIZE)
  );

  const snapshot = await getDocs(q);
  const chats = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

  return { chats, lastDoc };
};

//Fetch more (pagination)
export const fetchMoreHistory = async (lastDoc) => {
  const user = getAuth().currentUser;
  if (!user || !lastDoc) return { chats: [], lastDoc: null };

  const q = query(
    collection(db, "usershistory"), 
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc"),
    startAfter(lastDoc),
    limit(PAGE_SIZE)
  );

  const snapshot = await getDocs(q);
  const chats = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

  return { chats, lastDoc: newLastDoc };
};

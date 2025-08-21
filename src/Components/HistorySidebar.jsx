
import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";

export default function HistorySidebar() {
  const [history, setHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Track the logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  //  Fetch chat history for that user
  useEffect(() => {
    if (!currentUser) return;
    const fetchHistory = async () => {
      try {
        const q = query(
          collection(db, "usershistory"),
          where("userId", "==", currentUser.uid)
        );
        const snap = await getDocs(q);
        setHistory(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, [currentUser]);

  return (
    <div className="space-y-2 w-64 border-r border-gray-200">
      <h2 className="font-bold text-lg mb-4"></h2>
      {history.length === 0 ? (
        <p className="text-gray-500 text-sm">No chats yet</p>
      ) : (
        history.map((chat) => (
          <Link
          key={chat.id}
            to={`/app/history/${chat.id}`} 
            className="block p-2 rounded hover:bg-gray-200"
          >
            {chat.title || "Untitled Chat"}
          </Link>
        ))
      )}
    </div>
  );
}





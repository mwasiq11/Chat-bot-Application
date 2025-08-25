import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { NavLink } from "react-router-dom";

export default function HistorySidebar() {
  const [history, setHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track the logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? user.uid : "No user");
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  //  Fetch chat history for that user
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        console.log("Fetching history for user:", currentUser.uid);

        const q = query(
          collection(db, "usershistory"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);
        const historyData = snap.docs.map((doc) => {
          const data = doc.data();
          console.log("History item:", { id: doc.id, ...data });
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          };
        });

        console.log("Total history items:", historyData.length);
        setHistory(historyData);
      } catch (error) {
        console.error("Error fetching history:", error);
        // Try without ordering as fallback
        try {
          const q = query(
            collection(db, "usershistory"),
            where("userId", "==", currentUser.uid)
          );
          const snap = await getDocs(q);
          const historyData = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt
              ? doc.data().createdAt.toDate()
              : new Date(),
          }));
          setHistory(historyData);
        } catch (fallbackError) {
          console.error("Fallback error fetching history:", fallbackError);
          setHistory([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="space-y-2 w-64 border-r border-gray-200">
        <p className="text-gray-500 text-sm">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 w-64 border-r border-gray-200">
      {history.length === 0 ? (
        <p className="text-gray-500 text-sm">No chats yet</p>
      ) : (
        history.map((chat) => (
          
<NavLink
  key={chat.id}
  to={`/app/history/${chat.id}`}
  title={chat.title || "Untitled Chat"}
  className={({ isActive }) =>
    `block py-2 px-3 text-[16px] truncate rounded-xl cursor-pointer
     transition-colors duration-150 ease-out 
     ${isActive
        ? "bg-gray-200 text-gray-700 font-semibold shadow-sm"
        : "text-gray-700 hover:bg-gray-100"}
     active:scale-95 active:duration-100`
  }
>
  {chat.title || "Untitled chat"}
</NavLink>
))

)}
</div>
);
}

import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase/firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function HistoryPage() {
  const { id } = useParams();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChat = useCallback(
    async (userId) => {
      try {
        const docRef = doc(db, "usershistory", id);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          setError("Chat not found");
          return;
        }

        const chatData = snap.data();
        if (chatData.userId !== userId) {
          setError("You don't have permission to view this chat");
          return;
        }

        setChat(chatData);

        // Fetch messages in one query (ordered)
        const q = query(
          collection(db, "usershistory", id, "messages"),
          orderBy("createdAt", "asc")
        );
        const msgSnap = await getDocs(q);

        const fetchedMessages = msgSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          };
        });

        setMessages(fetchedMessages);
      } catch (err) {
        console.error("Error fetching chat:", err);
        setError("Failed to load chat. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchChat(user.uid);
      } else {
        setError("User must be logged in to view chat history");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchChat]);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {/* Skeleton Loader */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex space-x-4">
            <div className="h-10 w-10 rounded-full bg-gray-300"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (!chat) return <p className="p-4">No chat found.</p>;

  return (
    <div className="p-4">
      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`mt-4 px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow transition-all duration-300 ease-in-out ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-[#C94AFD] to-[#4F77FF] text-white"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

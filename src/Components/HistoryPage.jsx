import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function HistoryPage() {
  const { id } = useParams();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        // Check if user is authenticated
        const user = getAuth().currentUser;
        if (!user) {
          setError("You must be logged in to view chat history");
          setLoading(false);
          return;
        }

        const docRef = doc(db, "usershistory", id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const chatData = snap.data();

          // Check if the chat belongs to the current user
          if (chatData.userId !== user.uid) {
            setError("You don't have permission to view this chat");
            setLoading(false);
            return;
          }

          setChat(chatData);

          // fetch messages from subcollection
          try {
            const messagesRef = collection(db, "usershistory", id, "messages");

            // First, try to get all messages without ordering to see if any exist
            const allMessagesSnap = await getDocs(messagesRef);

            if (allMessagesSnap.size > 0) {
              // If messages exist, then try with ordering
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
                  createdAt: data.createdAt
                    ? data.createdAt.toDate()
                    : new Date(),
                };
              });

              setMessages(fetchedMessages);
            } else {
              setMessages([]);
            }
          } catch (messagesError) {
            console.error("Error fetching messages:", messagesError);
            setError("Failed to load messages. Please try again.");
            // Try to get messages without ordering as fallback
            try {
              const msgSnap = await getDocs(
                collection(db, "usershistory", id, "messages")
              );
              const fetchedMessages = msgSnap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
                createdAt: d.data().createdAt
                  ? d.data().createdAt.toDate()
                  : new Date(),
              }));
              setMessages(fetchedMessages);
              setError(null); // Clear error if fallback succeeds
            } catch (fallbackError) {
              console.error("Fallback error fetching messages:", fallbackError);
              setError(
                "Failed to load messages due to permission issues. Please check your Firebase security rules."
              );
              setMessages([]);
            }
          }
        } else {
          setError("Chat not found");
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
        setError("Failed to load chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!chat) return <p>No chat found.</p>;

  return (
    <div className="p-4">
      <div className="space-y-3">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-[#C94AFD] to-[#4F77FF] text-white"
                    : "bg-white text-gray-500 border border-gray-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        ) : (
          <p>No messages in this chat.</p>
        )}
      </div>
    </div>
  );
}

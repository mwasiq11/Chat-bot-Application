import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, collection, getDocs, orderBy, query } from "firebase/firestore";

export default function HistoryPage() {
  const { id } = useParams();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const docRef = doc(db, "usershistory", id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setChat(snap.data());

          // fetch messages from subcollection
          const q = query(
            collection(db, "usershistory", id, "messages"),
            orderBy("createdAt", "asc")
          );
          const msgSnap = await getDocs(q);
          setMessages(msgSnap.docs.map((d) => d.data()));
        } else {
          console.warn("No chat found for this id:", id);
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!chat) return <p>No chat found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">{chat.title || "Untitled Chat"}</h2>
      <div className="space-y-3">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-[#C94AFD] to-[#4F77FF] text-white"
                    : "bg-white text-gray-800 border border-gray-200"
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

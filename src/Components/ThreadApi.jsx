import { forwardRef, useImperativeHandle, useState, useRef } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
import {openAiService} from "../firebase/openAiService"
import Fileservice from "../firebase/fileservice";

const API_Key = import.meta.env.VITE_OPEN_AI_API_KEY;
const assistant_id = import.meta.env.VITE_ASSISSTENT_Id;

const ThreadApi = forwardRef(
  (
    {
      setResponse,
      setIsConversationStarted,
      isLoading,
      setisLoading,
      Fileservice,
      UploadedUrls,
    },
    ref
  ) => {
    const [data, setData] = useState("");
    const [threadId, setThreadId] = useState();
    //track Firestore doc
    const [chatDocId, setChatDocId] = useState(null);
    const [files, setFile] = useState([]);
    const [pendingMessage, setPendingMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const inputFileRef = useRef(null);

    const handlekeyDown = (event) => {
      if (event.key === "Enter") {
        if (event.shiftKey) {
          return;
        } else {
          event.preventDefault();
          handleSendMessage();
        }
      }
    };

    const handleSendMessage = async () => {
      if (!data.trim()) return;

      if (isLoading || isProcessing) {
        // If already loading or processing, queue this message
        setPendingMessage({
          text: data,
          files: [...files],
        });
        setData("");
        setFile([]);
      } else {
        // Send immediately if not loading
        setIsProcessing(true);
        setisLoading(true);

        // Upload files first
        const UploadedUrls = [];
        for (const file of files) {
          const url = await Fileservice(file);
          UploadedUrls.push(url);
        }
        CallOpenAI(data, UploadedUrls);
      }
    };

    // Add file
    const handleFile = (event) => {
      const selectedFile = Array.from(event.target.files);
      if (selectedFile) {
        setFile((prev) => [...prev, ...selectedFile]);
      }
    };

    // remove file
    const removeFile = (index) => {
      setFile((prev) => prev.filter((_, i) => i !== index));
    };

    const CallOpenAI = async (inputText) => {
      const prompt = inputText || data;
      if (!prompt.trim()) return;

      // Set loading state if not already set
      if (!isLoading) {
        setisLoading(true);
      }
      setIsProcessing(true);

      // Get current user and ensure they are properly authenticated
      const user = getAuth().currentUser;
      if (!user) {
        console.warn("No user logged in, skipping Firestore save");
      }

      // If first message: create chat document in Firestore
      let currentChatDocId = chatDocId;

      if (!currentChatDocId && user) {
        try {
          const chatDoc = await addDoc(collection(db, "usershistory"), {
            userId: user.uid,
            title: prompt || "New Chat",
            createdAt: serverTimestamp(),
          });

          currentChatDocId = chatDoc.id;
          setChatDocId(chatDoc.id);
        } catch (err) {
          console.error("Error saving chat history:", err);
        }
      }

      // Save user message into Firestore messages subcollection
      if (currentChatDocId && user) {
        try {
          const messageData = {
            role: "user",
            content: prompt,
            attachments: files.map((f) => f.name),
            createdAt: serverTimestamp(),
          };

          await addDoc(
            collection(db, "usershistory", currentChatDocId, "messages"),
            messageData
          );
        } catch (err) {
          console.error("Error saving user message to Firestore:", err);
        }
      }

      // mark conversation started
      setIsConversationStarted(true);

      // add user message to UI state
      setResponse((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
          attachments: files.map((f) => f.name),
        },
      ]);

      try {
        let thread_id = threadId;

        //  Create a new thread if none exists
        if (!thread_id) {
          try {
            const threadResponse = await fetch(
              "https://api.openai.com/v1/threads",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${API_Key}`,
                  "OpenAI-Beta": "assistants=v2",
                },
              }
            );

            if (!threadResponse.ok) {
              throw new Error(
                `Failed to create thread: ${threadResponse.status}`
              );
            }

            const thread = await threadResponse.json();
            thread_id = thread.id;
            setThreadId(thread_id);
          } catch (threadError) {
            console.error("Error creating thread:", threadError);
            throw new Error(
              "Failed to create conversation thread. Please try again."
            );
          }
        }

        // Send user message to OpenAI
        try {
          // const messageResponse = await fetch(
          //   `https://api.openai.com/v1/threads/${thread_id}/messages`,
          //   {
          //     method: "POST",
          //     headers: {
          //       "Content-Type": "application/json",
          //       Authorization: `Bearer ${API_Key}`,
          //       "OpenAI-Beta": "assistants=v2",
          //     },
          //     body: JSON.stringify({
          //       role: "user",
          //       content: prompt,
          //     }),
          //   }
          // );

          // if (!messageResponse.ok) {
          //   throw new Error(
          //     `Failed to send message: ${messageResponse.status}`
          //   );
          // }

          await openAiService(thread_id, prompt, UploadedUrls);
        } catch (messageError) {
          console.error("Error sending message:", messageError);
          throw new Error("Failed to send your message. Please try again.");
        }

        // Run assistant
        let run_id;
        try {
          const runResponse = await fetch(
            `https://api.openai.com/v1/threads/${thread_id}/runs`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${API_Key}`,
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v2",
              },
              body: JSON.stringify({ assistant_id }),
            }
          );

          if (!runResponse.ok) {
            throw new Error(`Failed to start assistant: ${runResponse.status}`);
          }

          const run = await runResponse.json();
          run_id = run.id;
        } catch (runError) {
          console.error("Error starting assistant run:", runError);
          throw new Error("Failed to start the assistant. Please try again.");
        }

        // Poll for run status
        let runStatus = "in_progress";
        let attempts = 0;
        const maxAttempts = 60; // 60 seconds timeout

        while (runStatus === "in_progress" || runStatus === "queued") {
          if (attempts >= maxAttempts) {
            throw new Error("Request timed out. Please try again.");
          }

          try {
            const runCheck = await fetch(
              `https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${API_Key}`,
                  "OpenAI-Beta": "assistants=v2",
                },
              }
            );

            if (!runCheck.ok) {
              throw new Error(`HTTP error! status: ${runCheck.status}`);
            }

            const statusData = await runCheck.json();
            runStatus = statusData.status;

            if (["cancelled", "expired", "failed"].includes(runStatus)) {
              throw new Error("Run failed or cancelled/expired.");
            }

            attempts++;
            await new Promise((resolve) => setTimeout(resolve, 100));
          } catch (pollError) {
            console.error("Error polling run status:", pollError);
            throw new Error(
              "Failed to check response status. Please try again."
            );
          }
        }

        //  Fetch messages when completed
        if (runStatus === "completed") {
          try {
            const messageResponse = await fetch(
              `https://api.openai.com/v1/threads/${thread_id}/messages`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${API_Key}`,
                  "OpenAI-Beta": "assistants=v2",
                },
              }
            );

            if (!messageResponse.ok) {
              throw new Error(
                `Failed to fetch messages: ${messageResponse.status}`
              );
            }

            const msgData = await messageResponse.json();

            // Pick latest assistant reply
            const assistantMsg = msgData.data.find(
              (msg) => msg.role === "assistant"
            );

            if (assistantMsg?.content[0]?.text?.value) {
              const reply = assistantMsg.content[0].text.value;

              // show in UI
              setResponse((prev) => [
                ...prev,
                { role: "assistant", content: reply },
              ]);

              //  save assistant reply in Firestore
              if (currentChatDocId && user) {
                try {
                  const assistantMessageData = {
                    role: "assistant",
                    content: reply,
                    createdAt: serverTimestamp(),
                  };

                  await addDoc(
                    collection(
                      db,
                      "usershistory",
                      currentChatDocId,
                      "messages"
                    ),
                    assistantMessageData
                  );
                } catch (error) {
                  console.error(
                    "Error saving assistant reply to Firestore:",
                    error
                  );
                }
              }
            } else {
              console.warn(
                "No assistant response content found in:",
                assistantMsg
              );
              throw new Error("No assistant response found");
            }
          } catch (fetchError) {
            console.error("Error fetching messages:", fetchError);
            throw new Error(
              "Failed to retrieve the assistant's response. Please try again."
            );
          }
        }

        setFile([]);
        setData("");
      } catch (error) {
        console.log("Fetching error", error);
        // Show error in UI
        setResponse((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ]);
        return error;
      } finally {
        setisLoading(false);
        setIsProcessing(false);

        // Check if there's a pending message and execute it
        // Only execute if there's no new message in the input
        if (pendingMessage && !data.trim()) {
          const { text, files: pendingFiles } = pendingMessage;
          setPendingMessage(null);
          setData(text);
          setFile(pendingFiles);

          // Execute the pending message after a short delay
          setTimeout(() => {
            CallOpenAI(text);
          }, 100);
        } else if (pendingMessage && data.trim()) {
          // If there's a new message in input, clear the pending message
          setPendingMessage(null);
        }
      }
    };

    // Expose CallOpenAI to parent
    useImperativeHandle(ref, () => ({
      CallOpenAI,
      ClearInput: () => setData(""),
      ResetConversation: () => {
        setThreadId(null);
        setChatDocId(null);
        setFile([]);
        setData("");
        setPendingMessage(null);
        setIsProcessing(false);
        setIsConversationStarted(false);
        setResponse([]);
      },
    }));

    return (
      <div className="w-full py-4 mb-1">
        <div className="relative w-full mx-auto">
          <div className="relative flex flex-col bg-black/5 outline-none border-none">
            <textarea
              onChange={(e) => setData(e.target.value)}
              value={data}
              onKeyDown={handlekeyDown}
              className={`w-full min-h-[95px] max-h-[200px] rounded-xl rounded-b-none px-4 py-3 
                    bg-[#FFFFFF] text-gray-500 placeholder:text-gray-600 border-0 outline-none resize-none 
                      focus:ring-0 focus:outline-none`}
              placeholder="Ask whatever you want..."
              id="ai-input"
            />

            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 px-3 py-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-xl text-sm"
                  >
                    <span className="truncate max-w-[120px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      ✖️
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="h-12 bg-white rounded-b-xl flex justify-between items-center px-3">
              <div className="flex items-center gap-2">
                <label className="cursor-pointer rounded-lg  ">
                  <input
                    className="hidden"
                    onChange={handleFile}
                    ref={inputFileRef}
                    type="file"
                  />
                  <img className="h-7" src="./assets/attachment.png" alt="" />
                </label>

                <span className=" text-gray-500 font-semibold">
                  Add Attachment
                </span>
              </div>
              <div className="bg-[#593EBD] w-9 h-9 rounded-[10px] mb-2">
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || isProcessing}
                  className={`rounded-lg pl-[9px] pt-1 text-white cursor-pointer transition-colors items-center
                 ${
                   isLoading || isProcessing
                     ? "opacity-50 cursor-not-allowed"
                     : "hover:text-gray-400"
                 }`}
                  type="button"
                >
                  <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth={2}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                    height={26}
                    width={16}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ThreadApi;

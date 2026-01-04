import { forwardRef, useImperativeHandle, useState, useRef } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
import {openAiService} from "../firebase/openAiService"
import Fileservice from "../firebase/fileService";
import { analyzeFile, isFileSupported } from "../firebase/fileAnalysisService";

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
      
    },
    ref
  ) => {
    const [data, setData] = useState("");
    const [threadId, setThreadId] = useState();
    //track Firestore doc
    const [chatDocId, setChatDocId] = useState(null);
    const [files, setFile] = useState([]);
    const [_, setAnalyzedFiles] = useState([]);
    const [pendingMessage, setPendingMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileAnalysisProgress, setFileAnalysisProgress] = useState('');
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
      if (!data.trim() && files.length === 0) return;

      if (isLoading || isProcessing) {
        // If already loading or processing, queue this message
        setPendingMessage({
          text: data,
          files: [...files],
        });
        setData("");
        setFile([]);
        setAnalyzedFiles([]);
      } else {
        // Send immediately if not loading
        setIsProcessing(true);
        setisLoading(true);

        try {
          // Analyze files first
          setFileAnalysisProgress('Analyzing files...');
          const analyzed = [];
          const UploadedUrls = [];

          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setFileAnalysisProgress(`Analyzing file ${i + 1}/${files.length}: ${file.name}`);
            
            try {
              // Analyze the file content
              const fileData = await analyzeFile(file);
              analyzed.push(fileData);

              // Upload to Firebase for storage (optional, for history)
              const url = await Fileservice(file);
              if (fileData.type === 'image') {
                UploadedUrls.push(url);
              }
            } catch (error) {
              console.error(`Error processing file ${file.name}:`, error);
              // Continue with other files
            }
          }

          setFileAnalysisProgress('');
          setAnalyzedFiles(analyzed);
          CallOpenAI(data, UploadedUrls, analyzed);
        } catch (error) {
          console.error('Error in handleSendMessage:', error);
          setFileAnalysisProgress('');
          setIsProcessing(false);
          setisLoading(false);
        }
      }
    };

    // Add file with validation
    const handleFile = (event) => {
      const selectedFiles = Array.from(event.target.files);
      
      // Validate files
      const validFiles = [];
      const invalidFiles = [];
      
      selectedFiles.forEach(file => {
        if (isFileSupported(file)) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file.name);
        }
      });
      
      if (invalidFiles.length > 0) {
        alert(`Unsupported file types: ${invalidFiles.join(', ')}\n\nSupported types: Text files, PDF, DOCX, Images (JPG, PNG, etc.)`);
      }
      
      if (validFiles.length > 0) {
        setFile((prev) => [...prev, ...validFiles]);
      }
    };

    // Remove file
    const removeFile = (index) => {
      setFile((prev) => prev.filter((_, i) => i !== index));
    };

    // Get file type icon
    const getFileIcon = (fileName) => {
      const extension = fileName.split('.').pop().toLowerCase();
      
      const iconMap = {
        // Documents
        'pdf': '📄',
        'doc': '📝',
        'docx': '📝',
        'txt': '📋',
        'md': '📋',
        
        // Spreadsheets
        'csv': '📊',
        'xlsx': '📊',
        'xls': '📊',
        'json': '📊',
        
        // Code
        'js': '🔧',
        'jsx': '🔧',
        'ts': '🔧',
        'tsx': '🔧',
        'py': '🔧',
        'java': '🔧',
        'cpp': '🔧',
        'c': '🔧',
        'html': '🔧',
        'css': '🔧',
        
        // Images
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'png': '🖼️',
        'gif': '🖼️',
        'webp': '🖼️',
        'svg': '🖼️',
        'bmp': '🖼️',
        
        // Archives
        'zip': '🗜️',
        'rar': '🗜️',
        'tar': '🗜️',
        'gz': '🗜️',
      };
      
      return iconMap[extension] || '📎';
    };

    // Check if file is an image
    const isImageFile = (fileName) => {
      const extension = fileName.split('.').pop().toLowerCase();
      return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension);
    };

    // Get file size in readable format
    

    const CallOpenAI = async (inputText, uploadedUrls = [], analyzedFilesData = []) => {
      const prompt = inputText || data;
      if (!prompt.trim() && analyzedFilesData.length === 0) return;

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
            attachments: analyzedFilesData.map((f) => f.name),
            fileSummaries: analyzedFilesData.map((f) => f.summary),
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
      const userMessageContent = analyzedFilesData.length > 0
        ? `${prompt}\n\n📎 Attached files: ${analyzedFilesData.map(f => f.summary).join(', ')}`
        : prompt;
      
      setResponse((prev) => [
        ...prev,
        {
          role: "user",
          content: userMessageContent,
          attachments: analyzedFilesData.map((f) => f.name),
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

        // Send user message to OpenAI with analyzed file content
        try {
          await openAiService(thread_id, prompt, uploadedUrls, analyzedFilesData);
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
        setAnalyzedFiles([]);
        setData("");
      } catch (error) {
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
        setAnalyzedFiles([]);
        setData("");
        setPendingMessage(null);
        setIsProcessing(false);
        setIsConversationStarted(false);
        setResponse([]);
        setFileAnalysisProgress('');
      },
    }));

    return (
      <div className="w-full py-4 mb-1">
        {fileAnalysisProgress && (
          <div className="mb-2 text-sm text-gray-600 flex items-center gap-2">
            <span className="animate-pulse">📄</span>
            {fileAnalysisProgress}
          </div>
        )}

        {/* File Preview Section - ABOVE input box */}
        {files.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 border border-gray-200 rounded-t-xl border-b-0 flex flex-wrap gap-3">
            {files.map((file, index) => {
              // For images, show actual preview
              const imageUrl = isImageFile(file.name) ? URL.createObjectURL(file) : null;
              
              return (
                <div
                  key={index}
                  className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-md transition-all"
                  style={{ width: '100px', height: '100px' }}
                >
                  {imageUrl ? (
                    // Image Preview
                    <img
                      src={imageUrl}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onLoad={() => URL.revokeObjectURL(imageUrl)}
                    />
                  ) : (
                    // File Icon
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white p-2">
                      <div className="text-3xl mb-1">
                        {getFileIcon(file.name)}
                      </div>
                      <p className="text-xs font-medium text-gray-700 text-center truncate w-full px-1" title={file.name}>
                        {file.name.substring(0, 10)}{file.name.length > 10 ? '...' : ''}
                      </p>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Remove file"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="relative w-full mx-auto">
          <div className="relative flex flex-col bg-white rounded-xl shadow-sm border border-gray-100" style={{ borderTopLeftRadius: files.length > 0 ? '0' : '12px', borderTopRightRadius: files.length > 0 ? '0' : '12px' }}>
            {/* Textarea - FIXED HEIGHT */}
            <textarea
              onChange={(e) => setData(e.target.value)}
              value={data}
              onKeyDown={handlekeyDown}
              className={`w-full h-[95px] px-4 py-3 rounded-t-2xl
                    bg-white text-gray-700 placeholder:text-gray-400 border-0 outline-none resize-none 
                      focus:ring-0 focus:outline-none`}
              placeholder="Ask whatever you want..."
              id="ai-input"
            />

                  <div className="h-14 bg-white rounded-b-2xl flex justify-between items-center px-4">
                    <div className="flex items-center gap-2">
                    <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
                      <input
                      className="hidden"
                      onChange={handleFile}
                      ref={inputFileRef}
                      type="file"
                      multiple
                      />
                
                      <img className="h-6" src="./assets/attachment.png" alt="Add attachment" title="Add attachment" />
                      <span className="text-gray-500">Add Attachments</span>
                    </label>
                    </div>

                    {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={isLoading || isProcessing}
                className={`bg-[#593EBD] hover:bg-[#7c5dd8] text-white p-2.5 rounded-lg transition-all flex items-center justify-center
                 ${
                   isLoading || isProcessing
                     ? "opacity-50 cursor-not-allowed"
                     : "hover:shadow-md"
                 }`}
                type="button"
                title="Send message"
              >
                <svg
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  height={20}
                  width={20}
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
    );
  }
);

export default ThreadApi;
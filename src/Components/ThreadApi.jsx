import { useState } from "react";

const API_Key = import.meta.env.VITE_OPEN_AI_API_KEY;
const assistant_id = import.meta.env.VITE_ASSISSTENT_Id;

function ThreadApi( {setResponse,setIsConversationStarted}) {
  const [data, setData] = useState("");
  const [threadId, setThreadId] = useState();

  const CallOpenAI = async () => {
    if(!data.trim())
      return
    
    setIsConversationStarted(true);
    setResponse((prev)=>[...prev,{role:"user",content:data}])
    try {
      let thread_id = threadId;
      if (!thread_id) {
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
        const thread = await threadResponse.json();
        thread_id = thread.id;
        setThreadId(thread_id);
      }
      await fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_Key}`,
          "OpenAI-Beta": "assistants=v2",
        },
        body: JSON.stringify({
          role: "user",
          content: data,
        }),
      });

      const runAssisstent = await fetch(
        `https://api.openai.com/v1/threads/${thread_id}/runs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_Key}`,
            "Content-Type": "application/json",
            "OpenAI-Beta": "assistants=v2",
          },
          body: JSON.stringify({
            assistant_id: assistant_id,
          }),
        }
      );
      if (!runAssisstent.ok) {
        const errorData = await runAssisstent.json();
        console.error("Run creation failed:", errorData);
        throw new Error(errorData.error?.message || "failed to create run ");
      }
      const run = await runAssisstent.json();
      const run_id = run.id;
      if (!run_id) {
        throw new Error("No run_id returned from API");
      }

      let runStatus = "in_progress";
      while (runStatus !== "completed") {
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
        const dataStatus = await runCheck.json();
        runStatus = dataStatus.status;
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (
          dataStatus === "cancellled" ||
          dataStatus === "expired" ||
          dataStatus === "failed"
        ) {
          throw new Error("Run failed or cancelled/expired.");
        }

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
        const msgData = await messageResponse.json();
  console.log('OpenAI messages response:', msgData);
        // Find latest assistant response
        const assistantMsg = msgData.data.find(
          (msg) => msg.role === "assistant"
        );
  console.log('Assistant message:', assistantMsg);
       if (assistantMsg && assistantMsg.content && assistantMsg.content[0]?.text?.value) {
      const reply = assistantMsg.content[0].text.value;
  setResponse(prev => [...prev, { role: "assistant", content: reply }]);

  // This will put assistant's message into the input box
  setData(reply);
}
      }
    } catch (error) {
      console.log("Fetching error", error);
      return error;
    }
  };

  return (
    <div className="w-full py-4">
      <div className="relative max-w-[60rem] w-full mx-auto">
       
        <div className="relative flex flex-col bg-black/5 outline-none border-none">
          <textarea
            onChange={(e) => setData(e.target.value)}
            value={data}
            className="w-full min-h-[90px] max-h-[200px] rounded-xl rounded-b-none px-4 py-3 bg-[#FFFFFF] text-gray-500 placeholder:text-[#404040] from-neutral-950 border-0 outline-none resize-none focus:ring-0 focus:outline-none leading-[1.2]"
            placeholder="Ask anything"
            id="ai-input"
          />
          <div className="h-12 bg-white rounded-b-xl">
            <div className="absolute left-3 bottom-3 flex items-center gap-2">
              <label className="cursor-pointer rounded-lg p-2 bg-white hover:bg-white/10">
                <input className="hidden" type="file" />
                <svg
                  className="text-purple-500 hover:text-[#086cee] transition-colors"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  height={16}
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </label>
              <span className="text-sm text-gray-500 font-normal">
                Add Attachment
              </span>
            </div>
            <div className="absolute right-3 bottom-3">
             {/*MIC ICON */}
              {/* <button 
                aria-label="Dictate button"
                type="button"
                class="composer-btn"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label=""
                  class="icon"
                  font-size="inherit"
                >
                  <path d="M15.7806 10.1963C16.1326 10.3011 16.3336 10.6714 16.2288 11.0234L16.1487 11.2725C15.3429 13.6262 13.2236 15.3697 10.6644 15.6299L10.6653 16.835H12.0833L12.2171 16.8486C12.5202 16.9106 12.7484 17.1786 12.7484 17.5C12.7484 17.8214 12.5202 18.0894 12.2171 18.1514L12.0833 18.165H7.91632C7.5492 18.1649 7.25128 17.8672 7.25128 17.5C7.25128 17.1328 7.5492 16.8351 7.91632 16.835H9.33527L9.33429 15.6299C6.775 15.3697 4.6558 13.6262 3.84992 11.2725L3.76984 11.0234L3.74445 10.8906C3.71751 10.5825 3.91011 10.2879 4.21808 10.1963C4.52615 10.1047 4.84769 10.2466 4.99347 10.5195L5.04523 10.6436L5.10871 10.8418C5.8047 12.8745 7.73211 14.335 9.99933 14.335C12.3396 14.3349 14.3179 12.7789 14.9534 10.6436L15.0052 10.5195C15.151 10.2466 15.4725 10.1046 15.7806 10.1963ZM12.2513 5.41699C12.2513 4.17354 11.2437 3.16521 10.0003 3.16504C8.75675 3.16504 7.74835 4.17343 7.74835 5.41699V9.16699C7.74853 10.4104 8.75685 11.418 10.0003 11.418C11.2436 11.4178 12.2511 10.4103 12.2513 9.16699V5.41699ZM13.5814 9.16699C13.5812 11.1448 11.9781 12.7479 10.0003 12.748C8.02232 12.748 6.41845 11.1449 6.41828 9.16699V5.41699C6.41828 3.43889 8.02221 1.83496 10.0003 1.83496C11.9783 1.83514 13.5814 3.439 13.5814 5.41699V9.16699Z"></path>
                </svg>
              </button> */}

              <button
                onClick={CallOpenAI}
                className="rounded-lg p-2 bg-white hover:bg-white/10 text-purple-500 hover:text-[#086cee] cursor-pointer transition-colors"
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

export default ThreadApi;



//  import { useState } from "react";

//  const API_Key = import.meta.env.VITE_OPEN_AI_API_KEY;
//  const assistant_id = import.meta.env.VITE_ASSISSTENT_Id;

// function ThreadApi({ response, setResponse, isConversationStarted, setIsConversationStarted }) {
//   const [data, setData] = useState("");
//   const [threadId, setThreadId] = useState();

//   const CallOpenAI = async () => {
//     if (!data.trim()) return;
    
//     setIsConversationStarted(true);
//     setResponse((prev) => [...prev, { role: "user", content: data }]);

//     try {
//       let thread_id = threadId;
//       if (!thread_id) {
//         const threadResponse = await fetch("https://api.openai.com/v1/threads", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${API_Key}`,
//             "OpenAI-Beta": "assistants=v2",
//           },
//         });
//         const thread = await threadResponse.json();
//         thread_id = thread.id;
//         setThreadId(thread_id);
//       }

//       await fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${API_Key}`,
//           "OpenAI-Beta": "assistants=v2",
//         },
//         body: JSON.stringify({ role: "user", content: data }),
//       });

//       const runRes = await fetch(`https://api.openai.com/v1/threads/${thread_id}/runs`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${API_Key}`,
//           "Content-Type": "application/json",
//           "OpenAI-Beta": "assistants=v2",
//         },
//         body: JSON.stringify({ assistant_id }),
//       });

//       const run = await runRes.json();
//       const run_id = run.id;

//       let runStatus = "in_progress";
//       while (runStatus !== "completed") {
//         const runCheck = await fetch(
//           `https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${API_Key}`,
//               "OpenAI-Beta": "assistants=v2",
//             },
//           }
//         );
//         const statusData = await runCheck.json();
//         runStatus = statusData.status;
//         await new Promise((r) => setTimeout(r, 1000));

//         const messageResponse = await fetch(
//           `https://api.openai.com/v1/threads/${thread_id}/messages`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${API_Key}`,
//               "OpenAI-Beta": "assistants=v2",
//             },
//           }
//         );
//         const msgData = await messageResponse.json();
//         const assistantMsg = msgData.data.find((msg) => msg.role === "assistant");

//         if (assistantMsg?.content?.[0]?.text?.value) {
//           setResponse((prev) => [
//             ...prev,
//             { role: "assistant", content: assistantMsg.content[0].text.value },
//           ]);
//         }
//         setData("");
//       }
//     } catch (error) {
//       console.log("Fetching error", error);
//     }
//   };

//   return (
//     <div className="w-full py-4">
//       {/* Chat input */}
//       <div className="relative max-w-[60rem] w-full mx-auto">
//         <div className="relative flex flex-col bg-black/5 outline-none border-none">
//           <textarea
//             onChange={(e) => setData(e.target.value)}
//             value={data}
//             className="w-full min-h-[90px] max-h-[200px] rounded-xl rounded-b-none px-4 py-3 bg-[#FFFFFF] text-gray-500 placeholder:text-[#404040] border-0 outline-none resize-none"
//             placeholder="Ask anything"
//           />
//           <div className="h-12 bg-white rounded-b-xl flex justify-end items-center pr-3">
//             <button
//               onClick={CallOpenAI}
//               className="rounded-lg p-2 bg-white hover:bg-white/10 text-purple-500 hover:text-[#086cee] cursor-pointer transition-colors"
//               type="button"
//             >
//               <svg
//                 strokeLinejoin="round"
//                 strokeLinecap="round"
//                 strokeWidth={2}
//                 stroke="currentColor"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 height={26}
//                 width={16}
//               >
//                 <path d="m22 2-7 20-4-9-9-4Z" />
//                 <path d="M22 2 11 13" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default ThreadApi;

import  { useState } from "react";
const API_Key = import.meta.env.VITE_OPEN_AI_API_KEY;
const assistant_id = import.meta.env.VITE_ASSISSTENT_Id;
console.log("api key=",API_Key);
console.log("assistent key=",assistant_id);

function ThreadApi() {
  const [data, setData] = useState("");
  const [response, setResponse] = useState("");
  const [threadId, setThreadId] = useState();

  const CallOpenAI = async () => {

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
          })
        }
      );
      if (!runAssisstent.ok) {
        const errorData=await runAssisstent.json()
        console.error("Run creation failed:", errorData);
        throw new Error(errorData.error?.message||"failed to create run ")
       
        
      }
      const run=await runAssisstent.json();
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
        await new Promise((resolve) => setTimeout(resolve,1000))
       
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
        // Find latest assistant response
       const assistantMsg=msgData.data.find((msg)=> 
        msg.role==="assistant"
      )
      if(assistantMsg && assistantMsg.content && assistantMsg.content[0]?.text?.value){
        setResponse(assistantMsg.content[0].text.value)
        
      }
      setData("")
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
            value={response || data}
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

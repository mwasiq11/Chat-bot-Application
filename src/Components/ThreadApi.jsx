import { forwardRef, useImperativeHandle, useState } from "react";
const API_Key = import.meta.env.VITE_OPEN_AI_API_KEY;
const assistant_id = import.meta.env.VITE_ASSISSTENT_Id;

const ThreadApi = forwardRef(({ setResponse, setIsConversationStarted }, ref) => {
  const [data, setData] = useState("");
  const [threadId, setThreadId] = useState();

  const handlekeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      CallOpenAI();
    }
  };

  const CallOpenAI = async (inputText) => {
    const prompt = inputText || data;
    if (!prompt.trim()) return;

    setIsConversationStarted(true);
    setResponse((prev) => [...prev, { role: "user", content: prompt }]);

    try {
      let thread_id = threadId;

      // 1️⃣ Create a new thread if none exists
      if (!thread_id) {
        const threadResponse = await fetch("https://api.openai.com/v1/threads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_Key}`,
            "OpenAI-Beta": "assistants=v2",
          },
        });
        const thread = await threadResponse.json();
        thread_id = thread.id;
        setThreadId(thread_id);
      }

      // 2️⃣ Send user message
      await fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_Key}`,
          "OpenAI-Beta": "assistants=v2",
        },
        body: JSON.stringify({
          role: "user",
          content: prompt,
        }),
      });

      // 3️⃣ Run assistant
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
        const errorData = await runResponse.json();
        console.error("Run creation failed:", errorData);
        throw new Error(errorData.error?.message || "Failed to create run");
      }

      const run = await runResponse.json();
      const run_id = run.id;
      if (!run_id) throw new Error("No run_id returned from API");

      // 4️⃣ Poll for run status
      let runStatus = "in_progress";
      while (runStatus === "in_progress" || runStatus === "queued") {
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

        const statusData = await runCheck.json();
        runStatus = statusData.status;

        if (["cancelled", "expired", "failed"].includes(runStatus)) {
          throw new Error("Run failed or cancelled/expired.");
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // 5️⃣ Fetch messages when completed
      if (runStatus === "completed") {
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

        // Pick latest assistant reply
        const assistantMsg = msgData.data.find((msg) => msg.role === "assistant");
        if (assistantMsg?.content[0]?.text?.value) {
          const reply = assistantMsg.content[0].text.value;
          setResponse((prev) => [...prev, { role: "assistant", content: reply }]);
        }
      }

      setData("");
    } catch (error) {
      console.log("Fetching error", error);
      return error;
    }
  };

  // 6️⃣ Expose CallOpenAI to parent
  useImperativeHandle(ref, () => ({
    CallOpenAI,
  }));

  return (
    <div className="w-full py-4">
      <div className="relative max-w-[60rem] w-full mx-auto">
        <div className="relative flex flex-col bg-black/5 outline-none border-none">
          <textarea
            onChange={(e) => setData(e.target.value)}
            value={data}
            onKeyDown={handlekeyDown}
            className="w-full min-h-[90px] max-h-[200px] rounded-xl rounded-b-none px-4 py-3 bg-[#FFFFFF] text-gray-500 placeholder:text-[#404040] border-0 outline-none resize-none focus:ring-0 focus:outline-none"
            placeholder="Ask anything"
            id="ai-input"
          />

          <div className="h-12 bg-white rounded-b-xl flex justify-between items-center px-3">
            <span className="text-sm text-gray-500">Add Attachment</span>
            <button
              onClick={() => CallOpenAI()}
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
  );
});

export default ThreadApi;

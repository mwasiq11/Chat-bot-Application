const API_Key = import.meta.env.VITE_OPEN_AI_API_KEY;

export const openAiService=async(thread_id,inputText,UploadedUrls=[])=>{
    const prompt=inputText;
    const bodyMessage={
        role:"user",
        content:[
              { type: "text", text: prompt },
      ...UploadedUrls.map((url) => ({
        type: "image_url",
        image_url: { url },
      })),
        ]

    }
    const response=fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`,{
        method:"POST",
        headers:{
             "Content-Type": "application/json",
            Authorization: `Bearer ${API_Key}`,
            "OpenAI-Beta": "assistants=v2",
        },
        body:JSON.stringify(bodyMessage),
    })
    if(!response.ok){
        throw new Error (`Failed to send message: ${response.status}`)
    }
    return response.json()
    
}
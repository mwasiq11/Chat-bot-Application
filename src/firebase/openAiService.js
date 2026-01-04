const API_Key = import.meta.env.VITE_OPEN_AI_API_KEY;

/**
 * Send a message to OpenAI with optional file analysis
 * @param {string} thread_id - OpenAI thread ID
 * @param {string} inputText - User's text message
 * @param {Array} UploadedUrls - Array of image URLs for vision API
 * @param {Array} analyzedFiles - Array of analyzed file objects with content
 * @returns {Promise} - OpenAI API response
 */
export const openAiService = async (
  thread_id,
  inputText,
  UploadedUrls = [],
  analyzedFiles = []
) => {
  let prompt = inputText;

  // Add analyzed file content to the prompt with better formatting
  if (analyzedFiles && analyzedFiles.length > 0) {
    const fileContents = analyzedFiles
      .filter((file) => file.type !== 'image') // Images are handled separately
      .map((file, index) => {
        const separator = '═'.repeat(50);
        return `\n\n${separator}\n📎 ATTACHED FILE ${index + 1}: ${file.name}\n${separator}\n\n${file.content}\n\n${separator}\n✓ End of ${file.name}\n${separator}`;
      })
      .join('\n\n');

    if (fileContents) {
      prompt += '\n\n' + fileContents;
    }
  }

  // Build content array
  const contentArray = [{ type: "text", text: prompt }];

  // Add image URLs for vision API
  if (UploadedUrls && UploadedUrls.length > 0) {
    UploadedUrls.forEach((url) => {
      contentArray.push({
        type: "image_url",
        image_url: { url },
      });
    });
  }

  // Add image data URLs from analyzed files
  if (analyzedFiles && analyzedFiles.length > 0) {
    analyzedFiles
      .filter((file) => file.type === 'image' && file.content)
      .forEach((file) => {
        contentArray.push({
          type: "image_url",
          image_url: { url: file.content }, // Data URL
        });
      });
  }

  const bodyMessage = {
    role: "user",
    content: contentArray,
  };

  const response = await fetch(
    `https://api.openai.com/v1/threads/${thread_id}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_Key}`,
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify(bodyMessage),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.status}`);
  }

  return response.json();
};
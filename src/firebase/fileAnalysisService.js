/**
 * Analyzes a file and extracts its content
 * @param {File} file - The file to analyze
 * @returns {Promise<{content: string, type: string, name: string}>}
 */
export async function analyzeFile(file) {
  const fileType = file.type;
  const fileName = file.name;
  const fileExtension = fileName.split('.').pop().toLowerCase();

  try {
    // Handle text files
    if (
      fileType.startsWith('text/') ||
      ['txt', 'md', 'csv', 'json', 'xml', 'html', 'css', 'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp'].includes(fileExtension)
    ) {
      const content = await readTextFile(file);
      return {
        content,
        type: 'text',
        name: fileName,
        summary: `Text file "${fileName}" with ${content.length} characters`,
      };
    }

    // Handle PDF files
    if (fileType === 'application/pdf' || fileExtension === 'pdf') {
      const content = await extractPDFText(file);
      return {
        content,
        type: 'pdf',
        name: fileName,
        summary: `PDF file "${fileName}" with ${content.length} characters`,
      };
    }

    // Handle Word documents
    if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileExtension === 'docx'
    ) {
      const content = await extractDocxText(file);
      return {
        content,
        type: 'docx',
        name: fileName,
        summary: `Word document "${fileName}" with ${content.length} characters`,
      };
    }

    // Handle images - return URL for vision API
    if (fileType.startsWith('image/')) {
      const dataUrl = await readFileAsDataURL(file);
      return {
        content: dataUrl,
        type: 'image',
        name: fileName,
        summary: `Image file "${fileName}"`,
      };
    }

    // Unsupported file type - try to read as text
    const content = await readTextFile(file);
    return {
      content,
      type: 'unknown',
      name: fileName,
      summary: `File "${fileName}" (${fileType})`,
    };
  } catch (error) {
    console.error(`Error analyzing file ${fileName}:`, error);
    throw new Error(`Failed to analyze file: ${fileName}`);
  }
}

/**
 * Read text file content
 */
function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Read file as Data URL (for images)
 */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Extract text from PDF using PDF.js with improved formatting
 * Note: You'll need to install: npm install pdfjs-dist
 */
async function extractPDFText(file) {
  try {
    // Dynamic import to avoid bundling issues
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker path - use the local worker file from node_modules
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs?url');
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from each page with better formatting
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Group text items by vertical position to preserve layout
      let lastY = null;
      let pageText = '';
      
      textContent.items.forEach((item) => {
        const currentY = item.transform[5]; // Y position
        
        // Add line break if Y position changed significantly (new line)
        if (lastY !== null && Math.abs(currentY - lastY) > 5) {
          pageText += '\n';
        }
        
        // Add the text with proper spacing
        const text = item.str;
        
        // Add space between words if needed
        if (pageText.length > 0 && !pageText.endsWith('\n') && 
            !pageText.endsWith(' ') && text.trim().length > 0 &&
            !text.startsWith(' ')) {
          pageText += ' ';
        }
        
        pageText += text;
        lastY = currentY;
      });
      
      // Clean up excessive whitespace while preserving structure
      pageText = pageText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
      
      fullText += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      fullText += `📄 Page ${i} of ${pdf.numPages}\n`;
      fullText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      fullText += pageText + '\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract PDF content. Make sure pdfjs-dist is installed.');
  }
}

/**
 * Extract text from DOCX using mammoth
 * Note: You'll need to install: npm install mammoth
 */
async function extractDocxText(file) {
  try {
    // Dynamic import
    const mammoth = await import('mammoth');
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    return result.value;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract DOCX content. Make sure mammoth is installed.');
  }
}

/**
 * Get supported file types for validation
 */
export function getSupportedFileTypes() {
  return {
    text: ['.txt', '.md', '.csv', '.json', '.xml', '.html', '.css', '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.c', '.cpp'],
    documents: ['.pdf', '.docx'],
    images: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'],
  };
}

/**
 * Check if file type is supported
 */
export function isFileSupported(file) {
  const supported = getSupportedFileTypes();
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  
  return (
    supported.text.includes(extension) ||
    supported.documents.includes(extension) ||
    supported.images.includes(extension) ||
    file.type.startsWith('text/') ||
    file.type.startsWith('image/')
  );
}

/**
 * Format file content for OpenAI prompt
 */
export function formatFileContentForPrompt(analyzedFiles, userMessage) {
  if (!analyzedFiles || analyzedFiles.length === 0) {
    return userMessage;
  }

  let prompt = userMessage + '\n\n';
  
  analyzedFiles.forEach((fileData, index) => {
    if (fileData.type === 'image') {
      // Images are handled separately in OpenAI API
      prompt += `[Image ${index + 1}: ${fileData.name}]\n`;
    } else {
      prompt += `--- Content of ${fileData.name} ---\n`;
      prompt += fileData.content;
      prompt += '\n--- End of ${fileData.name} ---\n\n';
    }
  });

  return prompt;
}

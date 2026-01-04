import React, { useState } from 'react';
import { analyzeFile, isFileSupported } from '../firebase/fileAnalysisService';

function ExampleFileUpload() {
  const [files, setFiles] = useState([]);
  const [analyzedFiles, setAnalyzedFiles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    // Validate file types
    const validFiles = selectedFiles.filter(file => isFileSupported(file));
    
    if (validFiles.length !== selectedFiles.length) {
      alert('Some files are not supported');
    }
    
    setFiles(validFiles);
  };

  const analyzeFiles = async () => {
    setIsAnalyzing(true);
    const analyzed = [];
    
    for (const file of files) {
      try {
        const fileData = await analyzeFile(file);
        analyzed.push(fileData);
      } catch {
        // Failed to analyze file
      }
    }
    
    setAnalyzedFiles(analyzed);
    setIsAnalyzing(false);
  };

  return (
    <div>
      <input 
        type="file" 
        multiple 
        onChange={handleFileSelect}
        accept=".txt,.pdf,.docx,.jpg,.png,.gif,.csv,.json,.js,.jsx,.ts,.tsx,.py"
      />
      
      <button onClick={analyzeFiles} disabled={isAnalyzing}>
        {isAnalyzing ? 'Analyzing...' : 'Analyze Files'}
      </button>
      
      {analyzedFiles.map((fileData, index) => (
        <div key={index}>
          <h3>{fileData.name}</h3>
          <p>{fileData.summary}</p>
          {fileData.type !== 'image' && (
            <pre>{fileData.content.substring(0, 200)}...</pre>
          )}
        </div>
      ))}
    </div>
  );
}

export default ExampleFileUpload;

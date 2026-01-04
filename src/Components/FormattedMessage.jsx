import React from 'react';

/**
 * FormattedMessage Component
 * Renders chat messages with proper formatting, preserving line breaks,
 * code blocks, and other formatting from AI responses
 */
function FormattedMessage({ content }) {
  // Parse content for better formatting
  const formatContent = (text) => {
    if (!text) return '';

    // Split by double newlines for paragraphs
    const paragraphs = text.split(/\n\n+/);
    
    return paragraphs.map((paragraph, index) => {
      // Check if it's a code block
      if (paragraph.includes('```')) {
        return (
          <pre
            key={index}
            className="bg-gray-100 p-3 rounded-lg my-2 overflow-x-auto text-xs font-mono"
          >
            <code>{paragraph.replace(/```/g, '')}</code>
          </pre>
        );
      }

      // Check if it's a bullet list
      if (paragraph.match(/^[-*•]\s/m)) {
        const items = paragraph.split('\n').filter(line => line.trim());
        return (
          <ul key={index} className="list-disc list-inside my-2 space-y-1">
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^[-*•]\s/, '')}</li>
            ))}
          </ul>
        );
      }

      // Check if it's a numbered list
      if (paragraph.match(/^\d+\.\s/m)) {
        const items = paragraph.split('\n').filter(line => line.trim());
        return (
          <ol key={index} className="list-decimal list-inside my-2 space-y-1">
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^\d+\.\s/, '')}</li>
            ))}
          </ol>
        );
      }

      // Check if it's a heading (starts with ### or ##)
      if (paragraph.match(/^#{1,3}\s/)) {
        const headingText = paragraph.replace(/^#{1,3}\s/, '');
        return (
          <h3 key={index} className="font-bold text-base my-2">
            {headingText}
          </h3>
        );
      }

      // Check if it's a separator line
      if (paragraph.match(/^[━═\-_]{3,}$/)) {
        return <hr key={index} className="my-2 border-gray-300" />;
      }

      // Regular paragraph with preserved line breaks
      const lines = paragraph.split('\n');
      return (
        <p key={index} className="my-2 leading-relaxed">
          {lines.map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };

  return (
    <div className="formatted-message">
      {formatContent(content)}
    </div>
  );
}

export default FormattedMessage;

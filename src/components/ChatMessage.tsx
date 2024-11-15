import React from 'react';
import { Bot, User } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface ChatMessageProps {
  message: {
    role: string;
    content: string;
  };
  darkMode: boolean;
}

export function ChatMessage({ message, darkMode }: ChatMessageProps) {
  const isBot = message.role === 'assistant';

  // Function to detect if text contains English characters
  const containsEnglish = (text: string) => /[a-zA-Z]/.test(text);

  // Function to detect and parse code blocks
  const parseContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index),
        });
      }

      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'plaintext',
        content: match[2],
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex),
      });
    }

    return parts;
  };

  const contentParts = parseContent(message.content);

  return (
    <div className={`flex gap-3 rounded-lg p-4 ${
      isBot 
        ? darkMode ? 'bg-gray-700/50' : 'bg-gray-50' 
        : 'bg-transparent'
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
        isBot 
          ? darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-500'
          : darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-500'
      }`}>
        {isBot ? <Bot size={24} /> : <User size={24} />}
      </div>
      <div className="flex-1">
        <div className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Vazirmatn' }}>
          {isBot ? 'دستیار هوشمند' : 'شما'}
        </div>
        <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {contentParts.map((part, index) => {
            if (part.type === 'code') {
              return (
                <CodeBlock
                  key={index}
                  code={part.content}
                  language={part.language}
                  darkMode={darkMode}
                />
              );
            } else {
              return (
                <div
                  key={index}
                  style={{ 
                    fontFamily: 'Vazirmatn',
                    direction: containsEnglish(part.content) ? 'ltr' : 'rtl',
                    textAlign: containsEnglish(part.content) ? 'left' : 'right'
                  }}
                >
                  {part.content}
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
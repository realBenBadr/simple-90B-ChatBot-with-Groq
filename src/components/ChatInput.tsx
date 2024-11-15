import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled: boolean;
  darkMode: boolean;
}

export function ChatInput({ onSendMessage, disabled, darkMode }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Function to detect if text contains English characters
  const containsEnglish = (text: string) => /[a-zA-Z]/.test(text);

  // Focus input on mount and when disabled state changes (after response)
  useEffect(() => {
    if (!disabled) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [disabled]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2" dir="rtl">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="پیام خود را اینجا بنویسید..."
        style={{ 
          fontFamily: 'Vazirmatn',
          direction: containsEnglish(message) ? 'ltr' : 'rtl',
          textAlign: containsEnglish(message) ? 'left' : 'right'
        }}
        className={`flex-1 resize-none overflow-hidden rounded-xl border p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
          darkMode 
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
        } disabled:opacity-50`}
        rows={1}
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className={`p-3 rounded-xl transition-colors ${
          darkMode
            ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700'
            : 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300'
        } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <Send size={20} />
      </button>
    </form>
  );
}
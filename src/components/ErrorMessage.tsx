import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  // Function to detect if text contains English characters
  const containsEnglish = (text: string) => /[a-zA-Z]/.test(text);
  const isEnglish = containsEnglish(message);

  return (
    <div 
      className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/50 dark:text-red-300 p-4 rounded-lg" 
      style={{ 
        fontFamily: 'Vazirmatn',
        direction: isEnglish ? 'ltr' : 'rtl',
        textAlign: isEnglish ? 'left' : 'right'
      }}
    >
      <AlertCircle size={20} className={isEnglish ? 'mr-0 ml-2' : 'ml-0 mr-2'} />
      <p>{message}</p>
    </div>
  );
}
import React, { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
  darkMode: boolean;
}

const SUPPORTED_LANGUAGES = {
  'js': 'javascript',
  'jsx': 'jsx',
  'ts': 'typescript',
  'tsx': 'tsx',
  'py': 'python',
  'css': 'css',
  'html': 'html',
  'json': 'javascript',
  'plaintext': 'javascript'
};

export function CodeBlock({ code, language, darkMode }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const normalizedLanguage = SUPPORTED_LANGUAGES[language.toLowerCase()] || 'javascript';

  return (
    <div className={`relative group rounded-lg overflow-hidden ${
      darkMode ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      <div className={`flex items-center justify-between px-4 py-2 ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <span className={`text-sm font-mono ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {normalizedLanguage}
        </span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1 px-2 py-1 rounded ${
            darkMode
              ? 'hover:bg-gray-600 text-gray-300'
              : 'hover:bg-gray-200 text-gray-600'
          } transition-colors`}
          aria-label={copied ? 'کپی شد' : 'کپی کد'}
        >
          {copied ? (
            <Check size={16} className="text-green-500" />
          ) : (
            <Copy size={16} />
          )}
          <span className="text-sm" style={{ fontFamily: 'Vazirmatn' }}>
            {copied ? 'کپی شد' : 'کپی'}
          </span>
        </button>
      </div>

      <div className="relative">
        <div className={`absolute right-0 top-0 bottom-0 w-12 flex flex-col items-center pt-4 text-xs font-mono ${
          darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100/50 text-gray-500'
        }`}>
          {code.split('\n').map((_, i) => (
            <div key={i} className="leading-6">{i + 1}</div>
          ))}
        </div>
        <pre
          ref={codeRef}
          className={`language-${normalizedLanguage} p-4 pr-16 overflow-x-auto ${
            darkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}
        >
          <code className={`language-${normalizedLanguage}`}>{code.trim()}</code>
        </pre>
      </div>
    </div>
  );
}
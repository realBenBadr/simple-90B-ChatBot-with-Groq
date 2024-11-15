export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sessionId: string;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
  messages: Message[];
}

export interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled: boolean;
  darkMode: boolean;
}

export interface ChatMessageProps {
  message: Message;
  darkMode: boolean;
}
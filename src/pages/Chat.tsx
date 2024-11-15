import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { ErrorMessage } from '../components/ErrorMessage';
import { Sidebar } from '../components/Sidebar';
import { Message, ChatSession } from '../types/chat';
import { Bot, Moon, Sun, LogOut } from 'lucide-react';
import { streamCompletion } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export function Chat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStreamedContent, setCurrentStreamedContent] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const { logout } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Auto-start new chat session on first render
  useEffect(() => {
    if (isFirstRender.current && sessions.length === 0) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: 'گفتگوی جدید',
        lastMessage: '',
        timestamp: Date.now(),
        messages: [],
      };
      setSessions([newSession]);
      setCurrentSession(newSession);
      isFirstRender.current = false;
    }
  }, [sessions.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, currentStreamedContent]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('خطا در خروج از حساب کاربری');
    }
  };

  const canCreateNewChat = () => {
    if (!currentSession) return true;
    return currentSession.messages.length > 0;
  };

  const handleNewChat = () => {
    if (!canCreateNewChat()) {
      setError('لطفاً ابتدا در گفتگوی فعلی پیامی ارسال کنید');
      return;
    }

    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'گفتگوی جدید',
      lastMessage: '',
      timestamp: Date.now(),
      messages: [],
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
    setError(null);
    setCurrentStreamedContent('');
  };

  const handleSelectSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
      setError(null);
      setCurrentStreamedContent('');
    }
  };

  const updateSessionTitle = (messages: Message[]) => {
    const userMessage = messages.find(m => m.role === 'user');
    if (userMessage) {
      return userMessage.content.slice(0, 30) + (userMessage.content.length > 30 ? '...' : '');
    }
    return 'گفتگوی جدید';
  };

  const handleSendMessage = async (content: string) => {
    if (!currentSession) return;
    
    setError(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
      sessionId: currentSession.id,
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
      lastMessage: content,
      timestamp: Date.now(),
    };

    setCurrentSession(updatedSession);
    setSessions(prev => 
      prev.map(s => s.id === currentSession.id ? updatedSession : s)
    );

    setIsLoading(true);
    setCurrentStreamedContent('');

    try {
      const chatMessages = updatedSession.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      console.log('Sending messages:', chatMessages);

      const stream = await streamCompletion(chatMessages);
      if (!stream) {
        throw new Error('No stream returned from API');
      }

      let accumulatedContent = '';
      for await (const chunk of stream) {
        console.log('Received chunk:', chunk);
        if (chunk) {
          accumulatedContent += chunk;
          setCurrentStreamedContent(accumulatedContent);
        }
      }

      if (!accumulatedContent) {
        throw new Error('No content received from the stream');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: accumulatedContent,
        timestamp: Date.now(),
        sessionId: currentSession.id,
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiMessage],
        title: updateSessionTitle([...updatedSession.messages, aiMessage]),
        lastMessage: accumulatedContent,
        timestamp: Date.now(),
      };

      setCurrentSession(finalSession);
      setSessions(prev =>
        prev.map(s => s.id === currentSession.id ? finalSession : s)
      );
      setCurrentStreamedContent('');
    } catch (error) {
      console.error('Chat error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        sessions={sessions}
        currentSessionId={currentSession?.id}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        darkMode={darkMode}
        canCreateNewChat={canCreateNewChat()}
      />

      <div className="transition-all duration-300">
        <div className="max-w-4xl mx-auto p-4">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Bot size={32} className="text-blue-500" />
              <h1 className="text-2xl font-bold dark:text-white" style={{ fontFamily: 'Vazirmatn' }}>
                دستیار هوش مصنوعی
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={darkMode ? 'روشن' : 'تاریک'}
              >
                {darkMode ? (
                  <Sun className="text-yellow-500" size={24} />
                ) : (
                  <Moon className="text-gray-600" size={24} />
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <LogOut size={20} />
                <span style={{ fontFamily: 'Vazirmatn' }}>خروج</span>
              </button>
            </div>
          </header>

          <main className={`rounded-xl shadow-lg transition-colors ${
            darkMode ? 'bg-gray-800 shadow-gray-700/30' : 'bg-white'
          }`}>
            <div className="space-y-4 p-4 min-h-[500px] max-h-[700px] overflow-y-auto">
              {!currentSession || currentSession.messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8" style={{ fontFamily: 'Vazirmatn' }}>
                  برای شروع گفتگو، پیام خود را در پایین وارد کنید.
                </div>
              ) : (
                <>
                  {currentSession.messages.map(message => (
                    <ChatMessage key={message.id} message={message} darkMode={darkMode} />
                  ))}
                  {currentStreamedContent && (
                    <ChatMessage
                      message={{
                        id: 'streaming',
                        role: 'assistant',
                        content: currentStreamedContent,
                        timestamp: Date.now(),
                        sessionId: currentSession.id,
                      }}
                      darkMode={darkMode}
                    />
                  )}
                </>
              )}
              {isLoading && !currentStreamedContent && (
                <div className="flex items-center justify-center text-gray-500 dark:text-gray-400" style={{ fontFamily: 'Vazirmatn' }}>
                  <div className="animate-pulse">در حال فکر کردن...</div>
                </div>
              )}
              {error && <ErrorMessage message={error} />}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t dark:border-gray-700 p-4">
              <ChatInput 
                onSendMessage={handleSendMessage} 
                disabled={isLoading || !currentSession} 
                darkMode={darkMode} 
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
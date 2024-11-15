import React from 'react';
import { MessageSquare, ChevronRight, PlusCircle } from 'lucide-react';
import { ChatSession } from '../types/chat';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  currentSessionId: string | undefined;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  darkMode: boolean;
  canCreateNewChat: boolean;
}

export function Sidebar({ 
  isOpen, 
  onToggle, 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onNewChat, 
  darkMode,
  canCreateNewChat 
}: SidebarProps) {
  return null;
}
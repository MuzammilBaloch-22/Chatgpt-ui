import { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatWindow } from '@/components/ChatWindow';
import { useChatStore } from '@/store/chatStore';

const Index = () => {
  const { toggleSidebar, toggleTheme, createChat } = useChatStore();

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K: New chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        createChat();
      }
      
      // Ctrl/Cmd + B: Toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
      
      // Ctrl/Cmd + Shift + L: Toggle theme
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'l') {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [toggleSidebar, toggleTheme, createChat]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default Index;

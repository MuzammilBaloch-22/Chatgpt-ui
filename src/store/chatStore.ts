import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

interface ChatStore {
  chats: Chat[];
  currentChatId: string | null;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  
  // Chat operations
  createChat: () => string;
  deleteChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  setCurrentChat: (id: string | null) => void;
  
  // Message operations
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (chatId: string, messageId: string, content: string) => void;
  clearMessages: (chatId: string) => void;
  
  // UI operations
  toggleSidebar: () => void;
  toggleTheme: () => void;
  
  // Import/Export
  exportChats: () => string;
  importChats: (data: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChatId: null,
      sidebarCollapsed: false,
      theme: 'dark',

      createChat: () => {
        const newChat: Chat = {
          id: `chat-${Date.now()}`,
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: newChat.id,
        }));
        
        return newChat.id;
      },

      deleteChat: (id) => {
        set((state) => {
          const newChats = state.chats.filter((chat) => chat.id !== id);
          const newCurrentId = state.currentChatId === id 
            ? (newChats[0]?.id || null) 
            : state.currentChatId;
          
          return {
            chats: newChats,
            currentChatId: newCurrentId,
          };
        });
      },

      renameChat: (id, title) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === id
              ? { ...chat, title, updatedAt: Date.now() }
              : chat
          ),
        }));
      },

      setCurrentChat: (id) => {
        set({ currentChatId: id });
      },

      addMessage: (chatId, message) => {
        const newMessage: Message = {
          ...message,
          id: `msg-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
        };

        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id === chatId) {
              const updatedChat = {
                ...chat,
                messages: [...chat.messages, newMessage],
                updatedAt: Date.now(),
              };
              
              // Auto-generate title from first user message
              if (chat.messages.length === 0 && message.role === 'user') {
                updatedChat.title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
              }
              
              return updatedChat;
            }
            return chat;
          }),
        }));
      },

      updateMessage: (chatId, messageId, content) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, content } : msg
                  ),
                  updatedAt: Date.now(),
                }
              : chat
          ),
        }));
      },

      clearMessages: (chatId) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [],
                  title: 'New Chat',
                  updatedAt: Date.now(),
                }
              : chat
          ),
        }));
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
          return { theme: newTheme };
        });
      },

      exportChats: () => {
        const { chats } = get();
        return JSON.stringify({ chats, version: '1.0' }, null, 2);
      },

      importChats: (data) => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.chats && Array.isArray(parsed.chats)) {
            set({ chats: parsed.chats });
          }
        } catch (error) {
          console.error('Failed to import chats:', error);
        }
      },
    }),
    {
      name: 'chatgpt-clone-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
        }
      },
    }
  )
);

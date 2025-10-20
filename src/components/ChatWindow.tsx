import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Message } from '@/components/Message';
import { Composer } from '@/components/Composer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2, MessageSquare } from 'lucide-react';

export const ChatWindow = () => {
  const { chats, currentChatId, addMessage, clearMessages, createChat, updateMessage } = useChatStore();
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentChat = chats.find(chat => chat.id === currentChatId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentChat?.messages, isStreaming]);

  const streamResponse = async (prompt: string, chatId: string) => {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey || apiKey === '-------------------') {
      addMessage(chatId, {
        role: 'assistant',
        content: '⚠️ OpenRouter API key not configured. Please add your API key to the .env file as VITE_OPENROUTER_API_KEY.',
      });
      return;
    }

    setIsStreaming(true);
    const tempMessageId = `msg-${Date.now()}-${Math.random()}`;
    setStreamingMessageId(tempMessageId);
    addMessage(chatId, { role: 'assistant', content: '' });

    try {
      const messages = currentChat?.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })) || [];

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [...messages, { role: 'user', content: prompt }],
          stream: true,
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      if (!reader) throw new Error('No response body');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));

        for (const line of lines) {
          const data = line.replace('data: ', '').trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              accumulatedContent += content;
              const chat = chats.find(c => c.id === chatId);
              if (chat) {
                const lastMessage = chat.messages[chat.messages.length - 1];
                if (lastMessage?.role === 'assistant') {
                  updateMessage(chatId, lastMessage.id, accumulatedContent);
                }
              }
            }
          } catch {}
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        const lastMessage = chat.messages[chat.messages.length - 1];
        if (lastMessage?.role === 'assistant') {
          updateMessage(chatId, lastMessage.id, '❌ Failed to get response. Please check your API key and try again.');
        }
      }
    } finally {
      setIsStreaming(false);
      setStreamingMessageId(null);
    }
  };

  const handleSend = async (message: string) => {
    let chatId = currentChatId;
    if (!chatId) chatId = createChat();

    addMessage(chatId, { role: 'user', content: message });
    await streamResponse(message, chatId);
  };

  const handleClearChat = () => {
    if (currentChatId && confirm('Clear all messages in this chat?')) {
      clearMessages(currentChatId);
    }
  };

  if (!currentChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#343541] text-white">
        <MessageSquare className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Start a New Conversation</h2>
        <p className="text-gray-400 mb-6">Create a new chat to get started</p>
        <Button onClick={() => createChat()} className="bg-[#40414f] hover:bg-[#4a4b5a] text-white rounded-lg">
          New Chat
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#343541] text-white">
      {/* Header */}
      <div className="border-b border-[#40414f] px-4 py-3 flex items-center justify-between bg-[#40414f]">
        <h2 className="font-medium text-gray-200 truncate">{currentChat.title}</h2>
        {currentChat.messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className="gap-2 hover:bg-[#3b3c4a] hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-[#343541]">
        {currentChat.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center max-w-2xl mx-auto">
            <div>
              <h1 className="text-4xl font-bold mb-4">How can I help you today?</h1>
              <p className="text-gray-400">Ask me anything, and I’ll do my best to help.</p>
            </div>
          </div>
        ) : (
          currentChat.messages.map((message, index) => (
            <Message
              key={message.id}
              message={message}
              isStreaming={
                isStreaming &&
                index === currentChat.messages.length - 1 &&
                message.role === 'assistant'
              }
            />
          ))
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-[#40414f] bg-[#40414f] px-4 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.2)]">
        <Composer onSend={handleSend} disabled={isStreaming} />
      </div>
    </div>
  );
};

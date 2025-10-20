import { useState } from 'react';
import { MessageSquarePlus, Search, Menu, Sun, Moon, Download, Upload, Trash2, Edit2, Check, X } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export const Sidebar = () => {
  const { 
    chats, 
    currentChatId, 
    sidebarCollapsed, 
    theme,
    createChat, 
    deleteChat, 
    renameChat, 
    setCurrentChat,
    toggleSidebar,
    toggleTheme,
    exportChats,
    importChats,
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => createChat();

  const handleExport = () => {
    const data = exportChats();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chatgpt-clone-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result as string;
        importChats(data);
      };
      reader.readAsText(file);
    }
  };

  const startEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const saveEdit = () => {
    if (editingId && editTitle.trim()) renameChat(editingId, editTitle.trim());
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  if (sidebarCollapsed) {
    return (
      <div className="w-12 bg-black border-r border-gray-700 flex flex-col items-center py-2 gap-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hover:bg-gray-800">
          <Menu className="h-5 w-5 text-white" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleNewChat} className="hover:bg-gray-800">
          <MessageSquarePlus className="h-5 w-5 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-black border-r border-gray-700 flex flex-col h-screen text-white">
      {/* Header */}
      <div className="p-2 border-b border-gray-800 flex flex-col gap-2">
        {/* GPT Logo */}
        <div className="flex items-center pl-2 py-2">
          <img 
            src="https://freelogopng.com/images/all_img/1681039084chatgpt-icon.png" 
            alt="GPT Logo" 
            className="h-10 w-10"
          />
          <span className="ml-2 font-bold text-lg"></span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hover:bg-gray-800">
            <Menu className="h-5 w-5 text-white" />
          </Button>
          <Button onClick={handleNewChat} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white gap-2">
            <MessageSquarePlus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-gray-900 border-gray-700 rounded-md text-white"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`group relative rounded-lg p-3 cursor-pointer transition-colors ${
                currentChatId === chat.id ? 'bg-gray-800' : 'hover:bg-gray-700'
              }`}
              onClick={() => setCurrentChat(chat.id)}
            >
              {editingId === chat.id ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="h-6 text-sm text-black"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); saveEdit(); }}>
                    <Check className="h-3 w-3 text-white" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); cancelEdit(); }}>
                    <X className="h-3 w-3 text-white" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="text-sm truncate pr-12">{chat.title}</div>
                  <div className="absolute right-2 top-2 hidden group-hover:flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-800" onClick={(e) => { e.stopPropagation(); startEdit(chat.id, chat.title); }}>
                      <Edit2 className="h-3 w-3 text-white" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-red-700 hover:text-white" onClick={(e) => { e.stopPropagation(); if(confirm('Delete this chat?')) deleteChat(chat.id); }}>
                      <Trash2 className="h-3 w-3 text-white" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t border-gray-800 space-y-1">
        <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-gray-800" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-gray-800" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export Chats
        </Button>
        <label>
          <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-gray-800" asChild>
            <span>
              <Upload className="h-4 w-4" />
              Import Chats
            </span>
          </Button>
          <input type="file" accept=".json" className="hidden" onChange={handleImport} />
        </label>
      </div>
    </div>
  );
};

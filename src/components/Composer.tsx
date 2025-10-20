import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ComposerProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const Composer = ({ onSend, disabled }: ComposerProps) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [input]);

  return (
    <div className="border-t border-[#40414f] bg-[#343541]">
      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Input Container */}
        <div className="relative flex items-end gap-2 bg-[#40414f] border border-[#565869] rounded-2xl px-4 py-2 shadow-[0_0_10px_rgba(0,0,0,0.3)] focus-within:border-[#10a37f] transition-colors">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message ChatGPT..."
            disabled={disabled}
            className="min-h-[44px] max-h-[200px] resize-none flex-1 border-0 bg-transparent text-gray-100 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={1}
          />

          {/* Send Button */}
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || disabled}
            size="icon"
            className={`h-10 w-10 flex-shrink-0 rounded-lg transition-colors ${
              !input.trim() || disabled
                ? 'bg-[#565869] cursor-not-allowed opacity-60'
                : 'bg-[#10a37f] hover:bg-[#19c37d]'
            }`}
          >
            <Send className="h-4 w-4 text-white" />
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-400 text-center mt-3">
          ChatGPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};

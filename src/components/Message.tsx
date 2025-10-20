import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Copy, Check, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message as MessageType } from '@/store/chatStore';

interface MessageProps {
  message: MessageType;
  isStreaming?: boolean;
}

export const Message = ({ message, isStreaming }: MessageProps) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`w-full ${
        isUser ? 'bg-[#343541]' : 'bg-[#444654]'
      } transition-colors duration-200 py-6 border-b border-[#3e3f4b]`}
    >
      <div className="max-w-3xl mx-auto px-4 flex gap-4">
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center text-white ${
            isUser ? 'bg-[#19c37d]' : 'bg-[#10a37f]'
          }`}
        >
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2 text-gray-100 leading-relaxed">
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="relative group my-2">
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg !bg-[#2f3136] !text-gray-100 !p-4 text-sm font-mono"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>

                      {/* Copy Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-[#3a3b45]/60 hover:bg-[#3a3b45] rounded-md"
                        onClick={() =>
                          navigator.clipboard.writeText(String(children))
                        }
                      >
                        <Copy className="h-4 w-4 text-gray-300" />
                      </Button>
                    </div>
                  ) : (
                    <code className="bg-[#2f3136] px-1.5 py-0.5 rounded text-gray-200 text-sm">
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>

            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-gray-300 animate-pulse ml-1 rounded-sm align-middle" />
            )}
          </div>

          {/* Actions */}
          {!isUser && !isStreaming && (
            <div className="flex gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-gray-400 hover:text-white hover:bg-[#3a3b45]"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

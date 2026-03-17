'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Bot, User, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (msg: string) => void;
  isFileUploaded: boolean;
}

export default function ChatWindow({ messages, isTyping, onSendMessage, isFileUploaded }: ChatWindowProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!isFileUploaded) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4 text-center px-8"
        >
          <div className="w-24 h-24 rounded-[2rem] bg-card border border-border flex items-center justify-center shadow-sm">
            <FileText className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold">No Document Uploaded</h2>
          <p className="text-muted-foreground max-w-sm">
            Please upload a PDF document from the sidebar to start extracting insights.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto pb-32 pt-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-4 text-center px-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Document Ready!</h2>
              <p className="text-muted-foreground max-w-sm">
                Your document has been processed. Ask me any question about its contents, and I&apos;ll find the most relevant information for you.
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1
                    ${msg.role === 'user'
                      ? 'bg-primary'
                      : 'bg-card border border-border'
                    }`}>
                    {msg.role === 'user'
                      ? <User className="w-4 h-4 text-white" />
                      : <Bot className="w-4 h-4 text-primary" />
                    }
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed
                    ${msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-[4px]'
                      : 'bg-card border border-border text-foreground rounded-2xl rounded-tl-[4px] shadow-sm'
                    }`}>
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <div className="prose prose-sm max-w-none prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-tl-[4px] px-4 py-3 shadow-sm flex items-center gap-1.5">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay }}
                        className={`w-2 h-2 rounded-full ${
                          i === 0 ? 'bg-primary/40' : i === 1 ? 'bg-primary/60' : 'bg-primary'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-16 bg-gradient-to-t from-background via-background to-background/0">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your document..."
              className="w-full bg-card border border-border rounded-xl pl-5 pr-14 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white w-9 h-9 rounded-lg flex items-center justify-center active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-foreground/50 text-center mt-2">
            Intel Doc uses keyword matching. Results are based on document contents.
          </p>
        </div>
      </div>
    </div>
  );
}

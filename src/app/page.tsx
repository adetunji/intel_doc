'use client';

import { useState } from 'react';
import UploadZone from '@/components/upload-zone';
import ChatWindow from '@/components/chat-window';
import { extractTextFromPDF, chunkText, searchChunks } from '@/lib/pdf-utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [documentChunks, setDocumentChunks] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  async function handleFileSelect(selectedFile: File) {
    setFile(selectedFile);
    setMessages([]);
    try {
      const text = await extractTextFromPDF(selectedFile);
      const chunks = chunkText(text, 1000);
      setDocumentChunks(chunks);
    } catch (err) {
      alert('Failed to extract text from the PDF. Please try another file.');
      console.error(err);
    }
  }

  function handleSendMessage(content: string) {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const response = searchChunks(documentChunks, content);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  }

  return (
    <main className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      <UploadZone onFileSelect={handleFileSelect} selectedFile={file} />
      <ChatWindow
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        isFileUploaded={!!file}
      />
    </main>
  );
}

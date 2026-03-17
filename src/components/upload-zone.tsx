'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, UploadCloud, CheckCircle2 } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export default function UploadZone({ onFileSelect, selectedFile }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are accepted.');
      return;
    }
    onFileSelect(file);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave() {
    setIsDragging(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="w-80 shrink-0 bg-card border-r border-border shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-semibold">Intel Doc</span>
        </div>
        <p className="text-sm text-foreground/70">
          Upload your PDF document to start analyzing and chatting.
        </p>
      </div>

      {/* Upload Area */}
      <div className="p-5 flex-1">
        <motion.div
          animate={{ scale: isDragging ? 1.02 : 1 }}
          transition={{ duration: 0.15 }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !selectedFile && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors
            ${isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
            }
            ${selectedFile ? 'cursor-default' : ''}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={onInputChange}
          />

          {!selectedFile ? (
            <>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <UploadCloud className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Click or drag PDF</p>
                <p className="text-xs text-muted-foreground mt-1">Max file size 50MB</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded-lg shadow hover:bg-primary/90 active:scale-95 transition-all"
              >
                Select File
              </button>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center px-4">
                <p className="text-sm font-medium truncate max-w-[200px]" title={selectedFile.name}>
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </>
          )}
        </motion.div>

        {selectedFile && (
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-3 text-sm text-primary hover:underline w-full text-center"
          >
            Upload a different file
          </button>
        )}
      </div>
    </div>
  );
}

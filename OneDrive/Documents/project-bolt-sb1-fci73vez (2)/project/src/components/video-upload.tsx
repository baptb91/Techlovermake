import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useVideoStore } from '../store/video-store';
import { cn } from '../lib/utils';

export function VideoUpload() {
  const { setVideoFile } = useVideoStore();

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    }
  }, [setVideoFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    }
  }, [setVideoFile]);

  return (
    <div
      className={cn(
        "relative w-full h-full rounded-xl border-2 border-dashed",
        "border-gray-400 bg-gray-900/50 backdrop-blur-sm",
        "flex flex-col items-center justify-center",
        "transition-colors duration-200",
        "hover:border-cyan-400 hover:bg-gray-900/60"
      )}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <Upload className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-gray-400 text-center">
        Drag and drop your video here<br />
        or click to browse
      </p>
    </div>
  );
}
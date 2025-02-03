import { create } from 'zustand';

interface VideoState {
  videoFile: File | null;
  processedVideoUrl: string | null;
  isProcessing: boolean;
  setVideoFile: (file: File | null) => void;
  setProcessedVideoUrl: (url: string | null) => void;
  setIsProcessing: (processing: boolean) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  videoFile: null,
  processedVideoUrl: null,
  isProcessing: false,
  setVideoFile: (file) => set({ videoFile: file }),
  setProcessedVideoUrl: (url) => set({ processedVideoUrl: url }),
  setIsProcessing: (processing) => set({ isProcessing: processing }),
}));
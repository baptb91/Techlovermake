import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, Heart } from 'lucide-react';
import { useVideoStore } from '../store/video-store';
import { VideoUpload } from './video-upload';
import { processVideo } from '../lib/process-video';

export function InstagramReelMockup() {
  const [isFollowing, setIsFollowing] = useState(false);
  const { videoFile, processedVideoUrl, isProcessing, setProcessedVideoUrl, setIsProcessing } = useVideoStore();

  const handleExport = async () => {
    if (!videoFile) return;
    
    try {
      setIsProcessing(true);
      const processedUrl = await processVideo(videoFile);
      setProcessedVideoUrl(processedUrl);
    } catch (error) {
      console.error('Error processing video:', error);
      alert(error instanceof Error ? error.message : 'Une erreur est survenue lors du traitement de la vidéo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedVideoUrl) return;
    
    try {
      const link = document.createElement('a');
      link.href = processedVideoUrl;
      link.download = 'instagram-reel.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading video:', error);
      alert('Une erreur est survenue lors du téléchargement de la vidéo');
    }
  };

  const handleFollow = () => {
    setIsFollowing(true);
    setTimeout(() => setIsFollowing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f0f1f] flex items-center justify-center p-8">
      <div className="w-[360px] h-[640px] bg-gradient-to-b from-[#121232] to-[#090915] relative overflow-hidden shadow-2xl rounded-2xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="absolute w-[120%] h-[120%] bg-gradient-to-r from-cyan-400 to-purple-500 opacity-10 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute w-[90%] h-[90%] border-4 border-cyan-500 rounded-full opacity-20"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative w-full h-full flex flex-col">
          <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-center">
            <span className="text-white text-xl font-bold tracking-wide">Tech Lover</span>
          </div>

          {/* Animation du bouton Follow */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 5
            }}
            className="absolute top-20 right-0 z-20"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFollow}
              className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 rounded-l-full flex items-center gap-2 shadow-lg"
            >
              <span className="text-white font-medium">Follow &lt;3</span>
              <AnimatePresence>
                {isFollowing && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-green-500 rounded-l-full"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Heart className="w-5 h-5 text-white fill-current" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          <div className="flex-1 relative flex items-center justify-center p-6">
            <div className="w-[85%] h-[85%] relative rounded-lg overflow-hidden">
              {videoFile || processedVideoUrl ? (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src={processedVideoUrl || URL.createObjectURL(videoFile)}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <VideoUpload />
              )}
            </div>
          </div>

          {videoFile && (
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-2">
              {!processedVideoUrl && (
                <button
                  onClick={handleExport}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    'Traiter la vidéo'
                  )}
                </button>
              )}
              {processedVideoUrl && (
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium flex items-center gap-2 hover:opacity-90"
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
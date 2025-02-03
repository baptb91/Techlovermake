import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import path from 'path';

let ffmpeg = null;

async function initFFmpeg() {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();
  
  // En production (Render), on utilise le chemin système de FFmpeg
  if (process.env.NODE_ENV === 'production') {
    ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');
  } else {
    // En développement, on utilise la version WASM
    await ffmpeg.load({
      coreURL: await toBlobURL('/node_modules/@ffmpeg/core/dist/ffmpeg-core.js', 'text/javascript'),
      wasmURL: await toBlobURL('/node_modules/@ffmpeg/core/dist/ffmpeg-core.wasm', 'application/wasm'),
    });
  }

  return ffmpeg;
}

export async function processVideoAPI(videoBuffer) {
  const ffmpeg = await initFFmpeg();
  
  // Écrire le fichier d'entrée
  const inputPath = 'input.mp4';
  const outputPath = 'output.mp4';
  
  await ffmpeg.writeFile(inputPath, new Uint8Array(videoBuffer));
  
  // Traiter la vidéo
  await ffmpeg.exec([
    '-i', inputPath,
    '-vf', 'scale=918:1632:force_original_aspect_ratio=decrease,pad=918:1632:(ow-iw)/2:(oh-ih)/2',
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '23',
    outputPath
  ]);
  
  // Lire le fichier traité
  const data = await ffmpeg.readFile(outputPath);
  return Buffer.from(data);
}
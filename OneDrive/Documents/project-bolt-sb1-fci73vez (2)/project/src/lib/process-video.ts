import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export async function initFFmpeg() {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();
  
  // Load FFmpeg
  await ffmpeg.load({
    coreURL: await toBlobURL('/node_modules/@ffmpeg/core/dist/ffmpeg-core.js', 'text/javascript'),
    wasmURL: await toBlobURL('/node_modules/@ffmpeg/core/dist/ffmpeg-core.wasm', 'application/wasm'),
  });

  return ffmpeg;
}

export async function processVideo(videoFile: File): Promise<string> {
  try {
    // First check if the API is available
    try {
      const healthCheck = await fetch('http://localhost:3000/api/health');
      if (!healthCheck.ok) {
        throw new Error('Le serveur API n\'est pas démarré. Veuillez lancer `npm run start:api`');
      }
    } catch (error) {
      throw new Error('Le serveur API n\'est pas démarré. Veuillez lancer `npm run start:api`');
    }

    const formData = new FormData();
    formData.append('video', videoFile);

    const response = await fetch('http://localhost:3000/api/process', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
      throw new Error(errorData.error || 'Échec du traitement de la vidéo');
    }

    // Vérifier que nous avons bien reçu une vidéo
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('video/mp4')) {
      throw new Error('Le serveur n\'a pas renvoyé une vidéo valide');
    }

    const blob = await response.blob();
    if (blob.size === 0) {
      throw new Error('La vidéo traitée est vide');
    }

    return URL.createObjectURL(blob);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erreur lors du traitement de la vidéo:', error.message);
      throw new Error(error.message);
    }
    console.error('Erreur lors du traitement de la vidéo:', error);
    throw new Error('Une erreur inattendue s\'est produite lors du traitement de la vidéo');
  }
}
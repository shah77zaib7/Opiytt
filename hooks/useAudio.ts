
import { useCallback } from 'react';

export const useAudio = (url: string) => {
  const play = useCallback(() => {
    const audio = new Audio(url);
    audio.play().catch(e => console.warn('Audio play failed:', e));
  }, [url]);

  return play;
};

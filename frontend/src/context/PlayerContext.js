import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { songService } from '../services/api';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [streamUrl, setStreamUrl] = useState(null);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDuration = () => setDuration(audio.duration);
    const onEnded = () => playNext();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onDuration);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [queue, queueIndex]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const playSong = async (song, songQueue = [], index = 0) => {
    setCurrentSong(song);
    if (songQueue.length > 0) { setQueue(songQueue); setQueueIndex(index); }

    try {
      const res = await songService.getStreamUrl(song.id);
      const url = res.data.data;
      if (url) {
        audioRef.current.src = url;
        setStreamUrl(url);
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        // No MinIO file — just show the song as "selected" without audio
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!streamUrl) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); }
  };

  const playNext = () => {
    if (queue.length === 0) return;
    const next = (queueIndex + 1) % queue.length;
    setQueueIndex(next);
    playSong(queue[next], queue, next);
  };

  const playPrev = () => {
    if (queue.length === 0) return;
    const prev = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prev);
    playSong(queue[prev], queue, prev);
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  return (
    <PlayerContext.Provider value={{
      currentSong, isPlaying, progress, duration, volume,
      playSong, togglePlay, playNext, playPrev, seek, setVolume
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);

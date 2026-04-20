import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import './PlayerBar.css';

const fmt = (s) => {
  if (!s || isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);
const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);
const PrevIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
  </svg>
);
const NextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 3.9V8.1L8.5 12zM16 6h2v12h-2z"/>
  </svg>
);
const VolumeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
  </svg>
);

export default function PlayerBar() {
  const { currentSong, isPlaying, progress, duration, volume,
          togglePlay, playNext, playPrev, seek, setVolume } = usePlayer();

  const pct = duration ? (progress / duration) * 100 : 0;
  const volPct = volume * 100;

  return (
    <div className="player-bar">
      {/* Left: Song info */}
      <div className="player-left">
        {currentSong ? (
          <>
            <div className="player-cover">
              {currentSong.artist?.imageUrl
                ? <img src={currentSong.artist.imageUrl} alt="" />
                : <div className="player-cover-ph">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#555">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  </div>
              }
            </div>
            <div className="player-song-info">
              <span className="player-title">{currentSong.title}</span>
              <span className="player-artist">{currentSong.artist?.name || '—'}</span>
            </div>
          </>
        ) : (
          <div className="player-empty">Sélectionnez un titre</div>
        )}
      </div>

      {/* Center: Controls */}
      <div className="player-center">
        <div className="ctrl-btns">
          <button className="ctrl-btn" onClick={playPrev}><PrevIcon /></button>
          <button className="ctrl-btn play-btn" onClick={togglePlay}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="ctrl-btn" onClick={playNext}><NextIcon /></button>
        </div>
        <div className="progress-row">
          <span className="time-label">{fmt(progress)}</span>
          <div className="progress-track" onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            seek(ratio * duration);
          }}>
            <div className="progress-fill" style={{ width: `${pct}%` }} />
            <div className="progress-thumb" style={{ left: `${pct}%` }} />
          </div>
          <span className="time-label">{fmt(duration)}</span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="player-right">
        <VolumeIcon />
        <div className="volume-track" onClick={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          setVolume((e.clientX - rect.left) / rect.width);
        }}>
          <div className="volume-fill" style={{ width: `${volPct}%` }} />
          <div className="volume-thumb" style={{ left: `${volPct}%` }} />
        </div>
      </div>
    </div>
  );
}

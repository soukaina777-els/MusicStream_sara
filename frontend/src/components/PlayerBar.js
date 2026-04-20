import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import './PlayerBar.css';

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function PlayerBar() {
  const { currentSong, isPlaying, progress, duration, volume,
          togglePlay, playNext, playPrev, seek, setVolume } = usePlayer();

  if (!currentSong) return (
    <div className="player-bar player-bar--empty">
      <p>Sélectionnez une chanson pour commencer</p>
    </div>
  );

  return (
    <div className="player-bar">
      {/* Song info */}
      <div className="player-song-info">
        <div className="player-cover">
          {currentSong.artist?.imageUrl
            ? <img src={currentSong.artist.imageUrl} alt="" />
            : <div className="player-cover-placeholder">♪</div>
          }
        </div>
        <div className="player-meta">
          <span className="player-title">{currentSong.title}</span>
          <span className="player-artist">{currentSong.artist?.name || 'Artiste inconnu'}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="player-controls">
        <div className="player-buttons">
          <button className="ctrl-btn" onClick={playPrev} title="Précédent">⏮</button>
          <button className="ctrl-btn play-btn" onClick={togglePlay}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="ctrl-btn" onClick={playNext} title="Suivant">⏭</button>
        </div>
        <div className="player-progress">
          <span className="time">{formatTime(progress)}</span>
          <input
            type="range"
            className="progress-bar"
            min="0"
            max={duration || 0}
            value={progress}
            onChange={e => seek(Number(e.target.value))}
          />
          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="player-volume">
        <span>🔊</span>
        <input
          type="range"
          className="volume-bar"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

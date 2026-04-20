import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import './SongCard.css';

export default function SongCard({ song, queue = [], index = 0, onAddToPlaylist }) {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const isActive = currentSong?.id === song.id;

  return (
    <div className={`song-card ${isActive ? 'song-card--active' : ''}`}>
      <div className="song-card-cover" onClick={() => playSong(song, queue, index)}>
        {song.artist?.imageUrl
          ? <img src={song.artist.imageUrl} alt="" />
          : <div className="song-card-placeholder">♪</div>
        }
        <div className="song-card-overlay">
          <button className="song-play-btn">
            {isActive && isPlaying ? '⏸' : '▶'}
          </button>
        </div>
      </div>
      <div className="song-card-info">
        <p className="song-card-title" title={song.title}>{song.title}</p>
        <p className="song-card-artist">{song.artist?.name || 'Artiste inconnu'}</p>
        <div className="song-card-meta">
          <span className="song-genre">{song.genre}</span>
          {song.playCount != null && (
            <span className="song-plays">▶ {song.playCount.toLocaleString()}</span>
          )}
        </div>
      </div>
      {onAddToPlaylist && (
        <button className="add-playlist-btn" onClick={() => onAddToPlaylist(song)} title="Ajouter à une playlist">
          +
        </button>
      )}
    </div>
  );
}

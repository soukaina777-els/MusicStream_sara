import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import './SongCard.css';

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);
const PauseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

export default function SongCard({ song, queue = [], index = 0, onAddToPlaylist }) {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const isActive = currentSong?.id === song.id;

  return (
    <div className={`song-card ${isActive ? 'song-card--active' : ''}`}>
      <div className="song-card-img">
        {song.artist?.imageUrl
          ? <img src={song.artist.imageUrl} alt="" />
          : <div className="song-card-img-ph">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#535353">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
        }
        <button
          className="song-card-play"
          onClick={() => playSong(song, queue, index)}
        >
          {isActive && isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
      <div className="song-card-body">
        <p className={`song-card-title ${isActive ? 'playing' : ''}`}>{song.title}</p>
        <p className="song-card-sub">{song.artist?.name || 'Artiste inconnu'}</p>
      </div>
      {onAddToPlaylist && (
        <button className="song-card-add" onClick={e => { e.stopPropagation(); onAddToPlaylist(song); }} title="Ajouter à une playlist">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
      )}
    </div>
  );
}

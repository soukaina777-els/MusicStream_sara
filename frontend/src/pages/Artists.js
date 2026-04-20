import React, { useEffect, useState } from 'react';
import { artistService } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import './Pages.css';

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [songs, setSongs] = useState([]);
  const { playSong, currentSong, isPlaying } = usePlayer();

  useEffect(() => {
    artistService.getAll().then(r => setArtists(r.data.data || [])).catch(() => {});
  }, []);

  const select = async (a) => {
    setSelected(a);
    try { const r = await artistService.getSongs(a.id); setSongs(r.data.data || []); }
    catch { setSongs([]); }
  };

  if (selected) return (
    <div style={{minHeight:'100%'}}>
      <button className="back-btn" onClick={() => { setSelected(null); setSongs([]); }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>

      <div className="artist-detail-header">
        <div className="artist-detail-avatar">
          {selected.imageUrl
            ? <img src={selected.imageUrl} alt="" />
            : <div className="artist-avatar-ph">🎤</div>
          }
        </div>
        <div className="artist-detail-info">
          <span>Artiste</span>
          <h1>{selected.name}</h1>
          {selected.totalPlayCount != null && (
            <p>{selected.totalPlayCount.toLocaleString()} auditeurs mensuels</p>
          )}
        </div>
      </div>

      <div style={{padding:'24px 32px'}}>
        <h2 className="section-subtitle" style={{marginBottom:'16px'}}>Titres populaires</h2>
        {songs.length === 0 ? (
          <div className="empty-state">
            <p>Aucun titre disponible</p>
          </div>
        ) : (
          <div className="track-list">
            <div className="track-list-header">
              <span>#</span>
              <span style={{gridColumn:'2/4'}}>Titre</span>
              <span>Écoutes</span>
              <span />
            </div>
            {songs.map((song, i) => {
              const isActive = currentSong?.id === song.id;
              return (
                <div
                  key={song.id}
                  className={`track-row ${isActive ? 'active' : ''}`}
                  onClick={() => playSong(song, songs, i)}
                >
                  <span className={`track-num ${isActive && isPlaying ? 'playing' : ''}`}>
                    {isActive && isPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#1db954">
                        <rect x="3" y="3" width="4" height="18" rx="1"/>
                        <rect x="10" y="3" width="4" height="18" rx="1"/>
                        <rect x="17" y="3" width="4" height="18" rx="1"/>
                      </svg>
                    ) : i + 1}
                  </span>
                  <div className="track-thumb">
                    {song.artist?.imageUrl ? <img src={song.artist.imageUrl} alt="" /> :
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#535353"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>}
                  </div>
                  <div className="track-info">
                    <span className={`track-name ${isActive ? 'playing' : ''}`}>{song.title}</span>
                    <span className="track-artist">{song.genre}</span>
                  </div>
                  <span className="track-plays">{(song.playCount || 0).toLocaleString()}</span>
                  <span />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="artists-page">
      <h1 className="section-subtitle" style={{marginBottom:'24px'}}>Artistes</h1>
      <div className="artist-grid">
        {artists.map(a => (
          <div key={a.id} className="artist-card" onClick={() => select(a)}>
            <div className="artist-card-avatar">
              {a.imageUrl
                ? <img src={a.imageUrl} alt="" />
                : <div className="artist-card-avatar-ph">🎤</div>
              }
            </div>
            <div className="artist-card-name">{a.name}</div>
            <div className="artist-card-label">Artiste</div>
          </div>
        ))}
      </div>
    </div>
  );
}

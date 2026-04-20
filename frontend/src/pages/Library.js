import React, { useEffect, useState } from 'react';
import { playlistService } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import './Pages.css';

export default function Library() {
  const [playlists, setPlaylists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const { playSong, currentSong, isPlaying } = usePlayer();

  const load = async () => {
    try { const r = await playlistService.getAll(); setPlaylists(r.data.data || []); }
    catch { setPlaylists([]); }
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!newName.trim()) return;
    await playlistService.create(newName);
    setNewName(''); setShowModal(false); load();
  };

  const remove = async (plId, songId) => {
    await playlistService.removeSong(plId, songId);
    load();
    const r = await playlistService.getAll();
    const updated = (r.data.data || []).find(p => p.id === plId);
    setSelected(updated);
  };

  if (selected) {
    const songs = selected.songs || [];
    return (
      <div className="library-page">
        <button className="back-btn" onClick={() => setSelected(null)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>

        <div className="playlist-detail-header">
          <div className="playlist-detail-cover">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="#535353">
              <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
            </svg>
          </div>
          <div className="playlist-detail-info">
            <span>Playlist</span>
            <h1>{selected.name}</h1>
            <p>{songs.length} titre{songs.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div style={{ padding: '24px 32px' }}>
          {songs.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
              <p>Cette playlist est vide</p>
              <span>Ajoutez des titres depuis le catalogue</span>
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
                  <div key={song.id} className={`track-row ${isActive ? 'active' : ''}`}>
                    <span className={`track-num ${isActive && isPlaying ? 'playing' : ''}`}>
                      {isActive && isPlaying ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#1db954">
                          <rect x="3" y="3" width="4" height="18" rx="1"/>
                          <rect x="10" y="3" width="4" height="18" rx="1"/>
                          <rect x="17" y="3" width="4" height="18" rx="1"/>
                        </svg>
                      ) : i + 1}
                    </span>
                    <div className="track-thumb" onClick={() => playSong(song, songs, i)} style={{cursor:'pointer'}}>
                      {song.artist?.imageUrl ? <img src={song.artist.imageUrl} alt="" /> :
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#535353"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>}
                    </div>
                    <div className="track-info" onClick={() => playSong(song, songs, i)} style={{cursor:'pointer'}}>
                      <span className={`track-name ${isActive ? 'playing' : ''}`}>{song.title}</span>
                      <span className="track-artist">{song.artist?.name}</span>
                    </div>
                    <span className="track-plays">{(song.playCount || 0).toLocaleString()}</span>
                    <button
                      onClick={() => remove(selected.id, song.id)}
                      style={{background:'none',border:'none',color:'#b3b3b3',cursor:'pointer',padding:'4px',display:'flex',alignItems:'center',borderRadius:'50%'}}
                      title="Retirer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="library-page">
      <div className="library-header">
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#b3b3b3">
            <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z"/>
          </svg>
          <span style={{fontSize:'16px',fontWeight:'700',color:'#b3b3b3'}}>Votre bibliothèque</span>
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)} title="Créer une playlist">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
      </div>

      <div className="library-body">
        {playlists.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
            </svg>
            <p>Créez votre première playlist</p>
            <span>C'est simple, nous allons vous aider</span>
            <button className="btn-green" style={{marginTop:'16px'}} onClick={() => setShowModal(true)}>
              Créer une playlist
            </button>
          </div>
        ) : (
          <div className="playlist-list">
            {playlists.map(pl => (
              <div key={pl.id} className="playlist-row" onClick={() => setSelected(pl)}>
                <div className="playlist-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
                  </svg>
                </div>
                <div className="playlist-meta">
                  <div className="playlist-name">{pl.name}</div>
                  <div className="playlist-songs">Playlist · {(pl.songs || []).length} titre{(pl.songs||[]).length!==1?'s':''}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>Nouvelle playlist</h3>
            <input
              className="modal-input"
              type="text"
              placeholder="Titre de la playlist"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && create()}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn-green" onClick={create}>Créer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { playlistService } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import './Home.css';

export default function Library() {
  const [playlists, setPlaylists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const { playSong, currentSong, isPlaying } = usePlayer();

  const load = async () => {
    try {
      const res = await playlistService.getAll();
      setPlaylists(res.data.data || []);
    } catch { setPlaylists([]); }
  };

  useEffect(() => { load(); }, []);

  const createPlaylist = async () => {
    if (!newName.trim()) return;
    await playlistService.create(newName);
    setNewName(''); setShowModal(false);
    load();
  };

  const removeFromPlaylist = async (plId, songId) => {
    await playlistService.removeSong(plId, songId);
    load();
    if (selected?.id === plId) {
      const res = await playlistService.getAll();
      const updated = (res.data.data || []).find(p => p.id === plId);
      setSelected(updated);
    }
  };

  if (selected) {
    const songs = selected.songs || [];
    return (
      <div className="library-page">
        <button
          onClick={() => setSelected(null)}
          style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer', fontSize: 14, marginBottom: 20 }}
        >
          ← Retour
        </button>
        <h1 className="section-title">📋 {selected.name}</h1>
        <p style={{ color: '#b3b3b3', marginBottom: 24 }}>{songs.length} chanson{songs.length !== 1 ? 's' : ''}</p>

        {songs.length === 0
          ? <p style={{ color: '#555' }}>Aucune chanson dans cette playlist.</p>
          : (
          <div className="song-list">
            {songs.map((song, i) => {
              const isActive = currentSong?.id === song.id;
              return (
                <div key={song.id} className={`song-row ${isActive ? 'song-row--active' : ''}`}>
                  <span className={`song-row-num ${isActive ? 'song-row-num--active' : ''}`}>
                    {isActive && isPlaying ? '♫' : i + 1}
                  </span>
                  <div className="song-row-info" onClick={() => playSong(song, songs, i)} style={{ cursor: 'pointer' }}>
                    <div className="song-row-thumb">
                      {song.artist?.imageUrl ? <img src={song.artist.imageUrl} alt="" /> : '♪'}
                    </div>
                    <div>
                      <div className="song-row-title">{song.title}</div>
                      <div className="song-row-artist">{song.artist?.name}</div>
                    </div>
                  </div>
                  <span className="song-row-genre">{song.genre}</span>
                  <span className="song-row-plays">▶ {(song.playCount || 0).toLocaleString()}</span>
                  <button
                    onClick={() => removeFromPlaylist(selected.id, song.id)}
                    style={{ background: 'none', border: 'none', color: '#ff4b4b', cursor: 'pointer', fontSize: 16 }}
                    title="Supprimer"
                  >✕</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="library-page">
      <h1 className="section-title">📚 Ma Bibliothèque</h1>

      <div className="playlist-list">
        {playlists.map(pl => (
          <div key={pl.id} className="playlist-item" onClick={() => setSelected(pl)}>
            <span className="playlist-item-icon">🎵</span>
            <div style={{ flex: 1 }}>
              <div className="playlist-item-name">{pl.name}</div>
              <div className="playlist-item-count">{(pl.songs || []).length} chanson{(pl.songs || []).length !== 1 ? 's' : ''}</div>
            </div>
            <span style={{ color: '#555' }}>›</span>
          </div>
        ))}
      </div>

      <button className="create-playlist-btn" onClick={() => setShowModal(true)}>
        + Créer une nouvelle playlist
      </button>

      {showModal && (
        <div className="modal-bg" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Nouvelle playlist</h3>
            <input
              type="text"
              placeholder="Nom de la playlist"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createPlaylist()}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn-confirm" onClick={createPlaylist}>Créer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

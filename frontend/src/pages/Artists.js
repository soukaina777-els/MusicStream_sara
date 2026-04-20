import React, { useEffect, useState } from 'react';
import { artistService } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import './Home.css';

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [songs, setSongs] = useState([]);
  const { playSong, currentSong, isPlaying } = usePlayer();

  useEffect(() => {
    artistService.getAll().then(res => setArtists(res.data.data || [])).catch(() => {});
  }, []);

  const selectArtist = async (artist) => {
    setSelected(artist);
    try {
      const res = await artistService.getSongs(artist.id);
      setSongs(res.data.data || []);
    } catch { setSongs([]); }
  };

  if (selected) {
    return (
      <div className="artists-page">
        <button
          onClick={() => { setSelected(null); setSongs([]); }}
          style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer', fontSize: 14, marginBottom: 20 }}
        >
          ← Retour
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
          <div className="artist-avatar" style={{ width: 120, height: 120 }}>
            {selected.imageUrl
              ? <img src={selected.imageUrl} alt="" />
              : <div className="artist-avatar-placeholder">🎤</div>
            }
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 700, margin: '0 0 8px' }}>{selected.name}</h1>
            {selected.bio && <p style={{ color: '#b3b3b3', fontSize: 14 }}>{selected.bio}</p>}
            {selected.totalPlayCount != null && (
              <p style={{ color: '#b3b3b3', fontSize: 13 }}>▶ {selected.totalPlayCount.toLocaleString()} écoutes au total</p>
            )}
          </div>
        </div>

        <h2 className="section-title">Chansons</h2>
        {songs.length === 0
          ? <p style={{ color: '#555' }}>Aucune chanson disponible.</p>
          : (
          <div className="song-list">
            {songs.map((song, i) => {
              const isActive = currentSong?.id === song.id;
              return (
                <div
                  key={song.id}
                  className={`song-row ${isActive ? 'song-row--active' : ''}`}
                  onClick={() => playSong(song, songs, i)}
                >
                  <span className={`song-row-num ${isActive ? 'song-row-num--active' : ''}`}>
                    {isActive && isPlaying ? '♫' : i + 1}
                  </span>
                  <div className="song-row-info">
                    <div className="song-row-thumb">
                      {song.artist?.imageUrl ? <img src={song.artist.imageUrl} alt="" /> : '♪'}
                    </div>
                    <div>
                      <div className="song-row-title">{song.title}</div>
                      <div className="song-row-artist">{song.genre}</div>
                    </div>
                  </div>
                  <span className="song-row-genre">{song.language}</span>
                  <span className="song-row-plays">▶ {(song.playCount || 0).toLocaleString()}</span>
                  <span />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="artists-page">
      <h1 className="section-title">🎤 Artistes</h1>
      <div className="artists-grid">
        {artists.map(artist => (
          <div key={artist.id} className="artist-card" onClick={() => selectArtist(artist)}>
            <div className="artist-avatar">
              {artist.imageUrl
                ? <img src={artist.imageUrl} alt="" />
                : <div className="artist-avatar-placeholder">🎤</div>
              }
            </div>
            <p className="artist-name">{artist.name}</p>
            {artist.totalPlayCount != null && (
              <p className="artist-plays">▶ {artist.totalPlayCount.toLocaleString()}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

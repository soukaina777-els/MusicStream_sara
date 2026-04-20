import React, { useState, useEffect, useRef } from 'react';
import { songService } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import './Home.css';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { playSong, currentSong, isPlaying } = usePlayer();
  const timer = useRef(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await songService.search(query);
        setResults(res.data.data || []);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 400);
  }, [query]);

  return (
    <div className="search-page">
      <h1 className="section-title">Rechercher</h1>
      <div className="search-input-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Titres, artistes..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {loading && <p style={{ color: '#b3b3b3' }}>Recherche...</p>}

      {results.length > 0 && (
        <div className="song-list">
          {results.map((song, i) => {
            const isActive = currentSong?.id === song.id;
            return (
              <div
                key={song.id}
                className={`song-row ${isActive ? 'song-row--active' : ''}`}
                onClick={() => playSong(song, results, i)}
              >
                <span className={`song-row-num ${isActive ? 'song-row-num--active' : ''}`}>
                  {isActive && isPlaying ? '♫' : i + 1}
                </span>
                <div className="song-row-info">
                  <div className="song-row-thumb">
                    {song.artist?.imageUrl
                      ? <img src={song.artist.imageUrl} alt="" />
                      : '♪'
                    }
                  </div>
                  <div>
                    <div className="song-row-title">{song.title}</div>
                    <div className="song-row-artist">{song.artist?.name}</div>
                  </div>
                </div>
                <span className="song-row-genre">{song.genre}</span>
                <span className="song-row-plays">▶ {(song.playCount || 0).toLocaleString()}</span>
                <span />
              </div>
            );
          })}
        </div>
      )}

      {query && !loading && results.length === 0 && (
        <div style={{ color: '#b3b3b3', textAlign: 'center', marginTop: 40 }}>
          <p style={{ fontSize: 48 }}>🎵</p>
          <p>Aucun résultat pour "{query}"</p>
        </div>
      )}
    </div>
  );
}

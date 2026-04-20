import React, { useState, useEffect, useRef } from 'react';
import { songService } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import './Pages.css';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { playSong, currentSong, isPlaying } = usePlayer();
  const timer = useRef(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    clearTimeout(timer.current);
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await songService.search(query);
        setResults(res.data.data || []);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 350);
  }, [query]);

  return (
    <div className="search-page">
      <div className="search-header">
        <div className="search-input-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            placeholder="Que souhaitez-vous écouter ?"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <div className="search-body">
        {!query && (
          <div className="search-hint">
            Recherchez vos titres, artistes ou genres préférés
          </div>
        )}

        {query && loading && <div className="search-hint">Recherche en cours...</div>}

        {query && !loading && results.length === 0 && (
          <div className="no-results">
            <strong>Aucun résultat pour "{query}"</strong>
            <span>Vérifiez l'orthographe ou essayez avec un autre mot.</span>
          </div>
        )}

        {results.length > 0 && (
          <>
            <p className="search-count">{results.length} résultat{results.length > 1 ? 's' : ''}</p>
            <div className="track-list">
              <div className="track-list-header">
                <span>#</span>
                <span style={{gridColumn: '2/4'}}>Titre</span>
                <span>Écoutes</span>
                <span />
              </div>
              {results.map((song, i) => {
                const isActive = currentSong?.id === song.id;
                return (
                  <div
                    key={song.id}
                    className={`track-row ${isActive ? 'active' : ''}`}
                    onClick={() => playSong(song, results, i)}
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
                      {song.artist?.imageUrl
                        ? <img src={song.artist.imageUrl} alt="" />
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="#535353"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                      }
                    </div>
                    <div className="track-info">
                      <span className={`track-name ${isActive ? 'playing' : ''}`}>{song.title}</span>
                      <span className="track-artist">{song.artist?.name}</span>
                    </div>
                    <span className="track-plays">{(song.playCount || 0).toLocaleString()}</span>
                    <span />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

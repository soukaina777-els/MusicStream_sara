import React, { useEffect, useState } from 'react';
import { songService } from '../services/api';
import SongCard from '../components/SongCard';
import { usePlayer } from '../context/PlayerContext';
import './Pages.css';

export default function Home() {
  const [topSongs, setTopSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong, currentSong, isPlaying } = usePlayer();

  useEffect(() => {
    Promise.all([songService.getTop(6), songService.getAll()])
      .then(([top, all]) => {
        setTopSongs(top.data.data || []);
        setAllSongs(all.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  if (loading) return <div className="page-spinner">Chargement...</div>;

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>{greet()}</h1>
      </div>

      {topSongs.length > 0 && (
        <section className="home-section">
          <div className="section-row">
            <h2 className="section-subtitle">Les plus écoutées</h2>
          </div>
          <div className="top-grid">
            {topSongs.map((song, i) => {
              const isActive = currentSong?.id === song.id;
              return (
                <div
                  key={song.id}
                  className={`top-item ${isActive ? 'top-item--active' : ''}`}
                  onClick={() => playSong(song, topSongs, i)}
                >
                  <div className="top-item-img">
                    {song.artist?.imageUrl
                      ? <img src={song.artist.imageUrl} alt="" />
                      : <div className="top-item-ph">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#535353">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                          </svg>
                        </div>
                    }
                  </div>
                  <div className="top-item-info">
                    <span className={`top-item-title ${isActive ? 'playing' : ''}`}>{song.title}</span>
                    <span className="top-item-artist">{song.artist?.name}</span>
                  </div>
                  {isActive && isPlaying && (
                    <div className="top-item-playing">
                      <span /><span /><span />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {allSongs.length > 0 && (
        <section className="home-section">
          <div className="section-row">
            <h2 className="section-subtitle">Tout le catalogue</h2>
            <span className="section-count">{allSongs.length} titres</span>
          </div>
          <div className="cards-grid">
            {allSongs.map((song, i) => (
              <SongCard key={song.id} song={song} queue={allSongs} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { songService } from '../services/api';
import SongCard from '../components/SongCard';
import './Home.css';

export default function Home() {
  const [topSongs, setTopSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [topRes, allRes] = await Promise.all([
          songService.getTop(6),
          songService.getAll(),
        ]);
        setTopSongs(topRes.data.data || []);
        setAllSongs(allRes.data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="page-loading">Chargement...</div>;

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>{greet()} 👋</h1>
      </div>

      {topSongs.length > 0 && (
        <section className="section">
          <h2 className="section-title">🔥 Les plus écoutées</h2>
          <div className="songs-grid">
            {topSongs.map((song, i) => (
              <SongCard key={song.id} song={song} queue={topSongs} index={i} />
            ))}
          </div>
        </section>
      )}

      {allSongs.length > 0 && (
        <section className="section">
          <h2 className="section-title">🎵 Tout le catalogue</h2>
          <div className="songs-grid songs-grid--large">
            {allSongs.map((song, i) => (
              <SongCard key={song.id} song={song} queue={allSongs} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

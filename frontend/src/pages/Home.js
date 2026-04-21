import React, { useEffect, useState } from 'react';
import { songService, playlistService } from '../services/api';
import SongCard from '../components/SongCard';
import { usePlayer } from '../context/PlayerContext';
import './Pages.css';

export default function Home() {
  const [topSongs, setTopSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [addModal, setAddModal] = useState(null); // song being added
  const { playSong, currentSong, isPlaying } = usePlayer();

  useEffect(() => {
    Promise.all([songService.getTop(6), songService.getAll(), playlistService.getAll()])
      .then(([top, all, pls]) => {
        setTopSongs(top.data.data || []);
        setAllSongs(all.data.data || []);
        setPlaylists(pls.data.data || []);
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

  const openAddModal = (e, song) => {
    e.stopPropagation();
    setAddModal(song);
  };

  const addToPlaylist = async (plId) => {
    try {
      await playlistService.addSong(plId, addModal.id);
      setAddModal(null);
    } catch (err) {
      console.error(err);
    }
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
                  style={{ position: 'relative' }}
                >
                 <div className="top-item-img">
                  {song.coverUrl
                    ? <img src={song.coverUrl} alt="" />
                    : song.artist?.imageUrl
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
                  <button
                    className="add-to-playlist-btn"
                    onClick={(e) => openAddModal(e, song)}
                    title="Ajouter à une playlist"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </button>
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
          <div className="track-list">
            <div className="track-list-header">
              <span>#</span>
              <span style={{gridColumn:'2/4'}}>Titre</span>
              <span>Écoutes</span>
              <span />
            </div>
            {allSongs.map((song, i) => {
              const isActive = currentSong?.id === song.id;
              return (
                <div key={song.id} className={`track-row ${isActive ? 'active' : ''}`}>
                  <span className="track-num">{i + 1}</span>
                  <div className="track-thumb" onClick={() => playSong(song, allSongs, i)} style={{cursor:'pointer'}}>
                    {song.coverUrl
                      ? <img src={song.coverUrl} alt="" />
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="#535353"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                    }
                  </div>
                  <div className="track-info" onClick={() => playSong(song, allSongs, i)} style={{cursor:'pointer'}}>
                    <span className={`track-name ${isActive ? 'playing' : ''}`}>{song.title}</span>
                    <span className="track-artist">{song.artist?.name}</span>
                  </div>
                  <span className="track-plays">{(song.playCount || 0).toLocaleString()}</span>
                  <button
                    className="add-to-playlist-btn"
                    onClick={(e) => openAddModal(e, song)}
                    title="Ajouter à une playlist"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Modal: choisir une playlist */}
      {addModal && (
        <div className="modal-overlay" onClick={() => setAddModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>Ajouter à une playlist</h3>
            <p style={{color:'#b3b3b3',fontSize:'14px',margin:'4px 0 16px'}}>"{addModal.title}"</p>
            {playlists.length === 0 ? (
              <p style={{color:'#b3b3b3',fontSize:'14px'}}>Aucune playlist. Créez-en une depuis la bibliothèque.</p>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'8px',maxHeight:'300px',overflowY:'auto'}}>
                {playlists.map(pl => (
                  <button
                    key={pl.id}
                    onClick={() => addToPlaylist(pl.id)}
                    style={{
                      background:'#2a2a2a',border:'none',color:'#fff',
                      padding:'12px 16px',borderRadius:'8px',cursor:'pointer',
                      textAlign:'left',fontSize:'14px',display:'flex',
                      alignItems:'center',gap:'12px',transition:'background 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background='#3a3a3a'}
                    onMouseOut={e => e.currentTarget.style.background='#2a2a2a'}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#b3b3b3">
                      <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
                    </svg>
                    <div>
                      <div>{pl.name}</div>
                      <div style={{color:'#b3b3b3',fontSize:'12px'}}>{(pl.songs||[]).length} titre{(pl.songs||[]).length!==1?'s':''}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setAddModal(null)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
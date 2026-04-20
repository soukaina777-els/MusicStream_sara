import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33z"/>
    <path fill="none" d="M0 0h24v24H0z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.533 1.279c-5.18 0-9.407 4.927-9.407 9.688 0 5.052 3.896 9.616 9.407 9.616 2.168 0 4.235-.77 5.855-2.056l3.735 3.735a1 1 0 1 0 1.414-1.414l-3.743-3.743a9.602 9.602 0 0 0 2.149-6.138c0-5.068-4.222-9.688-9.41-9.688zm-7.407 9.688c0-3.927 3.278-7.688 7.407-7.688 4.144 0 7.41 3.708 7.41 7.688 0 4.107-3.445 7.616-7.41 7.616-4.056 0-7.407-3.557-7.407-7.616z"/>
  </svg>
);

const LibraryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z"/>
  </svg>
);

const ArtistIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
  </svg>
);

export default function Sidebar() {
  const { user, logout } = useAuth();
  const initial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#1db954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span>MusicStream</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <HomeIcon /><span>Accueil</span>
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <SearchIcon /><span>Rechercher</span>
          </NavLink>
          <NavLink to="/library" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LibraryIcon /><span>Bibliothèque</span>
          </NavLink>
          <NavLink to="/artists" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <ArtistIcon /><span>Artistes</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="user-row">
          <div className="user-avatar">{initial}</div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Utilisateur'}</span>
            <span className="user-email">{user?.email}</span>
          </div>
          <button className="logout-btn" onClick={logout} title="Se déconnecter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

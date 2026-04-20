import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">♪</span>
        <span>MusicStream</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">🏠</span> Accueil
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">🔍</span> Rechercher
        </NavLink>
        <NavLink to="/library" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">📚</span> Ma Bibliothèque
        </NavLink>
        <NavLink to="/artists" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">🎤</span> Artistes
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <p className="user-name">{user?.name || 'Utilisateur'}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={logout} title="Déconnexion">⏻</button>
      </div>
    </aside>
  );
}

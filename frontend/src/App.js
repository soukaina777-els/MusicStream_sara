import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import Sidebar from './components/Sidebar';
import PlayerBar from './components/PlayerBar';
import Login from './pages/Login';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Artists from './pages/Artists';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-loading">Chargement...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function Layout() {
  return (
    <div className="app-root">
      <Sidebar />
      <div className="app-main">
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/artists" element={<Artists />} />
          </Routes>
        </div>
      </div>
      <div className="app-player">
        <PlayerBar />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <PrivateRoute><Layout /></PrivateRoute>
            } />
          </Routes>
        </BrowserRouter>
      </PlayerProvider>
    </AuthProvider>
  );
}

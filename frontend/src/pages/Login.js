import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || (mode === 'login'
        ? 'Email ou mot de passe incorrect'
        : 'Erreur lors de la création du compte'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>MusicStream</span>
          </div>
          <h1>
            {mode === 'login'
              ? 'Des millions de titres.\nGratuit.'
              : 'Rejoignez des\nmillions d\'auditeurs.'}
          </h1>
          <p>
            {mode === 'login'
              ? 'Connectez-vous et profitez de votre musique.'
              : 'Créez votre compte et commencez à écouter.'}
          </p>
        </div>
        <div className="login-left-bg" />
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <div className="login-tabs">
            <button
              className={mode === 'login' ? 'tab active' : 'tab'}
              onClick={() => { setMode('login'); setError(''); }}
            >Se connecter</button>
            <button
              className={mode === 'signup' ? 'tab active' : 'tab'}
              onClick={() => { setMode('signup'); setError(''); }}
            >S'inscrire</button>
          </div>

          {error && (
            <div className="login-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {mode === 'signup' && (
              <div className="field-group">
                <label>Nom d'affichage</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Comment voulez-vous être appelé ?"
                  required
                />
              </div>
            )}
            <div className="field-group">
              <label>Adresse e-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                required
              />
            </div>
            <div className="field-group">
              <label>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
              />
            </div>
            {mode === 'signup' && (
              <div className="field-group">
                <label>Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                />
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? (mode === 'login' ? 'Connexion...' : 'Création...')
                : (mode === 'login' ? 'Se connecter' : 'Créer un compte')}
            </button>
          </form>

          {mode === 'login' && (
            <>
              <div className="divider"><span>ou</span></div>
              <button className="demo-btn" onClick={() => {
                setEmail('user1@test.com'); setPassword('123');
              }}>
                Utiliser le compte démo
              </button>
              <p className="switch-mode">
                Pas encore de compte ?{' '}
                <button onClick={() => { setMode('signup'); setError(''); }}>
                  Créer un compte
                </button>
              </p>
            </>
          )}
          {mode === 'signup' && (
            <p className="switch-mode">
              Déjà un compte ?{' '}
              <button onClick={() => { setMode('login'); setError(''); }}>
                Se connecter
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

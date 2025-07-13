import React, { useEffect, useState } from 'react';
import './App.css';
import MainBoard from './components/MainBoard';
import { signIn, signOutUser, onUserStateChanged } from './auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  // Email/password form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleToggleRegister = () => {
    setIsRegister((prev) => !prev);
    setError('');
  };
  const handleShowEmailModal = () => {
    setShowEmailModal(true);
    setError('');
  };
  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setEmail('');
    setPassword('');
    setError('');
    setIsRegister(false);
  };
  const handleEmailPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const auth = getAuth();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onUserStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>Signed in as {user.displayName}</span>
            <button onClick={signOutUser}>Sign Out</button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
            <button onClick={signIn} style={{ padding: '0.5rem', borderRadius: '4px', background: '#e5e7eb', color: '#2563eb', border: 'none', fontWeight: 'bold' }}>Sign In with Google</button>
            <button onClick={handleShowEmailModal} style={{ padding: '0.5rem', borderRadius: '4px', background: '#e5e7eb', color: '#2563eb', border: 'none', fontWeight: 'bold' }}>
              Sign In with Email/Password
            </button>
            {showEmailModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}>
                <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', minWidth: '300px', boxShadow: '0 2px 16px rgba(0,0,0,0.15)', position: 'relative' }}>
                  <button onClick={handleCloseEmailModal} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', fontSize: '1.5rem', color: '#888', cursor: 'pointer' }}>&times;</button>
                  <h2 style={{ marginBottom: '1rem', textAlign: 'center', color: '#2563eb' }}>{isRegister ? 'Register' : 'Login'}</h2>
                  <form onSubmit={handleEmailPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" style={{ padding: '0.5rem', borderRadius: '4px', background: '#2563eb', color: 'white', border: 'none', fontWeight: 'bold' }}>
                      {isRegister ? 'Register' : 'Login'}
                    </button>
                    <button type="button" onClick={handleToggleRegister} style={{ background: 'none', border: 'none', color: '#2563eb', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.95rem' }}>
                      {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                    </button>
                    {error && <span style={{ color: 'red', fontSize: '0.95rem', textAlign: 'center' }}>{error}</span>}
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </header>
      {user && <MainBoard user={user} />}
    </div>
  );
}
export default App;
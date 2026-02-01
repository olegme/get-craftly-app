import React, { useEffect, useState } from 'react';
import './App.css';
import MainBoard from './components/MainBoard';
import VersionInfo from './components/VersionInfo';
import AdminDashboard from './components/AdminDashboard';
import { signIn, signOutUser, onUserStateChanged } from './auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase.js';

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

  useEffect(() => {
    const upsertUser = async () => {
      if (!user) return;
      const userRef = doc(collection(db, 'users'), user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        lastActive: serverTimestamp(),
      }, { merge: true });
    };
    upsertUser();
  }, [user]);

  const adminUid = import.meta.env.VITE_ADMIN_UID;
  const isAdmin = Boolean(user && adminUid && user.uid === adminUid);

  return (
    <div className="App">
      <header className="app-header">
        {user ? (
          <>
            <span className="user-info">Signed in as {user.displayName || user.email}</span>
            <button onClick={signOutUser}>Sign Out</button>
          </>
        ) : (
          <div className="auth-buttons">
            <button onClick={signIn} className="auth-button">Sign In with Google</button>
            <button onClick={handleShowEmailModal} className="auth-button">
              Sign In with Email/Password
            </button>
            {showEmailModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <button onClick={handleCloseEmailModal} className="close-button">&times;</button>
                  <h2 className="modal-title">{isRegister ? 'Register' : 'Login'}</h2>
                  <form onSubmit={handleEmailPasswordSubmit} className="auth-form">
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      className="auth-input"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      className="auth-input"
                    />
                    <button type="submit" className="submit-button">
                      {isRegister ? 'Register' : 'Login'}
                    </button>
                    <button type="button" onClick={handleToggleRegister} className="toggle-button">
                      {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                    </button>
                    {error && <span className="error-message">{error}</span>}
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </header>
      {user && isAdmin && <AdminDashboard user={user} />}
      {user && <MainBoard user={user} />}
      <VersionInfo />
    </div>
  );
}
export default App;

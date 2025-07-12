import React, { useEffect, useState } from 'react';
import './App.css';
import MainBoard from './components/MainBoard';
import { signIn, signOutUser, onUserStateChanged } from './auth';

function App() {
  const [user, setUser] = useState(null);

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
          <button onClick={signIn}>Sign In with Google</button>
        )}
      </header>
      {user && <MainBoard user={user} />}
    </div>
  );
}
export default App;
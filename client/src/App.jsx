import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TimerProvider } from './context/TimerContext';
import TimerControl from './components/TimerControl';
import TimerDisplay from './components/TimerDisplay';
import Auth from './components/Auth';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TimerProvider>
          <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900">
            <Routes>
              <Route path="/" element={<MainApp />} />
              <Route path="/obs" element={<OBSView />} />
            </Routes>
          </div>
        </TimerProvider>
      </AuthProvider>
    </Router>
  );
}

function MainApp() {
  const { user, isAuthenticated, signOut, isLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const handleAuthSuccess = () => {
    setShowAuth(false);
  };

  const handleLogout = () => {
    signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (showAuth) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Auth onAuthSuccess={handleAuthSuccess} onBack={() => setShowAuth(false)} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Subathon Timer
        </h1>
        <p className="text-gray-300 mb-2">
          Made by lordknight__
        </p>
        <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3 max-w-md mx-auto">
          <p className="text-yellow-400 text-sm font-medium">
            ⚠️ This website is currently in beta. Features may change.
          </p>
        </div>
      </header>

      {!isAuthenticated ? (
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Welcome to Subathon Timer ദ്ദി/ᐠ｡‸｡ᐟ\
            </h2>
            <p className="text-gray-300 mb-4">
              Create an account or login to start using your subathon timer
            </p>
            
            <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3 mb-6">
              <p className="text-yellow-400 text-sm font-medium">
                ⚠️ Beta Version - Features may change
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => setShowAuth(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Welcome, {user?.name || user?.email}!
                  </h2>
                  <p className="text-gray-400">Signed in with email</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TimerControl />
            <TimerDisplay />
          </div>

          <div className="mt-8 text-center">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                OBS Browser Source
              </h3>
              <p className="text-gray-300 mb-4">
                Use this URL in OBS as a Browser Source for a clean timer display:
              </p>
              <div className="bg-gray-700 rounded p-3 mb-4">
                <code className="text-green-400">
                  {window.location.origin}/obs
                </code>
              </div>
              <p className="text-sm text-gray-400">
                Recommended settings: Width: 400px, Height: 200px, FPS: 30
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 text-center">
        <div className="border-t border-gray-700 pt-6">
          <p className="text-gray-400 text-sm">
            Copyright © 2025 L.K.U. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function OBSView() {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <TimerDisplay isOBSMode={true} />
    </div>
  );
}

export default App;
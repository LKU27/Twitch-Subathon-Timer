import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TimerProvider } from './context/SimpleTimerContext';
import { TimerStyleProvider } from './context/TimerStyleContext';
import TimerControl from './components/TimerControl';
import TimerDisplay from './components/TimerDisplay';
import './index.css';

function App() {
  return (
    <Router>
      <TimerStyleProvider>
        <TimerProvider>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<MainApp />} />
              <Route path="/obs" element={<OBSView />} />
            </Routes>
          </div>
        </TimerProvider>
      </TimerStyleProvider>
    </Router>
  );
}

function MainApp() {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    const obsUrl = `${window.location.origin}/obs`;
    try {
      await navigator.clipboard.writeText(obsUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Hide success message after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = obsUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-2">
      <header className="text-center mb-3 animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-1" style={{
          background: 'linear-gradient(45deg, #8b5cf6, #a855f7, #c084fc, #e879f9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'purpleGlow 3s ease-in-out infinite'
        }}>
          Subathon Timer
        </h1>
        <p className="text-white/80 text-sm mb-2">
          Made by lordknight__
        </p>
        <div className="glass rounded-lg p-2 max-w-sm mx-auto">
          <p className="text-yellow-300 text-xs font-medium">
            ⚠️ Beta - Features may change
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <TimerControl />
          </div>
          <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <TimerDisplay />
          </div>
        </div>

        <div className="mt-3 text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="glass rounded-xl p-3 hover-lift">
            <h3 className="text-base font-semibold text-white mb-2">
              OBS Browser Source
            </h3>
            <div 
              className="glass rounded-lg p-2 mb-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg group clickable-url"
              onClick={copyToClipboard}
              title="Click to copy to clipboard"
            >
              <code className="text-green-300 text-xs font-mono group-hover:text-green-200 transition-colors">
                {window.location.origin}/obs
              </code>
              <div className="mt-1 text-xs text-white/60 group-hover:text-white/80 transition-colors">
                Click to copy
              </div>
            </div>
            {copySuccess && (
              <div className="mb-2 p-2 bg-green-500/20 border border-green-500/30 rounded-lg animate-bounce-custom">
                <p className="text-green-300 text-xs font-medium">
                  ✅ URL copied to clipboard!
                </p>
              </div>
            )}
            <p className="text-xs text-white/60">
              Recommended: 400x200px, 30 FPS
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-3 text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="border-t border-white/20 pt-2">
            <p className="text-white/60 text-xs">
              Copyright © 2025 L.K.U. All Rights Reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function OBSView() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center obs-mode" 
      style={{ 
        backgroundColor: 'transparent',
        background: 'transparent',
        margin: 0,
        padding: 0
      }}
    >
      <TimerDisplay isOBSMode={true} />
    </div>
  );
}

export default App;
import React from 'react';
import { useTimer } from '../context/SimpleTimerContext';
import { useTimerStyle } from '../context/TimerStyleContext';

const TimerDisplay = ({ isOBSMode = false }) => {
  const { timerState, formatTime, getCurrentTimeRemaining, isRestored } = useTimer();
  const { timerStyle, updateTimerStyle, resetTimerStyle, getTimerClasses, getTimerStyles, isLoading } = useTimerStyle();

  const timeRemaining = getCurrentTimeRemaining();
  const isRunning = timerState.isRunning;
  const isPaused = !timerState.isRunning && timerState.totalTime > 0;


  // Get warning color for critical time situations
  const getWarningColor = () => {
    const seconds = Math.floor(timeRemaining / 1000);
    if (seconds <= 0) return { color: '#ef4444' }; // Red for time's up
    if (seconds <= 60) return { color: '#f97316' }; // Orange for last minute
    return {}; // Use custom color
  };

  // Combine custom styles with warning colors
  const getDisplayStyles = () => {
    const customStyles = getTimerStyles();
    const warningStyles = getWarningColor();
    return { ...customStyles, ...warningStyles };
  };

  // Status text based on timer state
  const getStatusText = () => {
    if (timeRemaining <= 0 && isRunning) return 'TIME\'S UP!';
    if (isPaused) return 'PAUSED';
    if (!isRunning && timeRemaining > 0) return 'STOPPED';
    if (isRunning) return 'RUNNING';
    if (isRestored) return 'RESTORED';
    return '';
  };

  // OBS Mode - Clean display for streaming
  if (isOBSMode) {
    return (
      <div 
        className="text-center" 
        style={{ 
          backgroundColor: 'transparent',
          background: 'transparent',
          margin: 0,
          padding: '20px'
        }}
      >
        <div 
          className={`${getTimerClasses()} drop-shadow-2xl`}
          style={{
            ...getDisplayStyles(),
            textShadow: getDisplayStyles().textShadow || '2px 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          {formatTime(timeRemaining)}
        </div>
        
        {getStatusText() && (
          <div 
            className="font-bold mt-3 text-xl"
            style={{
              color: '#10b981',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            {getStatusText()}
          </div>
        )}
      </div>
    );
  }

  // Regular Mode - Full interface
  return (
    <div className="glass rounded-xl p-4 hover-lift">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">Timer Display</h2>
      </div>
      
      <div className="text-center">
        {/* Main Timer Display */}
        <div 
          className={`${getTimerClasses()} mb-4 drop-shadow-2xl`}
          style={getDisplayStyles()}
        >
          {formatTime(timeRemaining)}
        </div>
        
        {/* Timer Status */}
        <div className="space-y-2">
          {isRunning && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
              <span className="text-green-300 font-semibold text-base">Running</span>
            </div>
          )}
          
          {isPaused && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg"></div>
              <span className="text-yellow-300 font-semibold text-base">Paused</span>
            </div>
          )}
          
          {!isRunning && timeRemaining > 0 && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full shadow-lg"></div>
              <span className="text-gray-300 font-semibold text-base">Stopped</span>
            </div>
          )}
          
          {timeRemaining <= 0 && isRunning && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce shadow-lg"></div>
              <span className="text-red-300 font-semibold text-base animate-bounce">Time's Up!</span>
            </div>
          )}
          
          {isRestored && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg"></div>
              <span className="text-blue-300 font-semibold text-base">Timer Restored</span>
            </div>
          )}
        </div>
      </div>

      {/* Timer Customization */}
      {!isLoading && (
        <div className="mt-4 pt-4 border-t border-white/20 space-y-3">
          <h3 className="text-base font-semibold text-white">Timer Customization</h3>

          {/* Font Size Dropdown */}
          <div className="space-y-2">
            <label className="text-white/80 text-xs font-medium">Font Size</label>
            <select
              value={timerStyle.fontSize || '7xl'}
              onChange={(e) => updateTimerStyle({ fontSize: e.target.value })}
              className="w-full px-3 py-2 glass border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 bg-transparent text-sm"
            >
              <option value="5xl" className="bg-gray-800">Small</option>
              <option value="7xl" className="bg-gray-800">Medium</option>
              <option value="8xl" className="bg-gray-800">Large</option>
            </select>
          </div>

          {/* Text Outline Dropdown */}
          <div className="space-y-2">
            <label className="text-white/80 text-xs font-medium">Text Outline</label>
            <select
              value={timerStyle.textOutlineThickness || 2}
              onChange={(e) => updateTimerStyle({ textOutlineThickness: parseInt(e.target.value) })}
              className="w-full px-3 py-2 glass border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 bg-transparent text-sm"
            >
              <option value="1" className="bg-gray-800">1px</option>
              <option value="2" className="bg-gray-800">2px</option>
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetTimerStyle}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-1.5 px-3 rounded text-xs transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🔄 Reset
          </button>
        </div>
      )}

      {/* Timer Information */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="glass rounded-lg p-2">
            <h4 className="text-white/70 text-xs mb-1">Total Time</h4>
            <p className="text-green-300 font-semibold text-sm">
              {Math.floor(timerState.totalTime / 3600000)}h {Math.floor((timerState.totalTime % 3600000) / 60000)}m
            </p>
          </div>
          <div className="glass rounded-lg p-2">
            <h4 className="text-white/70 text-xs mb-1">Status</h4>
            <p className={`font-semibold text-sm ${
              isRunning ? 'text-green-300' : 
              isPaused ? 'text-yellow-300' : 
              'text-gray-300'
            }`}>
              {isRunning ? 'Running' : isPaused ? 'Paused' : 'Stopped'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
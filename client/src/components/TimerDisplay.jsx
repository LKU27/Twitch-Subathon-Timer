import React from 'react'
import { useTimer } from '../context/TimerContext'

const TimerDisplay = ({ isOBSMode = false }) => {
  const { timerState, formatTime, getCurrentTimeRemaining, isRestored } = useTimer()

  const timeRemaining = getCurrentTimeRemaining()
  const isRunning = timerState.isRunning
  const isPaused = !timerState.isRunning && timerState.totalTime > 0

  // Determine color based on time remaining
  const getTimeColor = () => {
    const seconds = Math.floor(timeRemaining / 1000)
    if (seconds <= 0) return 'text-red-500'
    if (seconds <= 300) return 'text-yellow-500' // 5 minutes
    if (seconds <= 600) return 'text-orange-500' // 10 minutes
    return 'text-green-500'
  }

  // OBS Mode - Clean display without background
  if (isOBSMode) {
    return (
      <div className="text-center">
        <div className={`text-6xl font-mono font-bold ${getTimeColor()} drop-shadow-lg`}>
          {formatTime(timeRemaining)}
        </div>
        {isPaused && (
          <div className="text-2xl text-yellow-500 font-semibold mt-2 drop-shadow-lg">
            PAUSED
          </div>
        )}
        {!timerState.isRunning && timeRemaining > 0 && (
          <div className="text-2xl text-gray-500 font-semibold mt-2 drop-shadow-lg">
            STOPPED
          </div>
        )}
        {timeRemaining <= 0 && timerState.isRunning && (
          <div className="text-2xl text-red-500 font-semibold mt-2 drop-shadow-lg">
            TIME'S UP!
          </div>
        )}
        {isRestored && (
          <div className="text-lg text-green-400 font-semibold mt-2 drop-shadow-lg animate-pulse">
            RESTORED
          </div>
        )}
      </div>
    )
  }

  // Regular Mode - Full display with controls info
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Timer Display</h2>
      
      <div className="text-center">
        <div className={`text-5xl font-mono font-bold ${getTimeColor()} mb-4`}>
          {formatTime(timeRemaining)}
        </div>
        
        <div className="space-y-2">
          {isRunning && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Running</span>
            </div>
          )}
          
          {isPaused && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-yellow-400 font-medium">Paused</span>
            </div>
          )}
          
          {!timerState.isRunning && timeRemaining > 0 && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-gray-400 font-medium">Stopped</span>
            </div>
          )}
          
          {timeRemaining <= 0 && timerState.isRunning && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-medium">Time's Up!</span>
            </div>
          )}
          
          {isRestored && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Timer Restored from Previous Session</span>
            </div>
          )}
        </div>
      </div>

      {/* Timer Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Total Time</h3>
          <p className="text-lg font-semibold text-white">
            {formatTime(timerState.totalTime)}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
          <p className="text-lg font-semibold text-green-400">
            {isRunning ? 'Running' : isPaused ? 'Paused' : 'Stopped'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {timerState.totalTime > 0 && (
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>
              {Math.round(((timerState.totalTime - timeRemaining) / timerState.totalTime) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-purple-800 h-2 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(100, ((timerState.totalTime - timeRemaining) / timerState.totalTime) * 100)}%`
              }}
            ></div>
          </div>
        </div>
      )}

      {/* OBS Instructions */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <h3 className="text-sm font-medium text-blue-400 mb-2">OBS Browser Source</h3>
        <p className="text-sm text-gray-300">
          Use the OBS view for a clean timer display without background. 
          Perfect for overlaying on your stream.
        </p>
      </div>
    </div>
  )
}

export default TimerDisplay

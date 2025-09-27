import React, { useState } from 'react'
import { useTimer } from '../context/SimpleTimerContext'

const TimerControl = () => {
  const { timerState, isLoading, startTimer, pauseTimer, resumeTimer, stopTimer, addTime } = useTimer()
  const [timeToAdd, setTimeToAdd] = useState('')
  const [timeUnit, setTimeUnit] = useState('minutes')
  const [initialTime, setInitialTime] = useState({ hours: '', minutes: '', seconds: '' })

  // Convert time object to milliseconds
  const timeToMs = (timeObj) => {
    const hours = parseInt(timeObj.hours) || 0
    const minutes = parseInt(timeObj.minutes) || 0
    const seconds = parseInt(timeObj.seconds) || 0
    return (hours * 3600 + minutes * 60 + seconds) * 1000
  }

  const handleStart = () => {
    const durationMs = timeToMs(initialTime)
    startTimer(durationMs)
  }

  const handleAddTime = () => {
    const value = parseInt(timeToAdd) || 0
    if (value <= 0) return
    
    let timeMs = 0
    switch (timeUnit) {
      case 'seconds':
        timeMs = value * 1000
        break
      case 'minutes':
        timeMs = value * 60 * 1000
        break
      case 'hours':
        timeMs = value * 60 * 60 * 1000
        break
      default:
        timeMs = value * 60 * 1000 // Default to minutes
    }
    
    addTime(timeMs)
  }


  const isRunning = timerState.isRunning
  const isPaused = !timerState.isRunning && timerState.totalTime > 0
  const isStopped = !timerState.isRunning && timerState.totalTime === 0

  return (
    <div className="glass rounded-xl p-4 hover-lift">
      <h2 className="text-xl font-semibold text-white mb-4">Timer Controls</h2>
      
      {/* Set Initial Timer Duration */}
      {isStopped && (
        <div className="mb-4 p-3 glass rounded-lg">
          <h3 className="text-base font-medium text-white mb-3">Set Timer Duration</h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div>
              <label className="block text-white/70 text-sm mb-1">Hours</label>
              <input
                type="number"
                min="0"
                max="23"
                value={initialTime.hours}
                onChange={(e) => setInitialTime(prev => ({...prev, hours: e.target.value}))}
                placeholder="0"
                className="w-full px-2 py-1.5 glass border border-white/20 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-white/40 text-sm"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={initialTime.minutes}
                onChange={(e) => setInitialTime(prev => ({...prev, minutes: e.target.value}))}
                placeholder="0"
                className="w-full px-2 py-1.5 glass border border-white/20 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-white/40 text-sm"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1">Seconds</label>
              <input
                type="number"
                min="0"
                max="59"
                value={initialTime.seconds}
                onChange={(e) => setInitialTime(prev => ({...prev, seconds: e.target.value}))}
                placeholder="0"
                className="w-full px-2 py-1.5 glass border border-white/20 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-white/40 text-sm"
              />
            </div>
          </div>
          <p className="text-white/60 text-xs">
            Set initial duration or leave as 00:00:00 for count-up timer.
          </p>
        </div>
      )}

      {/* Timer Status */}
      {timerState.isRunning && (
        <div className="mb-4 p-3 glass rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-white">Timer Status</h3>
              <p className="text-white/80 text-sm">
                {isRunning ? 'Running' : isPaused ? 'Paused' : 'Stopped'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60">Total Time</p>
              <p className="text-base font-semibold text-green-300">
                {Math.floor(timerState.totalTime / 60000)}m {Math.floor((timerState.totalTime % 60000) / 1000)}s
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="space-y-3">
        {!timerState.isRunning ? (
          <button
            onClick={isPaused ? resumeTimer : handleStart}
            disabled={isLoading}
            className="btn-primary w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="spinner mr-2"></div>
                {isPaused ? 'Resuming...' : 'Starting...'}
              </div>
            ) : isPaused ? 'Resume Timer' : 'Start Timer'}
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={pauseTimer}
              disabled={isLoading}
              className="btn-primary bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-1"></div>
                  Pausing...
                </div>
              ) : 'Pause'}
            </button>
            <button
              onClick={stopTimer}
              disabled={isLoading}
              className="btn-primary bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-1"></div>
                  Stopping...
                </div>
              ) : 'Stop'}
            </button>
          </div>
        )}
      </div>

      {/* Add Time Section */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <h3 className="text-base font-medium text-white mb-3">Add Time</h3>
        
        {/* Quick Add Time */}
        <div className="mb-3">
          <label className="block text-white/70 text-xs mb-2">Quick Add Time</label>
          <div className="space-y-2">
            <div className="flex space-x-2 items-stretch">
              <input
                type="number"
                min="1"
                value={timeToAdd}
                onChange={(e) => setTimeToAdd(e.target.value)}
                placeholder="Amount"
                className="flex-1 px-2 py-1.5 glass border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-white/40 text-sm"
              />
              <select
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value)}
                className="px-2 py-1.5 glass border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 bg-transparent text-sm"
              >
                <option value="seconds" className="bg-gray-800">Sec</option>
                <option value="minutes" className="bg-gray-800">Min</option>
                <option value="hours" className="bg-gray-800">Hr</option>
              </select>
            </div>
            <button
              onClick={handleAddTime}
              disabled={isLoading || !timeToAdd || parseInt(timeToAdd) <= 0}
              className="w-full btn-primary bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm"
            >
              Add Time
            </button>
          </div>
        </div>
      </div>

      {/* Timer Information */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <h3 className="text-base font-medium text-white mb-3">Timer Information</h3>
        <div className="space-y-2">
          <p className="text-xs text-white/70 flex items-center">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
            Auto-saved and restored
          </p>
          <p className="text-xs text-white/70 flex items-center">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
            Works across restarts
          </p>
          <p className="text-xs text-white/70 flex items-center">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
            Perfect for streaming
          </p>
        </div>
      </div>
    </div>
  )
}

export default TimerControl

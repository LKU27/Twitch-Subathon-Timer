import React, { useState } from 'react'
import { useTimer } from '../context/TimerContext'

const TimerControl = () => {
  const { timerState, isLoading, startTimer, pauseTimer, resumeTimer, stopTimer, addTime } = useTimer()
  const [duration, setDuration] = useState({ hours: 0, minutes: 30, seconds: 0 })
  const [timeToAdd, setTimeToAdd] = useState(60)

  const handleStart = () => {
    startTimer()
  }

  const handleAddTime = () => {
    addTime(Math.floor(timeToAdd / 60)) // Convert seconds to minutes
  }

  const isRunning = timerState.isRunning
  const isPaused = !timerState.isRunning && timerState.totalTime > 0

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Timer Controls</h2>
      
      {/* Timer Status Display */}
      {!timerState.isRunning && timerState.totalTime === 0 && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-2">Ready to Start</h3>
          <p className="text-gray-300 text-sm">
            Click "Start Timer" to begin. You can add time while the timer is running.
          </p>
        </div>
      )}

      {/* Timer Status */}
      {timerState.isRunning && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white">Timer Status</h3>
              <p className="text-gray-300">
                {isRunning ? 'Running' : isPaused ? 'Paused' : 'Stopped'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Time</p>
              <p className="text-lg font-semibold text-green-400">
                {Math.floor(timerState.totalTime / 60000)}m {Math.floor((timerState.totalTime % 60000) / 1000)}s
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="space-y-4">
        {!timerState.isRunning ? (
          <button
            onClick={handleStart}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {isLoading ? 'Starting...' : 'Start Timer'}
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {isPaused ? (
              <button
                onClick={resumeTimer}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {isLoading ? 'Resuming...' : 'Resume'}
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                disabled={isLoading}
                className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {isLoading ? 'Pausing...' : 'Pause'}
              </button>
            )}
            <button
              onClick={stopTimer}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {isLoading ? 'Stopping...' : 'Stop'}
            </button>
          </div>
        )}
      </div>

      {/* Add Time Section */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Add Time</h3>
        <div className="flex space-x-3">
          <input
            type="number"
            min="1"
            value={timeToAdd}
            onChange={(e) => setTimeToAdd(parseInt(e.target.value) || 0)}
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            placeholder="Seconds to add"
          />
          <button
            onClick={handleAddTime}
            disabled={isLoading || timeToAdd <= 0}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Add
          </button>
        </div>
        <div className="mt-2 flex space-x-2">
          <button
            onClick={() => setTimeToAdd(60)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
          >
            +1m
          </button>
          <button
            onClick={() => setTimeToAdd(300)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
          >
            +5m
          </button>
          <button
            onClick={() => setTimeToAdd(600)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
          >
            +10m
          </button>
        </div>
      </div>

      {/* Timer Information */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Timer Information</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-400">
            • Timer state is automatically saved and restored
          </p>
          <p className="text-sm text-gray-400">
            • Works across browser restarts and PC shutdowns
          </p>
          <p className="text-sm text-gray-400">
            • Each user has their own independent timer
          </p>
        </div>
      </div>
    </div>
  )
}

export default TimerControl

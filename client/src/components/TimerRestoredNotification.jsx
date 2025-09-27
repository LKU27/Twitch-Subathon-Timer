import React from 'react'

const TimerRestoredNotification = ({ isVisible, onClose }) => {
  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-green-600 border border-green-500 rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">
              Timer Restored
            </h3>
            <p className="text-sm text-green-100 mt-1">
              Your timer has been restored from the previous session and is continuing where it left off.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-green-200 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimerRestoredNotification

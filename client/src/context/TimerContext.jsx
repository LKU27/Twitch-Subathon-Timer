import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const TimerContext = createContext();

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

export const TimerProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [timerState, setTimerState] = useState({
    isRunning: false,
    startTime: null,
    pausedTime: 0,
    totalTime: 0,
    lastUpdated: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRestored, setIsRestored] = useState(false);

  // Fetch timer state from server
  const fetchTimerState = async (isInitialLoad = false) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await axios.get('/api/timer/state', {
        timeout: 10000 // 10 second timeout
      });
      const newState = response.data;
      setTimerState(newState);
      
      // Check if timer was restored from a previous session
      if (isInitialLoad && newState.isRunning) {
        setIsRestored(true);
        // Hide the restored notification after 5 seconds
        setTimeout(() => setIsRestored(false), 5000);
      }
    } catch (error) {
      console.error('Failed to fetch timer state:', error);
      // Handle different error types
      if (error.response?.status === 429) {
        console.error('Rate limited - too many requests');
      } else if (error.code === 'ECONNABORTED') {
        console.error('Request timeout');
      } else if (error.response?.status === 401) {
        console.error('Authentication required');
      }
    }
  };

  // Start timer
  const startTimer = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/api/timer/start');
      if (response.data.message) {
        await fetchTimerState();
      }
    } catch (error) {
      console.error('Failed to start timer:', error);
      if (error.response?.status === 400) {
        console.error('Timer is already running');
      } else if (error.response?.status === 429) {
        console.error('Rate limited - please slow down');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Pause timer
  const pauseTimer = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/api/timer/pause');
      if (response.data.message) {
        await fetchTimerState();
      }
    } catch (error) {
      console.error('Failed to pause timer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Resume timer
  const resumeTimer = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/api/timer/resume');
      if (response.data.message) {
        await fetchTimerState();
      }
    } catch (error) {
      console.error('Failed to resume timer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Stop timer
  const stopTimer = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/api/timer/stop');
      if (response.data.message) {
        await fetchTimerState();
      }
    } catch (error) {
      console.error('Failed to stop timer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add time to timer
  const addTime = async (minutes) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/api/timer/add-time', { minutes });
      if (response.data.message) {
        await fetchTimerState();
      }
    } catch (error) {
      console.error('Failed to add time:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate current time remaining
  const getCurrentTimeRemaining = () => {
    if (!timerState.isRunning || !timerState.startTime) {
      return timerState.totalTime;
    }

    const now = new Date();
    const startTime = new Date(timerState.startTime);
    const elapsed = now - startTime;
    return timerState.totalTime + elapsed;
  };

  // Format time for display
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Auto-refresh timer state every second when running
  useEffect(() => {
    let interval;
    if (timerState.isRunning) {
      interval = setInterval(() => {
        // Update local state to show real-time countdown
        setTimerState(prev => ({ ...prev }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState.isRunning]);

  // Initial fetch when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTimerState(true);
    }
  }, [isAuthenticated]);

  const value = {
    timerState,
    isLoading,
    isRestored,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    addTime,
    formatTime,
    getCurrentTimeRemaining,
    fetchTimerState
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};
import React, { createContext, useContext, useState, useEffect } from 'react';

const TimerContext = createContext();

export const useTimer = () => {
  return useContext(TimerContext);
};

export const TimerProvider = ({ children }) => {
  const [timerState, setTimerState] = useState({
    isRunning: false,
    startTime: null,
    pausedTime: 0,
    totalTime: 0,
    lastUpdated: new Date().toISOString()
  });

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRestored, setIsRestored] = useState(false);

  // Load timer state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('subathon_timer_state');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setTimerState(parsedState);
      setIsRestored(true);
      
      // Calculate current time remaining
      if (parsedState.isRunning && parsedState.startTime) {
        const now = new Date();
        const startTime = new Date(parsedState.startTime);
        const elapsed = now - startTime;
        const remaining = Math.max(0, parsedState.totalTime - (parsedState.pausedTime + elapsed));
        setTimeRemaining(remaining);
      } else {
        // For paused or stopped timers, use the exact time remaining that was saved
        const remaining = parsedState.timeRemaining || (parsedState.totalTime - parsedState.pausedTime);
        setTimeRemaining(Math.max(0, remaining));
      }
    }
    setIsLoading(false);
  }, []);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const stateToSave = {
        ...timerState,
        timeRemaining: timeRemaining
      };
      localStorage.setItem('subathon_timer_state', JSON.stringify(stateToSave));
    }
  }, [timerState, timeRemaining, isLoading]);

  // Update time remaining every second when timer is running
  useEffect(() => {
    let interval;
    if (timerState.isRunning && timerState.startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const startTime = new Date(timerState.startTime);
        const elapsed = now - startTime;
        const remaining = Math.max(0, timerState.totalTime - (timerState.pausedTime + elapsed));
        setTimeRemaining(remaining);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.startTime, timerState.pausedTime, timerState.totalTime]);

  const startTimer = (durationMs = 0) => {
    const now = new Date().toISOString();
    const totalTime = timerState.totalTime > 0 ? timerState.totalTime : durationMs;
    setTimerState(prev => ({
      ...prev,
      isRunning: true,
      startTime: now,
      totalTime: totalTime,
      timeRemaining: totalTime,
      lastUpdated: now
    }));
    setTimeRemaining(totalTime);
  };

  const pauseTimer = () => {
    if (!timerState.isRunning) return;

    const now = new Date();
    const startTime = new Date(timerState.startTime);
    const elapsed = now - startTime;
    const currentTimeRemaining = Math.max(0, timerState.totalTime - (timerState.pausedTime + elapsed));
    
    const newState = {
      ...timerState,
      isRunning: false,
      pausedTime: timerState.pausedTime + elapsed,
      timeRemaining: currentTimeRemaining,
      lastUpdated: now.toISOString()
    };
    
    setTimerState(newState);
    setTimeRemaining(currentTimeRemaining);
  };

  const resumeTimer = () => {
    if (timerState.isRunning) return;

    const now = new Date().toISOString();
    setTimerState(prev => ({
      ...prev,
      isRunning: true,
      startTime: now,
      lastUpdated: now
    }));
  };

  const stopTimer = () => {
    setTimerState({
      isRunning: false,
      startTime: null,
      pausedTime: 0,
      totalTime: 0,
      timeRemaining: 0,
      lastUpdated: new Date().toISOString()
    });
    setTimeRemaining(0);
  };

  const addTime = (timeMs) => {
    setTimerState(prev => ({
      ...prev,
      totalTime: prev.totalTime + timeMs,
      lastUpdated: new Date().toISOString()
    }));
    
    // Update time remaining if timer is not running
    if (!timerState.isRunning) {
      setTimeRemaining(prev => prev + timeMs);
    }
  };

  const getCurrentTimeRemaining = () => {
    if (timerState.isRunning && timerState.startTime) {
      const now = new Date();
      const startTime = new Date(timerState.startTime);
      const elapsed = now - startTime;
      return Math.max(0, timerState.totalTime - (timerState.pausedTime + elapsed));
    }
    return Math.max(0, timerState.totalTime - timerState.pausedTime);
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const value = {
    timerState,
    timeRemaining,
    isLoading,
    isRestored,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    addTime,
    getCurrentTimeRemaining,
    formatTime
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};

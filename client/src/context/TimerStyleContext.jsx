import React, { createContext, useContext, useState, useEffect } from 'react';

const TimerStyleContext = createContext();

export const useTimerStyle = () => {
  const context = useContext(TimerStyleContext);
  if (!context) {
    throw new Error('useTimerStyle must be used within a TimerStyleProvider');
  }
  return context;
};

// Default timer style configuration
const defaultTimerStyle = {
  fontSize: '7xl',
  fontWeight: 'bold',
  textOutline: true,
  textOutlineThickness: 2,
  color: '#ffffff', // Default white color
};

export const TimerStyleProvider = ({ children }) => {
  const [timerStyle, setTimerStyle] = useState(defaultTimerStyle);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('subathon_timer_style');
      if (saved) {
        const parsedStyle = JSON.parse(saved);
        setTimerStyle({ ...defaultTimerStyle, ...parsedStyle });
      }
    } catch (error) {
      console.warn('Failed to load timer style from localStorage:', error);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever style changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('subathon_timer_style', JSON.stringify(timerStyle));
      } catch (error) {
        console.warn('Failed to save timer style to localStorage:', error);
      }
    }
  }, [timerStyle, isLoading]);

  // Update timer style function
  const updateTimerStyle = (updates) => {
    setTimerStyle(prevStyle => ({ ...prevStyle, ...updates }));
  };

  // Reset to default function
  const resetTimerStyle = () => {
    setTimerStyle(defaultTimerStyle);
  };

  // Generate CSS classes based on current style
  const getTimerClasses = () => {
    const classes = [];
    
    // Font weight
    classes.push(`font-${timerStyle.fontWeight}`);
    
    // Default font family (monospace)
    classes.push('font-mono');
    
    return classes.join(' ');
  };

  // Generate inline styles based on current style
  const getTimerStyles = () => {
    const fontSizeMap = {
      '5xl': '3rem',      // 48px
      '7xl': '4.5rem',    // 72px  
      '8xl': '6rem',      // 96px
    };

    const styles = {
      color: timerStyle.color || '#ffffff', // Use custom color or default to white
      fontSize: fontSizeMap[timerStyle.fontSize] || '4.5rem',
    };

    // Add text outline if enabled
    if (timerStyle.textOutline) {
      const thickness = timerStyle.textOutlineThickness;
      styles.WebkitTextStroke = `${thickness}px #000000`;
      styles.textShadow = `
        -${thickness}px -${thickness}px 0 #000,
         ${thickness}px -${thickness}px 0 #000,
        -${thickness}px  ${thickness}px 0 #000,
         ${thickness}px  ${thickness}px 0 #000
      `;
    }

    return styles;
  };

  const contextValue = {
    timerStyle,
    isLoading,
    updateTimerStyle,
    resetTimerStyle,
    getTimerClasses,
    getTimerStyles,
  };

  return (
    <TimerStyleContext.Provider value={contextValue}>
      {children}
    </TimerStyleContext.Provider>
  );
};
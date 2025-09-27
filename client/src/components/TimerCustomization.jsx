import React, { useState } from 'react';
import { useTimerStyle } from '../context/TimerStyleContext';

const TimerCustomization = () => {
  const { timerStyle, updateTimerStyle, resetTimerStyle, getTimerClasses, getTimerStyles } = useTimerStyle();
  const [isOpen, setIsOpen] = useState(false);

  // Font size mapping for slider
  const fontSizeValues = ['5xl', '7xl', '8xl'];
  const fontSizeLabels = ['Small', 'Medium', 'Large'];
  
  // Font weight mapping for slider  
  const fontWeightValues = ['normal', 'semibold', 'bold'];
  const fontWeightLabels = ['Normal', 'Semi Bold', 'Bold'];

  // Get current slider positions
  const getFontSizeIndex = () => fontSizeValues.indexOf(timerStyle.fontSize);
  const getFontWeightIndex = () => fontWeightValues.indexOf(timerStyle.fontWeight);

  // Handle slider changes
  const handleFontSizeChange = (index) => {
    updateTimerStyle({ fontSize: fontSizeValues[index] });
  };

  const handleFontWeightChange = (index) => {
    updateTimerStyle({ fontWeight: fontWeightValues[index] });
  };

  // Collapsed state
  if (!isOpen) {
    return (
      <div className="glass rounded-2xl p-6">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          🎨 Customize Timer Style
        </button>
      </div>
    );
  }

  // Expanded customization interface
  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Timer Customization</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/60 hover:text-white transition-colors text-xl"
        >
          ✕
        </button>
      </div>

      {/* Live Preview */}
      <div className="glass rounded-xl p-6 text-center">
        <h4 className="text-white/80 text-sm font-medium mb-4">Live Preview</h4>
        <div 
          className={`${getTimerClasses()} drop-shadow-2xl`}
          style={getTimerStyles()}
        >
          00:00:00
        </div>
      </div>

      {/* Font Size Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-white/80 text-sm font-medium">Font Size</label>
          <span className="text-white/60 text-sm">{fontSizeLabels[getFontSizeIndex()]}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max={fontSizeValues.length - 1}
            value={getFontSizeIndex()}
            onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-white/40 mt-1">
            {fontSizeLabels.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Font Weight Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-white/80 text-sm font-medium">Font Weight</label>
          <span className="text-white/60 text-sm">{fontWeightLabels[getFontWeightIndex()]}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max={fontWeightValues.length - 1}
            value={getFontWeightIndex()}
            onChange={(e) => handleFontWeightChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-white/40 mt-1">
            {fontWeightLabels.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="pt-4 border-t border-white/20">
        <button
          onClick={resetTimerStyle}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          🔄 Reset to Default
        </button>
      </div>
    </div>
  );
};

export default TimerCustomization;
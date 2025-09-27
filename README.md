# 🎯 Subathon Timer - Made by LK

A simple, powerful Subathon timer that works entirely in your browser - no database or server required!

## ✨ Features

- **⏱️ Persistent timer** - Survives browser refreshes and restarts
- **🎮 OBS integration** - Clean timer display for streaming
- **🎨 Customizable timer styles** - Change colors, fonts, and effects
- **📱 Responsive design** - Works on desktop and mobile
- **💾 Local storage** - All data saved in your browser
- **🚀 No setup required** - Just run and use!

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LKU27/Twitch-Subathon-Timer
   cd twitch-subathon-timer
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Go to `http://localhost:5173`
   - Start your subathon timer immediately!

## 🎮 OBS Integration

1. **Add Browser Source** in OBS
2. **URL**: `http://localhost:5173/obs`
3. **Settings**:
   - Width: 400px
   - Height: 200px
   - FPS: 30
   - Disable "Shutdown source when not visible"

## 📋 How to Use

### Using the Timer
1. **Start Timer**: Click "Start Timer" to begin
2. **Add Time**: Use the "Add Time" button to add minutes
3. **Pause/Resume**: Click "Pause" or "Resume" as needed
4. **Stop**: Click "Stop" to reset the timer

### Timer Persistence
- Timer state is automatically saved in your browser
- Survives page refreshes and browser restarts
- Timer style preferences are also saved locally

### Customizing Timer Style
1. Click "🎨 Customize Timer Style" button
2. Adjust font size, weight, and family
3. Choose text and status colors
4. Toggle visual effects (glow, shadow, animations)
5. Click "Save Changes" to apply

## 🛠️ Development

### Project Structure
```
twitch-subathon-timer/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React contexts
│   │   └── ...
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 Customization

The timer uses Tailwind CSS for styling. You can customize:
- Colors in `client/src/index.css`
- Components in `client/src/components/`
- Timer logic in `client/src/context/SimpleTimerContext.jsx`

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🔒 Data Storage

All data is stored locally in your browser using localStorage:
- Timer state: `subathon_timer_state`
- Timer style preferences: `subathon_timer_style`

**Note**: Data is tied to your browser and device. Clearing browser data will remove your timer state and preferences.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings

### Other Platforms
- Netlify
- GitHub Pages
- Any static hosting service

## 🐛 Troubleshooting

### Timer not persisting?
- Check if localStorage is enabled in your browser
- Try refreshing the page

### OBS not showing timer?
- Make sure the URL is correct: `http://localhost:5173/obs`
- Check OBS browser source settings
- Try refreshing the browser source

### App not loading?
- Make sure you're running `npm run dev`
- Check the console for errors
- Try clearing browser cache

## 📄 License

MIT License - feel free to use and modify!

## 👨‍💻 Made by LK

This project was created by LK. If you find it useful, consider giving it a star! ⭐

---

**⚠️ Beta Notice**: This application is currently in beta. Features may change in future updates.

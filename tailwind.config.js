/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        'display': ['Space Grotesk', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        'mono': ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      colors: {
        'dark-bg': '#1E1E1E',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'voice-pulse': 'voicePulse 1.6s ease-out infinite',
        'voice-breathe': 'voiceBreathe 3s ease-in-out infinite',
        'voice-speak': 'voiceSpeak 0.5s ease-in-out infinite',
        'orb-float-slow': 'orbFloatSlow 8s ease-in-out infinite',
        'orb-float-medium': 'orbFloatMedium 6s ease-in-out infinite',
        'orb-rotate': 'orbRotate 20s linear infinite',
        'orb-pulse-soft': 'orbPulseSoft 3.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        voicePulse: {
          '0%': { transform: 'scale(1)', opacity: '0.45' },
          '70%': { transform: 'scale(1.25)', opacity: '0' },
          '100%': { transform: 'scale(1.25)', opacity: '0' },
        },
        voiceBreathe: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)' },
        },
        voiceSpeak: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.10)' },
          '100%': { transform: 'scale(1)' },
        },
        orbFloatSlow: {
          '0%': { transform: 'translateY(0px) translateX(0px) scale(1)' },
          '50%': { transform: 'translateY(-10px) translateX(6px) scale(1.05)' },
          '100%': { transform: 'translateY(0px) translateX(0px) scale(1)' },
        },
        orbFloatMedium: {
          '0%': { transform: 'translateY(0px) translateX(0px) scale(1)' },
          '50%': { transform: 'translateY(12px) translateX(-8px) scale(0.98)' },
          '100%': { transform: 'translateY(0px) translateX(0px) scale(1)' },
        },
        orbRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        orbPulseSoft: {
          '0%': { transform: 'scale(1)', opacity: '0.65' },
          '50%': { transform: 'scale(1.06)', opacity: '0.85' },
          '100%': { transform: 'scale(1)', opacity: '0.65' },
        },
      },
    },
  },
  plugins: [],
}

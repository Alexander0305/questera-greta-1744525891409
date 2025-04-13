/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mass-effect': {
          blue: '#007CC2',
          red: '#ED1C24',
          orange: '#FF6B00',
          cyan: '#00A9CE',
          black: '#0E1012',
          'dark-blue': '#1A1C1E',
          'light-blue': '#4DA6FF',
          'neon': {
            blue: '#00a2ff',
            red: '#ff2d55',
            green: '#00ff9d',
            orange: '#ffa500',
            cyan: '#0096ff'
          }
        }
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(to right, #1a1c1e 1px, transparent 1px), linear-gradient(to bottom, #1a1c1e 1px, transparent 1px)',
        'matrix': 'repeating-linear-gradient(0deg, rgba(0, 162, 255, 0.05) 0px, rgba(0, 162, 255, 0.05) 1px, transparent 1px, transparent 2px)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'glow-blue': 'glowBlue 2s ease-in-out infinite alternate',
        'glow-red': 'glowRed 2s ease-in-out infinite alternate',
        'glow-green': 'glowGreen 2s ease-in-out infinite alternate',
        'glow-orange': 'glowOrange 2s ease-in-out infinite alternate',
        'glow-cyan': 'glowCyan 2s ease-in-out infinite alternate',
        'matrix-rain': 'matrixRain 20s linear infinite',
        'scanner': 'scanner 3s ease-in-out infinite'
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' }
        },
        glowBlue: {
          '0%': { boxShadow: '0 0 20px rgba(0, 162, 255, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 162, 255, 0.8)' }
        },
        glowRed: {
          '0%': { boxShadow: '0 0 20px rgba(255, 45, 85, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 45, 85, 0.8)' }
        },
        glowGreen: {
          '0%': { boxShadow: '0 0 20px rgba(0, 255, 157, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 255, 157, 0.8)' }
        },
        glowOrange: {
          '0%': { boxShadow: '0 0 20px rgba(255, 165, 0, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 165, 0, 0.8)' }
        },
        glowCyan: {
          '0%': { boxShadow: '0 0 20px rgba(0, 150, 255, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 150, 255, 0.8)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        matrixRain: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        scanner: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(100%)' }
        }
      }
    }
  },
  plugins: []
}
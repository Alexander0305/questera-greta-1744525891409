import React from 'react';
import { motion } from 'framer-motion';

export default function FuturisticContainer({ children, className = '', variant = 'default' }) {
  const variants = {
    default: {
      base: 'bg-mass-effect-dark-blue/80',
      border: 'border-mass-effect-light-blue/20',
      glow: 'from-mass-effect-blue/20 to-mass-effect-cyan/20'
    },
    neon: {
      base: 'bg-black/90',
      border: 'border-mass-effect-neon-blue',
      glow: 'from-mass-effect-neon-blue to-mass-effect-neon-cyan'
    },
    matrix: {
      base: 'bg-black/95',
      border: 'border-green-500/30',
      glow: 'from-green-500/20 to-green-300/20'
    }
  };

  const selectedVariant = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative
        ${selectedVariant.base}
        backdrop-blur-xl
        rounded-xl
        border
        ${selectedVariant.border}
        overflow-hidden
        ${className}
      `}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-cyber-grid bg-[length:20px_20px] opacity-10" />
      
      {/* Matrix rain effect */}
      <div className="absolute inset-0 bg-matrix opacity-10 animate-matrix-rain" />
      
      {/* Scanner effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mass-effect-light-blue/10 to-transparent h-1/2 animate-scanner" />
      
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${selectedVariant.glow} animate-pulse-slow`} />
      
      {/* Neon border effect */}
      <div className="absolute inset-0 rounded-xl border border-mass-effect-neon-blue animate-glow-blue" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
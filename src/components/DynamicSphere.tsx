import React, { useRef, useEffect, useState } from 'react';

interface DynamicSphereProps {
  state: 'idle' | 'listening' | 'thinking' | 'responding';
  intensity?: number; // 0-1 for voice input/output levels
  frequencyData?: number[]; // Array of frequency band values
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'fullscreen';
  className?: string;
  asBackground?: boolean;
  isConversationActive?: boolean; // Added this prop
}

const DynamicSphere: React.FC<DynamicSphereProps> = ({
  state = 'idle',
  intensity = 0,
  frequencyData = [],
  size = 'large',
  className = '',
  asBackground = false,
  isConversationActive = false // Default to false
}) => {
  const sphereRef = useRef<HTMLDivElement>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [bubbles, setBubbles] = useState<Array<{id: number, x: number, y: number, size: number, speed: number}>>([]);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-48 h-48',
    xlarge: 'w-64 h-64',
    fullscreen: 'w-full h-full'
  };

  // Generate floating bubbles
  useEffect(() => {
    const bubbleCount = state === 'responding' ? 12 : state === 'listening' ? 8 : 4;
    const newBubbles = Array.from({ length: bubbleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      speed: Math.random() * 2 + 1
    }));
    setBubbles(newBubbles);
  }, [state]);

  // Animation cycle for organic movement
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
    }, 50); // 20fps for smooth organic motion

    return () => clearInterval(interval);
  }, []);

  // Generate frequency bands visualization
  const renderFrequencyBands = () => {
    const bands = frequencyData.length > 0 ? frequencyData : Array.from({ length: 32 }, () => Math.random() * intensity);
    
    return bands.slice(0, 16).map((value, i) => {
      const angle = (i / 16) * 360;
      const height = Math.max(value * 40, 2);
      const radius = asBackground ? 45 : 35;
      
      return (
        <div
          key={i}
          className="absolute rounded-full opacity-70"
          style={{
            width: '3px',
            height: `${height}px`,
            background: state === 'responding' 
              ? `linear-gradient(to top, rgba(34, 197, 94, 0.8), rgba(74, 222, 128, 0.4))`
              : state === 'listening'
              ? `linear-gradient(to top, rgba(59, 130, 246, 0.8), rgba(147, 197, 253, 0.4))`
              : `linear-gradient(to top, rgba(168, 85, 247, 0.6), rgba(196, 181, 253, 0.3))`,
            left: '50%',
            top: '50%',
            transformOrigin: 'bottom center',
            transform: `
              translateX(-50%) 
              translateY(-${radius}px) 
              rotate(${angle}deg) 
              scaleY(${0.5 + value * 1.5})
            `,
            filter: 'blur(0.5px)',
            animation: `frequencyPulse 0.1s ease-out`,
          }}
        />
      );
    });
  };

  // Generate radial area chart
  const renderRadialChart = () => {
    const segments = 8;
    const chartData = Array.from({ length: segments }, (_, i) => {
      const baseValue = Math.sin(animationPhase * 0.02 + i * 0.5) * 0.3 + 0.7;
      return baseValue * intensity;
    });

    return chartData.map((value, i) => {
      const angle = (i / segments) * 360;
      const radius = 25 + value * 15;
      
      return (
        <div
          key={i}
          className="absolute rounded-full opacity-40"
          style={{
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            background: `conic-gradient(from 0deg, 
              rgba(59, 130, 246, ${value * 0.6}) 0deg, 
              transparent ${45 + value * 30}deg, 
              transparent 360deg)`,
            filter: 'blur(1px)',
          }}
        />
      );
    });
  };

  // Dynamic styles based on state and intensity
  const getDynamicStyles = () => {
    const baseIntensity = Math.max(0.2, intensity);
    const pulseScale = 1 + (baseIntensity * 0.2);
    const morphFactor = Math.sin(animationPhase * 0.02) * 0.05;
    
    switch (state) {
      case 'listening':
        return {
          transform: `scale(${pulseScale}) rotate(${animationPhase * 0.3}deg)`,
          filter: `brightness(${1.2 + baseIntensity * 0.4}) contrast(1.3) saturate(1.5) hue-rotate(${animationPhase * 0.1}deg)`,
          borderRadius: `${50 + morphFactor * 10}% ${50 - morphFactor * 8}% ${50 + morphFactor * 6}% ${50 - morphFactor * 12}%`,
        };
      
      case 'thinking':
        return {
          transform: `scale(${1.05 + Math.sin(animationPhase * 0.015) * 0.08}) rotate(${animationPhase * 0.2}deg)`,
          filter: `brightness(1.4) contrast(1.2) saturate(1.3) hue-rotate(${Math.sin(animationPhase * 0.008) * 45}deg)`,
          borderRadius: `${50 + Math.sin(animationPhase * 0.01) * 15}% ${50 + Math.cos(animationPhase * 0.012) * 12}% ${50 - Math.sin(animationPhase * 0.014) * 10}% ${50 + Math.cos(animationPhase * 0.016) * 18}%`,
        };
      
      case 'responding':
        return {
          transform: `scale(${1.15 + baseIntensity * 0.25}) rotate(${animationPhase * 0.5}deg)`,
          filter: `brightness(${1.5 + baseIntensity * 0.5}) contrast(1.4) saturate(1.7) hue-rotate(${animationPhase * 0.2}deg)`,
          borderRadius: `${50 + morphFactor * 20}% ${50 - morphFactor * 15}% ${50 + morphFactor * 18}% ${50 - morphFactor * 22}%`,
        };
      
      default: // idle
        return {
          transform: `scale(1.02) rotate(${animationPhase * 0.05}deg)`,
          filter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
          borderRadius: `${50 + Math.sin(animationPhase * 0.005) * 3}% ${50 + Math.cos(animationPhase * 0.007) * 2}% ${50 - Math.sin(animationPhase * 0.006) * 2}% ${50 + Math.cos(animationPhase * 0.008) * 3}%`,
        };
    }
  };

  const dynamicStyles = getDynamicStyles();

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Cosmic Background Aura */}
      <div
        className="absolute inset-0 pointer-events-none animate-orb-rotate"
        style={{
          background: `
            radial-gradient(circle at 50% 50%,
              rgba(59, 130, 246, ${0.15 + intensity * 0.25}) 0%,
              rgba(147, 197, 253, ${0.08 + intensity * 0.15}) 30%,
              rgba(168, 85, 247, ${0.05 + intensity * 0.1}) 60%,
              transparent 80%
            )
          `,
          transform: `scale(${3 + intensity * 1.5})`,
          filter: 'blur(40px)',
        }}
      />

      {/* Main Sphere Container */}
      <div
        ref={sphereRef}
        className="absolute inset-0 overflow-hidden transition-all duration-500 sphere-container"
        style={{
          ...dynamicStyles,
          boxShadow: `
            0 0 ${80 + intensity * 60}px ${30 + intensity * 40}px rgba(59, 130, 246, ${0.4 + intensity * 0.4}),
            0 0 ${160 + intensity * 100}px ${60 + intensity * 60}px rgba(147, 197, 253, ${0.2 + intensity * 0.3}),
            inset 0 0 ${60 + intensity * 40}px rgba(255, 255, 255, ${0.3 + intensity * 0.2})
          `,
        }}
      >
        {/* Liquid Chrome Base Layer */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 35% 25%, 
                rgba(255, 255, 255, 0.95) 0%,
                rgba(165, 200, 255, 0.85) 20%,
                rgba(96, 165, 250, 0.75) 45%,
                rgba(59, 130, 246, 0.8) 70%,
                rgba(29, 78, 216, 0.9) 100%
              )
            `,
            borderRadius: 'inherit',
          }}
        />

        {/* Holographic Gradient Overlay */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              conic-gradient(from ${animationPhase * 2}deg at 50% 50%,
                rgba(59, 130, 246, 0.5),
                rgba(147, 51, 234, 0.4),
                rgba(236, 72, 153, 0.5),
                rgba(34, 197, 94, 0.4),
                rgba(59, 130, 246, 0.5)
              )
            `,
            borderRadius: 'inherit',
            filter: 'blur(3px)',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Frequency Bands Visualization */}
        {(state === 'listening' || state === 'responding') && (
          <div className="absolute inset-0 pointer-events-none">
            {renderFrequencyBands()}
          </div>
        )}

        {/* Radial Area Chart */}
        {state === 'thinking' && (
          <div className="absolute inset-0 pointer-events-none">
            {renderRadialChart()}
          </div>
        )}

        {/* Floating Bubbles with Watery Flow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: 'inherit' }}>
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="absolute rounded-full opacity-60 animate-bubble-float"
              style={{
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                background: state === 'responding' 
                  ? `radial-gradient(circle, rgba(74, 222, 128, 0.8), rgba(34, 197, 94, 0.3))`
                  : state === 'listening'
                  ? `radial-gradient(circle, rgba(147, 197, 253, 0.8), rgba(59, 130, 246, 0.3))`
                  : `radial-gradient(circle, rgba(196, 181, 253, 0.7), rgba(168, 85, 247, 0.3))`,
                transform: `
                  translateY(${Math.sin(animationPhase * 0.01 + bubble.id) * 20}px) 
                  translateX(${Math.cos(animationPhase * 0.008 + bubble.id) * 15}px)
                  scale(${0.8 + Math.sin(animationPhase * 0.02 + bubble.id) * 0.4})
                `,
                filter: 'blur(1px)',
                animationDelay: `${bubble.id * 0.2}s`,
                animationDuration: `${3 + bubble.speed}s`,
              }}
            />
          ))}
        </div>

        {/* Watery Flow Lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: 'inherit' }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-40"
              style={{
                width: '2px',
                height: '100%',
                left: `${20 + i * 12}%`,
                background: `
                  linear-gradient(to bottom,
                    transparent 0%,
                    rgba(255, 255, 255, 0.6) ${20 + Math.sin(animationPhase * 0.01 + i) * 15}%,
                    rgba(59, 130, 246, 0.8) ${50 + Math.cos(animationPhase * 0.012 + i) * 20}%,
                    rgba(255, 255, 255, 0.4) ${80 + Math.sin(animationPhase * 0.008 + i) * 10}%,
                    transparent 100%
                  )
                `,
                transform: `
                  translateY(${Math.sin(animationPhase * 0.015 + i) * 10}px)
                  scaleY(${0.8 + intensity * 0.4})
                `,
                filter: 'blur(0.5px)',
              }}
            />
          ))}
        </div>

        {/* Liquid Surface Distortions */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse ${60 + Math.sin(animationPhase * 0.02) * 25}% ${55 + Math.cos(animationPhase * 0.018) * 20}% at 
                ${50 + Math.sin(animationPhase * 0.008) * 15}% ${50 + Math.cos(animationPhase * 0.012) * 12}%,
                rgba(255, 255, 255, ${0.4 + intensity * 0.3}) 0%,
                rgba(147, 197, 253, ${0.2 + intensity * 0.2}) 40%,
                transparent 75%
              )
            `,
            borderRadius: 'inherit',
            filter: 'blur(2px)',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Energy Flow Streams */}
        {(state === 'listening' || state === 'responding') && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: 'inherit' }}>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-1 opacity-50"
                style={{
                  top: `${25 + i * 15}%`,
                  background: `
                    linear-gradient(90deg,
                      transparent 0%,
                      rgba(255, 255, 255, 0.8) ${20 + Math.sin(animationPhase * 0.02 + i) * 30}%,
                      rgba(59, 130, 246, 0.9) ${50 + Math.cos(animationPhase * 0.015 + i) * 25}%,
                      rgba(255, 255, 255, 0.6) ${80 + Math.sin(animationPhase * 0.018 + i) * 15}%,
                      transparent 100%
                    )
                  `,
                  transform: `
                    translateX(${Math.sin(animationPhase * 0.01 + i) * 20}px)
                    scaleX(${0.6 + intensity * 0.8})
                  `,
                  filter: 'blur(1px)',
                }}
              />
            ))}
          </div>
        )}

        {/* Glassmorphism Surface */}
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(15px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: 'inherit',
          }}
        />

        {/* Inner Reflection Highlights */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(135deg,
                rgba(255, 255, 255, 0.6) 0%,
                transparent 30%,
                transparent 70%,
                rgba(255, 255, 255, 0.3) 100%
              )
            `,
            borderRadius: 'inherit',
            transform: `rotate(${animationPhase * 0.1}deg)`,
          }}
        />
      </div>

      {/* External Ripple Rings for Listening */}
      {state === 'listening' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full animate-ripple-expand"
              style={{
                border: `2px solid rgba(59, 130, 246, ${0.6 - i * 0.15})`,
                transform: `scale(${1.2 + i * 0.4})`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s',
              }}
            />
          ))}
        </div>
      )}

      {/* Wave Emission for Responding */}
      {state === 'responding' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full animate-wave-emission"
              style={{
                border: `3px solid rgba(34, 197, 94, ${0.7 - i * 0.14})`,
                transform: `scale(${1.1 + i * 0.5})`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1.2s',
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Energy Particles */}
      {state !== 'idle' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full opacity-70 animate-particle-orbit"
              style={{
                background: state === 'responding' 
                  ? 'rgba(74, 222, 128, 0.9)' 
                  : state === 'thinking'
                  ? 'rgba(196, 181, 253, 0.8)'
                  : 'rgba(147, 197, 253, 0.9)',
                left: '50%',
                top: '50%',
                transform: `
                  rotate(${animationPhase * 2 + i * 45}deg) 
                  translateX(${80 + intensity * 40}px) 
                  scale(${0.5 + intensity * 1.5})
                `,
                transformOrigin: '0 0',
                filter: `blur(${0.5 - intensity * 0.3}px)`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${4 + i * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Conversation Intensity Indicator */}
      {intensity > 0.1 && (
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            background: `
              radial-gradient(circle at 50% 50%,
                transparent 0%,
                rgba(59, 130, 246, ${intensity * 0.2}) 60%,
                rgba(59, 130, 246, ${intensity * 0.4}) 80%,
                transparent 100%
              )
            `,
            transform: `scale(${1.5 + intensity * 0.8})`,
            filter: 'blur(20px)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Longevity Progress Ring */}
      {isConversationActive && (
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(59, 130, 246, 0.6)"
              strokeWidth="2"
              strokeDasharray={`${intensity * 301.6} 301.6`}
              className="transition-all duration-300"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))',
              }}
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default DynamicSphere;
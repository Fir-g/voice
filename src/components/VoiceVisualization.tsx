import React, { useState, useEffect, useRef } from 'react';
import DynamicSphere from './DynamicSphere';

interface VoiceVisualizationProps {
  isListening: boolean;
  isThinking: boolean;
  isResponding: boolean;
  audioLevel?: number; // 0-1 for microphone input level
  responseLevel?: number; // 0-1 for AI response level
  frequencyData?: number[]; // Real-time frequency analysis data
  conversationDuration?: number; // Duration in seconds for longevity visualization
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'fullscreen';
  className?: string;
  asBackground?: boolean;
}

const VoiceVisualization: React.FC<VoiceVisualizationProps> = ({
  isListening,
  isThinking,
  isResponding,
  audioLevel = 0,
  responseLevel = 0,
  frequencyData = [],
  conversationDuration = 0,
  size = 'large',
  className = '',
  asBackground = false
}) => {
  const [currentState, setCurrentState] = useState<'idle' | 'listening' | 'thinking' | 'responding'>('idle');
  const [intensity, setIntensity] = useState(0);
  const [smoothedFrequencyData, setSmoothedFrequencyData] = useState<number[]>([]);
  const animationFrameRef = useRef<number>();
  const previousFrequencyRef = useRef<number[]>([]);

  // Determine current state based on props
  useEffect(() => {
    if (isResponding) {
      setCurrentState('responding');
      setIntensity(responseLevel);
    } else if (isThinking) {
      setCurrentState('thinking');
      setIntensity(0.4 + Math.sin(Date.now() * 0.003) * 0.2); // Dynamic thinking intensity
    } else if (isListening) {
      setCurrentState('listening');
      setIntensity(audioLevel);
    } else {
      setCurrentState('idle');
      setIntensity(0.1 + Math.sin(Date.now() * 0.001) * 0.05); // Subtle idle breathing
    }
  }, [isListening, isThinking, isResponding, audioLevel, responseLevel]);

  // Smooth frequency data transitions
  useEffect(() => {
    if (frequencyData.length > 0) {
      const smoothed = frequencyData.map((current, i) => {
        const previous = previousFrequencyRef.current[i] || 0;
        return previous + (current - previous) * 0.3; // Smooth interpolation
      });
      setSmoothedFrequencyData(smoothed);
      previousFrequencyRef.current = smoothed;
    } else {
      // Generate synthetic frequency data based on state and intensity
      const syntheticData = Array.from({ length: 32 }, (_, i) => {
        const baseFreq = Math.sin(Date.now() * 0.005 + i * 0.2) * 0.5 + 0.5;
        const stateMultiplier = currentState === 'responding' ? 1.5 : 
                              currentState === 'listening' ? 1.2 : 
                              currentState === 'thinking' ? 0.8 : 0.3;
        return baseFreq * intensity * stateMultiplier;
      });
      setSmoothedFrequencyData(syntheticData);
    }
  }, [frequencyData, currentState, intensity]);

  // Smooth intensity transitions with organic easing
  useEffect(() => {
    const targetIntensity = currentState === 'responding' ? responseLevel : 
                           currentState === 'listening' ? audioLevel : 
                           currentState === 'thinking' ? 0.4 + Math.sin(Date.now() * 0.003) * 0.2 : 
                           0.1 + Math.sin(Date.now() * 0.001) * 0.05;

    const smoothTransition = () => {
      setIntensity(prev => {
        const diff = targetIntensity - prev;
        if (Math.abs(diff) < 0.005) return targetIntensity;
        return prev + diff * 0.08; // Organic easing
      });
      animationFrameRef.current = requestAnimationFrame(smoothTransition);
    };

    animationFrameRef.current = requestAnimationFrame(smoothTransition);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioLevel, responseLevel, currentState]);

  return (
    <div className={`relative ${className}`}>
      {/* Main Dynamic Sphere */}
      <DynamicSphere
        state={currentState}
        intensity={intensity}
        frequencyData={smoothedFrequencyData}
        size={size}
        asBackground={asBackground}
      />

      {/* Enhanced State-specific Overlays */}
      {currentState === 'listening' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Microphone input visualization with frequency bands */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-32">
              {smoothedFrequencyData.slice(0, 12).map((value, i) => (
                <div
                  key={i}
                  className="absolute bg-blue-400 rounded-full opacity-70"
                  style={{
                    width: '2px',
                    height: `${8 + value * 30}px`,
                    left: '50%',
                    top: '50%',
                    transformOrigin: 'bottom center',
                    transform: `
                      translateX(-50%) 
                      translateY(-20px) 
                      rotate(${i * 30}deg)
                      scaleY(${0.5 + value * 2})
                    `,
                    boxShadow: `0 0 ${5 + value * 15}px rgba(59, 130, 246, 0.8)`,
                    filter: 'blur(0.3px)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Radial listening waves */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-30 animate-ripple-expand"
              style={{
                animationDelay: `${i * 0.4}s`,
                animationDuration: '2.5s',
              }}
            />
          ))}
        </div>
      )}

      {currentState === 'thinking' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Neural network visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-40 h-40">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-60"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `
                      translateX(-50%) 
                      translateY(-50%) 
                      rotate(${i * 60}deg) 
                      translateY(-${20 + Math.sin(Date.now() * 0.005 + i) * 10}px)
                      scale(${0.8 + Math.sin(Date.now() * 0.008 + i) * 0.4})
                    `,
                    boxShadow: `0 0 ${8 + Math.sin(Date.now() * 0.006 + i) * 6}px rgba(168, 85, 247, 0.8)`,
                    animation: `sphereCosmicPulse ${2 + i * 0.3}s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Thinking process radial chart */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-32 h-32 transform rotate-90" viewBox="0 0 100 100">
              {[...Array(8)].map((_, i) => {
                const progress = (Math.sin(Date.now() * 0.003 + i * 0.5) + 1) / 2;
                const circumference = 2 * Math.PI * (35 - i * 3);
                const strokeDasharray = `${progress * circumference} ${circumference}`;
                
                return (
                  <circle
                    key={i}
                    cx="50"
                    cy="50"
                    r={35 - i * 3}
                    fill="none"
                    stroke={`rgba(168, 85, 247, ${0.6 - i * 0.07})`}
                    strokeWidth="1"
                    strokeDasharray={strokeDasharray}
                    className="transition-all duration-300"
                    style={{
                      filter: `drop-shadow(0 0 ${4 + i}px rgba(168, 85, 247, 0.8))`,
                    }}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {currentState === 'responding' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* AI response frequency visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-48 h-48">
              {smoothedFrequencyData.slice(0, 20).map((value, i) => (
                <div
                  key={i}
                  className="absolute bg-green-400 rounded-full opacity-80"
                  style={{
                    width: '3px',
                    height: `${12 + value * 40}px`,
                    left: '50%',
                    top: '50%',
                    transformOrigin: 'bottom center',
                    transform: `
                      translateX(-50%) 
                      translateY(-30px) 
                      rotate(${i * 18}deg)
                      scaleY(${0.8 + value * 2.5})
                    `,
                    boxShadow: `0 0 ${8 + value * 20}px rgba(34, 197, 94, 0.9)`,
                    filter: 'blur(0.2px)',
                    animation: `frequencyPulse 0.08s ease-out`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Response wave emissions */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border-3 border-green-400 opacity-50 animate-wave-emission"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1.2s',
              }}
            />
          ))}

          {/* Radial response intensity chart */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-36 h-36" viewBox="0 0 100 100">
              {[...Array(6)].map((_, i) => {
                const progress = responseLevel * (0.8 + i * 0.1);
                const circumference = 2 * Math.PI * (40 - i * 5);
                const strokeDasharray = `${progress * circumference} ${circumference}`;
                
                return (
                  <circle
                    key={i}
                    cx="50"
                    cy="50"
                    r={40 - i * 5}
                    fill="none"
                    stroke={`rgba(34, 197, 94, ${0.7 - i * 0.1})`}
                    strokeWidth="2"
                    strokeDasharray={strokeDasharray}
                    className="transition-all duration-200"
                    style={{
                      filter: `drop-shadow(0 0 ${6 + i * 2}px rgba(34, 197, 94, 0.9))`,
                      transform: `rotate(${Date.now() * 0.05 + i * 30}deg)`,
                    }}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* Conversation Longevity Visualization */}
      {conversationDuration > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="49"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="0.5"
            />
            <circle
              cx="50"
              cy="50"
              r="49"
              fill="none"
              stroke="rgba(59, 130, 246, 0.4)"
              strokeWidth="1"
              strokeDasharray={`${(conversationDuration % 60) * 5.1} 307.9`}
              className="transition-all duration-1000"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.6))',
              }}
            />
          </svg>
        </div>
      )}

      {/* Interactive Hover Enhancement */}
      {!asBackground && (
        <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default VoiceVisualization;
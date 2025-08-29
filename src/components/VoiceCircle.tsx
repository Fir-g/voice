import React, { useMemo } from 'react';
import { VoiceCircleProps } from '../types';

const VoiceCircle: React.FC<VoiceCircleProps> = ({ size = 'large', className = '', state = 'idle', level = 0 }) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-48 h-48',
    xlarge: 'w-64 h-64'
  };

  const ringOpacity = Math.min(Math.max(level, 0), 1);
  const outerScale = useMemo(() => {
    if (state === 'speaking') return 1 + 0.15 * ringOpacity;
    if (state === 'listening') return 1 + 0.08 * ringOpacity;
    return 1;
  }, [state, ringOpacity]);

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer aura ring */}
      <div
        className={`absolute inset-0 rounded-full pointer-events-none mix-blend-screen ${
          state === 'idle' ? 'opacity-40' : 'opacity-60'
        } ${state === 'speaking' || state === 'listening' ? 'animate-orb-pulse-soft' : ''}`}
        style={{
          boxShadow: `0 0 80px 20px rgba(59,130,246,${0.25 + 0.35 * ringOpacity})`,
          transform: `scale(${outerScale})`,
        }}
      />

      {/* Ripples when active */}
      {(state === 'listening' || state === 'speaking') && (
        <div
          className={`absolute inset-0 rounded-full pointer-events-none ${
            state === 'speaking' ? 'animate-voice-pulse' : 'animate-voice-breathe'
          }`}
          style={{
            boxShadow: `0 0 0 2px rgba(96,165,250,${0.25 + 0.35 * ringOpacity}), 0 0 40px rgba(59,130,246,${0.2 + 0.3 * ringOpacity})`,
            transform: `scale(${outerScale})`,
          }}
        />
      )}

      {/* Core orb with subtle rotation */}
      <div className="absolute inset-0 rounded-full overflow-hidden shadow-xl">
        {/* Rotating gradient mask */}
        <div
          className="absolute inset-0 rounded-full animate-orb-rotate"
          style={{
            background:
              'conic-gradient(from 0deg at 50% 50%, rgba(59,130,246,0.25), rgba(255,255,255,0.2), rgba(96,165,250,0.35), rgba(59,130,246,0.25))',
            filter: 'blur(6px)',
          }}
        />

        {/* Base gradient */}
        <div
          className={`absolute inset-0 rounded-full ${state === 'speaking' ? 'animate-voice-speak' : ''}`}
          style={{
            background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #a5c8ff 35%, #60a5fa 65%, #2563eb 100%)',
          }}
        />

        {/* Floating blobs */}
        <div
          className="absolute w-1/2 h-1/2 -left-6 -top-4 rounded-full blur-2xl opacity-60 animate-orb-float-slow"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.55), rgba(147,197,253,0.15))',
          }}
        />
        <div
          className="absolute w-1/3 h-1/3 -right-3 top-6 rounded-full blur-xl opacity-70 animate-orb-float-medium"
          style={{
            background: 'radial-gradient(circle, rgba(96,165,250,0.65), rgba(59,130,246,0.10))',
          }}
        />
      </div>

      {/* Inner glow that intensifies with level */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: `inset 0 0 40px rgba(255,255,255,${0.25 + 0.35 * ringOpacity}), inset 0 0 80px rgba(59,130,246,${0.15 + 0.25 * ringOpacity})`
        }}
      />

      {/* Mute/paused overlay */}
      {(state === 'muted' || state === 'paused') && (
        <div className="absolute inset-0 rounded-full bg-black/30" />
      )}
    </div>
  );
};

export default VoiceCircle;

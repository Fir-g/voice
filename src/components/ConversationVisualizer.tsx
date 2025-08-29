import React, { useState, useEffect } from 'react';

interface ConversationVisualizerProps {
  isHumanSpeaking: boolean;
  isAISpeaking: boolean;
  humanIntensity: number;
  aiIntensity: number;
  conversationFlow: 'human-to-ai' | 'ai-to-human' | 'idle';
  className?: string;
}

const ConversationVisualizer: React.FC<ConversationVisualizerProps> = ({
  isHumanSpeaking,
  isAISpeaking,
  humanIntensity,
  aiIntensity,
  conversationFlow,
  className = ''
}) => {
  const [flowParticles, setFlowParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    direction: 'in' | 'out';
    speed: number;
    size: number;
  }>>([]);

  // Generate conversation flow particles
  useEffect(() => {
    if (conversationFlow === 'idle') {
      setFlowParticles([]);
      return;
    }

    const particleCount = Math.floor(4 + (humanIntensity + aiIntensity) * 8);
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      direction: conversationFlow === 'human-to-ai' ? 'in' : 'out',
      speed: 1 + Math.random() * 2,
      size: 2 + Math.random() * 4
    }));

    setFlowParticles(newParticles);
  }, [conversationFlow, humanIntensity, aiIntensity]);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Human Speech Input Visualization */}
      {isHumanSpeaking && (
        <div className="absolute inset-0">
          {/* Input energy streams flowing inward */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`human-${i}`}
              className="absolute opacity-60"
              style={{
                width: '2px',
                height: `${20 + humanIntensity * 40}px`,
                left: `${10 + i * 15}%`,
                top: '50%',
                background: `
                  linear-gradient(to bottom,
                    rgba(59, 130, 246, ${0.9 + humanIntensity * 0.1}) 0%,
                    rgba(147, 197, 253, ${0.6 + humanIntensity * 0.2}) 50%,
                    transparent 100%
                  )
                `,
                transform: `
                  translateY(-50%) 
                  translateX(${Math.sin(Date.now() * 0.005 + i) * 20}px)
                  scaleY(${0.5 + humanIntensity * 1.5})
                  rotate(${Math.sin(Date.now() * 0.003 + i) * 15}deg)
                `,
                filter: 'blur(0.5px)',
                animation: 'liquidFlow 2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}

          {/* Human speech frequency rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(4)].map((_, i) => (
              <div
                key={`human-ring-${i}`}
                className="absolute rounded-full border-2 opacity-40"
                style={{
                  width: `${100 + i * 40 + humanIntensity * 60}px`,
                  height: `${100 + i * 40 + humanIntensity * 60}px`,
                  borderColor: `rgba(59, 130, 246, ${0.6 - i * 0.15})`,
                  transform: `scale(${1 + humanIntensity * 0.3})`,
                  animation: `rippleExpand ${2 + i * 0.5}s ease-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* AI Response Output Visualization */}
      {isAISpeaking && (
        <div className="absolute inset-0">
          {/* Output energy streams flowing outward */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`ai-${i}`}
              className="absolute opacity-70"
              style={{
                width: '3px',
                height: `${30 + aiIntensity * 50}px`,
                left: '50%',
                top: '50%',
                transformOrigin: 'bottom center',
                background: `
                  linear-gradient(to top,
                    rgba(34, 197, 94, ${0.9 + aiIntensity * 0.1}) 0%,
                    rgba(74, 222, 128, ${0.7 + aiIntensity * 0.2}) 60%,
                    rgba(255, 255, 255, ${0.4 + aiIntensity * 0.3}) 100%
                  )
                `,
                transform: `
                  translateX(-50%) 
                  translateY(-${40 + aiIntensity * 30}px) 
                  rotate(${i * 45 + Math.sin(Date.now() * 0.004 + i) * 20}deg)
                  scaleY(${0.8 + aiIntensity * 2})
                `,
                filter: 'blur(0.3px)',
                animation: 'sphereEnergyFlow 1.5s ease-out infinite',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}

          {/* AI response wave emissions */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
              <div
                key={`ai-wave-${i}`}
                className="absolute rounded-full border-3 opacity-50"
                style={{
                  width: `${120 + i * 60 + aiIntensity * 80}px`,
                  height: `${120 + i * 60 + aiIntensity * 80}px`,
                  borderColor: `rgba(34, 197, 94, ${0.7 - i * 0.14})`,
                  transform: `scale(${1 + aiIntensity * 0.4})`,
                  animation: `waveEmission ${1 + i * 0.2}s ease-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Conversation Flow Particles */}
      <div className="absolute inset-0">
        {flowParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full opacity-80"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              background: particle.direction === 'in'
                ? `radial-gradient(circle, rgba(59, 130, 246, 0.9), rgba(147, 197, 253, 0.4))`
                : `radial-gradient(circle, rgba(34, 197, 94, 0.9), rgba(74, 222, 128, 0.4))`,
              transform: `
                translateX(${particle.direction === 'in' ? 
                  Math.sin(Date.now() * 0.003 + particle.id) * 30 : 
                  -Math.sin(Date.now() * 0.003 + particle.id) * 30}px)
                translateY(${Math.cos(Date.now() * 0.004 + particle.id) * 20}px)
                scale(${0.5 + (particle.direction === 'in' ? humanIntensity : aiIntensity) * 1.5})
              `,
              filter: `blur(${1 - (particle.direction === 'in' ? humanIntensity : aiIntensity) * 0.7}px)`,
              animation: `particleOrbit ${4 + particle.speed}s linear infinite`,
              animationDelay: `${particle.id * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Conversation Bridge Effect */}
      {(isHumanSpeaking || isAISpeaking) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="absolute w-1 opacity-60"
            style={{
              height: '80%',
              background: `
                linear-gradient(to bottom,
                  rgba(59, 130, 246, ${isHumanSpeaking ? humanIntensity : 0}) 0%,
                  rgba(255, 255, 255, 0.6) 50%,
                  rgba(34, 197, 94, ${isAISpeaking ? aiIntensity : 0}) 100%
                )
              `,
              transform: `
                scaleY(${0.6 + Math.max(humanIntensity, aiIntensity) * 0.8})
                scaleX(${1 + Math.max(humanIntensity, aiIntensity) * 2})
              `,
              filter: 'blur(1px)',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ConversationVisualizer;
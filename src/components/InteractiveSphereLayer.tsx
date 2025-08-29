import React, { useState, useEffect, useRef } from 'react';

interface InteractiveSphereLayerProps {
  state: 'idle' | 'listening' | 'thinking' | 'responding';
  intensity: number;
  frequencyData: number[];
  className?: string;
}

const InteractiveSphereLayer: React.FC<InteractiveSphereLayerProps> = ({
  state,
  intensity,
  frequencyData,
  className = ''
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      setMousePosition({
        x: (e.clientX - centerX) / (rect.width / 2),
        y: (e.clientY - centerY) / (rect.height / 2)
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Generate interactive frequency visualization
  const renderInteractiveFrequency = () => {
    const bands = frequencyData.length > 0 ? frequencyData : Array.from({ length: 24 }, () => Math.random() * intensity);
    
    return bands.map((value, i) => {
      const angle = (i / bands.length) * 360;
      const distance = 60 + value * 40;
      const mouseInfluence = isHovering ? Math.max(0, 1 - Math.abs(mousePosition.x) * 0.5) : 0;
      const finalValue = value + mouseInfluence * 0.3;
      
      return (
        <div
          key={i}
          className="absolute rounded-full transition-all duration-100"
          style={{
            width: '4px',
            height: `${8 + finalValue * 35}px`,
            left: '50%',
            top: '50%',
            transformOrigin: 'bottom center',
            transform: `
              translateX(-50%) 
              translateY(-${distance}px) 
              rotate(${angle + mousePosition.x * 10}deg)
              scaleY(${0.6 + finalValue * 2})
            `,
            background: state === 'responding' 
              ? `linear-gradient(to top, 
                  rgba(34, 197, 94, ${0.8 + mouseInfluence * 0.2}), 
                  rgba(74, 222, 128, ${0.4 + mouseInfluence * 0.3}))`
              : state === 'listening'
              ? `linear-gradient(to top, 
                  rgba(59, 130, 246, ${0.8 + mouseInfluence * 0.2}), 
                  rgba(147, 197, 253, ${0.4 + mouseInfluence * 0.3}))`
              : `linear-gradient(to top, 
                  rgba(168, 85, 247, ${0.6 + mouseInfluence * 0.2}), 
                  rgba(196, 181, 253, ${0.3 + mouseInfluence * 0.2}))`,
            boxShadow: `0 0 ${8 + finalValue * 20 + mouseInfluence * 15}px rgba(59, 130, 246, ${0.6 + mouseInfluence * 0.4})`,
            filter: `blur(${0.5 - mouseInfluence * 0.3}px)`,
          }}
        />
      );
    });
  };

  // Generate interactive bubble network
  const renderBubbleNetwork = () => {
    const bubbleCount = 12;
    return Array.from({ length: bubbleCount }, (_, i) => {
      const angle = (i / bubbleCount) * 360;
      const radius = 40 + Math.sin(Date.now() * 0.002 + i) * 20;
      const mouseInfluence = isHovering ? (1 - Math.abs(mousePosition.x - mousePosition.y) * 0.3) : 0;
      const size = 6 + intensity * 8 + mouseInfluence * 4;
      
      return (
        <div
          key={i}
          className="absolute rounded-full transition-all duration-200"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: '50%',
            top: '50%',
            transform: `
              translateX(-50%) 
              translateY(-50%) 
              rotate(${angle + mousePosition.x * 20}deg) 
              translateY(-${radius + mouseInfluence * 15}px)
              scale(${0.8 + intensity * 0.6 + mouseInfluence * 0.4})
            `,
            background: `
              radial-gradient(circle at 30% 30%, 
                rgba(255, 255, 255, ${0.9 + mouseInfluence * 0.1}), 
                rgba(147, 197, 253, ${0.6 + mouseInfluence * 0.2}), 
                rgba(59, 130, 246, ${0.3 + mouseInfluence * 0.3})
              )
            `,
            boxShadow: `
              0 0 ${12 + mouseInfluence * 8}px rgba(59, 130, 246, ${0.6 + mouseInfluence * 0.4}),
              inset 0 0 ${6 + mouseInfluence * 4}px rgba(255, 255, 255, ${0.4 + mouseInfluence * 0.2})
            `,
            filter: `blur(${1 - mouseInfluence * 0.5}px)`,
            opacity: 0.7 + mouseInfluence * 0.3,
          }}
        />
      );
    });
  };

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 pointer-events-auto cursor-pointer ${className}`}
    >
      {/* Interactive Frequency Bands */}
      {(state === 'listening' || state === 'responding') && (
        <div className="absolute inset-0 pointer-events-none">
          {renderInteractiveFrequency()}
        </div>
      )}

      {/* Interactive Bubble Network */}
      {state !== 'idle' && (
        <div className="absolute inset-0 pointer-events-none">
          {renderBubbleNetwork()}
        </div>
      )}

      {/* Mouse Interaction Glow */}
      {isHovering && (
        <div
          className="absolute w-32 h-32 rounded-full pointer-events-none transition-all duration-300"
          style={{
            left: '50%',
            top: '50%',
            transform: `
              translateX(-50%) 
              translateY(-50%) 
              translateX(${mousePosition.x * 30}px) 
              translateY(${mousePosition.y * 30}px)
              scale(${1 + intensity * 0.5})
            `,
            background: `
              radial-gradient(circle,
                rgba(255, 255, 255, ${0.2 + intensity * 0.3}) 0%,
                rgba(59, 130, 246, ${0.1 + intensity * 0.2}) 50%,
                transparent 100%
              )
            `,
            filter: 'blur(15px)',
          }}
        />
      )}

      {/* Conversation Flow Streams */}
      {(state === 'listening' || state === 'responding') && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-0.5 opacity-40"
              style={{
                top: `${30 + i * 20}%`,
                background: `
                  linear-gradient(90deg,
                    transparent 0%,
                    rgba(255, 255, 255, 0.8) ${25 + Math.sin(Date.now() * 0.003 + i) * 25}%,
                    rgba(59, 130, 246, 0.9) 50%,
                    rgba(255, 255, 255, 0.6) ${75 + Math.cos(Date.now() * 0.004 + i) * 20}%,
                    transparent 100%
                  )
                `,
                transform: `
                  translateX(${Math.sin(Date.now() * 0.002 + i) * 30 + mousePosition.x * 10}px)
                  scaleX(${0.7 + intensity * 0.6})
                  skewX(${mousePosition.x * 5}deg)
                `,
                filter: 'blur(1px)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InteractiveSphereLayer;
import React, { useRef, useEffect } from 'react';

interface VideoOrbProps {
  isPlaying: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'fullscreen';
  className?: string;
  asBackground?: boolean;
}

const VideoOrb: React.FC<VideoOrbProps> = ({ 
  isPlaying, 
  size = 'large', 
  className = '',
  asBackground = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-48 h-48',
    xlarge: 'w-64 h-64',
    fullscreen: 'w-full h-full'
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.currentTime = 0; // Reset to beginning
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, [isPlaying]);

  return (
    <div className={`relative ${sizeClasses[size]} ${className} animate-fade-in`}>
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full animate-orb-pulse-soft ${
          asBackground ? 'object-cover' : 'object-cover rounded-full'
        }`}
        muted
        loop
        playsInline
        style={{
          filter: asBackground ? 'brightness(1.1) contrast(1.2) saturate(1.4)' : 'brightness(1.2) contrast(1.1) saturate(1.3)',
          mixBlendMode: asBackground ? 'screen' : 'screen',
          transform: asBackground ? 'scale(1.1) rotate(0deg)' : 'rotate(0deg)',
          objectPosition: asBackground ? 'center center' : 'center center'
        }}
      >
        <source src="public\original-6433de79a34f799bf4a634cbbdda7967.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Animated glow effect */}
      <div 
        className={`absolute inset-0 pointer-events-none animate-orb-pulse-soft ${
          asBackground ? '' : 'rounded-full'
        }`}
        style={{
          boxShadow: asBackground 
            ? '0 0 200px 50px rgba(59,130,246,0.4), inset 0 0 100px rgba(255,255,255,0.2)' 
            : '0 0 80px 20px rgba(59,130,246,0.6), inset 0 0 40px rgba(255,255,255,0.3)'
        }}
      />
      
      {/* Additional floating elements for enhanced effect - only show if not background */}
      {!asBackground && (
        <>
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
        </>
      )}
    </div>
  );
};

export default VideoOrb;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoice } from '../hooks/useVoice';
import {
  CircularButton,
  IconButton,
  Modal,
  MicrophoneIcon,
  MicrophoneOffIcon,
  PlayIcon,
  PauseIcon,
  RestartIcon,
  SettingsIcon
} from './ui';

const VoiceCall: React.FC = () => {
  const navigate = useNavigate();
  const voiceContext = useVoice();
  const videoRef = useRef<HTMLVideoElement>(null);

  const { 
    isConversationActive, 
    isPaused, 
    isInitialized,
    error,
    startConversation, 
    pauseConversation, 
    restartConversation, 
    currentVoice,
    resumeConversation
  } = voiceContext;
  
  // Use context mute state
  const [isMuted, setIsMuted] = useState<boolean>(voiceContext.isMuted);
  const [showConfirmRestart, setShowConfirmRestart] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Video playback logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Add event listeners for debugging
    video.addEventListener('loadeddata', () => {
      console.log('Video loaded successfully');
    });

    video.addEventListener('error', (e) => {
      console.error('Video error:', e);
    });

    // Play video when AI is actively speaking (conversation active, not paused, not muted)
    if (isConversationActive && !isPaused && !isMuted && isInitialized) {
      video.currentTime = 0; // Reset to beginning
      video.play().catch(console.error);
    } else {
      // Pause video in all other scenarios
      video.pause();
    }
  }, [isConversationActive, isPaused, isMuted, isInitialized]);

  const handlePlayPauseClick = async (): Promise<void> => {
    if (!isInitialized) {
      console.error('Voice assistant not initialized');
      return;
    }

    setIsLoading(true);
    try {
      if (!isConversationActive) {
        await startConversation();
      } else if (isPaused) {
        await resumeConversation(); // Fixed: use resumeConversation instead of startConversation
      } else {
        await pauseConversation();
      }
    } catch (err) {
      console.error('Failed to handle play/pause:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMuteToggle = (): void => {
    const next = !isMuted;
    setIsMuted(next);
    voiceContext.setMuted(next);
    console.log('Mute toggled:', next);
  };

  const handleRequestRestart = (): void => {
    setShowConfirmRestart(true);
  };

  const handleConfirmRestart = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await restartConversation();
      setShowConfirmRestart(false);
    } catch (err) {
      console.error('Failed to restart conversation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRestart = (): void => {
    setShowConfirmRestart(false);
  };

  const handleSettingsClick = (): void => {
    navigate('/choose-voice');
  };

  // Get microphone button state
  const getMicButtonState = () => {
    if (isMuted) {
      return {
        bgColor: 'bg-red-600 hover:bg-red-700',
        iconColor: 'text-white',
        icon: <MicrophoneOffIcon />,
        ariaLabel: 'Unmute microphone'
      };
    } else {
      return {
        bgColor: 'bg-gray-300 hover:bg-gray-400',
        iconColor: 'text-gray-700',
        icon: <MicrophoneIcon />,
        ariaLabel: 'Mute microphone'
      };
    }
  };

  // Get play/pause button state
  const getPlayPauseButtonState = () => {
    if (!isInitialized) {
      return {
        bgColor: 'bg-gray-300 hover:bg-gray-400',
        iconColor: 'text-gray-700',
        icon: <PlayIcon />,
        ariaLabel: 'Voice assistant not initialized'
      };
    }

    if (!isConversationActive) {
      return {
        bgColor: 'bg-gray-300 hover:bg-gray-400',
        iconColor: 'text-gray-700',
        icon: <PlayIcon />,
        ariaLabel: 'Start conversation'
      };
    } else if (isPaused) {
      return {
        bgColor: 'bg-gray-300 hover:bg-gray-400',
        iconColor: 'text-gray-700',
        icon: <PlayIcon />,
        ariaLabel: 'Resume conversation'
      };
    } else {
      return {
        bgColor: 'bg-gray-300 hover:bg-gray-400',
        iconColor: 'text-gray-700',
        icon: <PauseIcon />,
        ariaLabel: 'Pause conversation'
      };
    }
  };

  const micButtonState = getMicButtonState();
  const playPauseButtonState = getPlayPauseButtonState();

  // Determine if video should be playing
  const isVideoPlaying = isConversationActive && !isPaused && !isMuted && isInitialized;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
             {/* Video Orb - full screen background */}
       <div className="absolute inset-0 z-0">
                   <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            playsInline
            style={{
              filter: 'brightness(1.2) contrast(1.1) saturate(1.3)',
              mixBlendMode: 'screen',
              transform: 'scale(0.6)',
              transformOrigin: 'center center'
            }}
          >
           <source src="/original-6433de79a34f799bf4a634cbbdda7967.mp4" type="video/mp4" />
           Your browser does not support the video tag.
         </video>
       </div>

      {/* Semi-transparent overlay for better text readability when video is playing */}
      {isVideoPlaying && (
        <div className="absolute inset-0 bg-black bg-opacity-20 z-0" />
      )}

      {/* Settings Button */}
      <IconButton
        onClick={handleSettingsClick}
        icon={<SettingsIcon />}
        ariaLabel="Switch voice"
        className="absolute top-6 right-6 z-10"
      />

             <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md animate-fade-in relative z-10">

        {/* Error Display */}
        {error && (
          <div className="text-center mb-4">
            <div className={`text-sm px-4 py-2 rounded-lg max-w-md font-medium ${
              isVideoPlaying
                ? 'text-red-300 bg-red-900 bg-opacity-40 drop-shadow-lg' 
                : 'text-red-400 bg-red-900 bg-opacity-20'
            }`}>
              {error}
              {error.includes('API key') && (
                <div className={`mt-2 text-xs font-mono ${
                  isVideoPlaying ? 'text-red-200' : 'text-red-300'
                }`}>
                  <p>1. Create a .env file in your project root</p>
                  <p>2. Add: VITE_OPENAI_API_KEY=your_api_key_here</p>
                  <p>3. Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a></p>
                </div>
              )}
            </div>
          </div>
        )}


      </div>

      {/* Bottom Control Buttons */}
      <div className="flex items-center justify-center space-x-8 mb-8 relative z-10">
        {/* Microphone Button */}
        <CircularButton
          onClick={handleMuteToggle}
          icon={micButtonState.icon}
          bgColor={micButtonState.bgColor}
          iconColor={micButtonState.iconColor}
          ariaLabel={micButtonState.ariaLabel}
        />

        {/* Play/Pause Button */}
        <CircularButton
          onClick={handlePlayPauseClick}
          icon={playPauseButtonState.icon}
          bgColor={playPauseButtonState.bgColor}
          iconColor={playPauseButtonState.iconColor}
          ariaLabel={playPauseButtonState.ariaLabel}
        />

        {/* Restart Button - visible only when paused */}
        {isConversationActive && isPaused && isInitialized && (
          <CircularButton
            onClick={handleRequestRestart}
            icon={<RestartIcon />}
            bgColor="bg-gray-300 hover:bg-gray-400"
            iconColor="text-gray-700"
            ariaLabel="Restart conversation"
          />
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="text-white text-lg font-display font-medium">Processing...</div>
        </div>
      )}

      {/* Confirm Restart Modal */}
      <Modal
        isOpen={showConfirmRestart}
        title="Restart conversation?"
      >
        <p className="text-gray-300 text-sm mb-6">
          This will reset the current session. Do you want to continue?
        </p>
        <div className="flex space-x-3">
          <button
            onClick={handleConfirmRestart}
            disabled={isLoading}
            className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors duration-200"
          >
            {isLoading ? 'Processing...' : 'Restart'}
          </button>
          <button
            onClick={handleCancelRestart}
            disabled={isLoading}
            className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-black py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default VoiceCall;

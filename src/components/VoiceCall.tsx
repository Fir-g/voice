import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoice } from '../hooks/useVoice';
import VoiceVisualization from './VoiceVisualization';
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
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [responseLevel, setResponseLevel] = useState<number>(0);
  const [frequencyData, setFrequencyData] = useState<number[]>([]);
  const [conversationStartTime, setConversationStartTime] = useState<number>(0);
  const [conversationDuration, setConversationDuration] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Track conversation duration
  useEffect(() => {
    if (isConversationActive && !isPaused) {
      if (conversationStartTime === 0) {
        setConversationStartTime(Date.now());
      }
      
      const interval = setInterval(() => {
        setConversationDuration(Math.floor((Date.now() - conversationStartTime) / 1000));
      }, 1000);
      
      return () => clearInterval(interval);
    } else if (!isConversationActive) {
      setConversationStartTime(0);
      setConversationDuration(0);
    }
  }, [isConversationActive, isPaused, conversationStartTime]);

  // Audio level monitoring for visualization
  useEffect(() => {
    if (!isConversationActive || isPaused || isMuted) {
      setAudioLevel(0);
      setResponseLevel(0);
      setFrequencyData([]);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    // Initialize audio context for level monitoring
    const initAudioMonitoring = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
        }

        // Get microphone stream for input level monitoring
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);

        // Monitor audio levels
        const monitorLevels = () => {
          if (!analyserRef.current) return;
          
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average level
          const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          const normalizedLevel = Math.min(average / 128, 1);
          
          setAudioLevel(normalizedLevel);
          
          // Extract frequency bands for visualization (32 bands)
          const bandSize = Math.floor(bufferLength / 32);
          const frequencyBands = Array.from({ length: 32 }, (_, i) => {
            const start = i * bandSize;
            const end = start + bandSize;
            const bandData = dataArray.slice(start, end);
            const bandAverage = bandData.reduce((sum, val) => sum + val, 0) / bandData.length;
            return Math.min(bandAverage / 255, 1);
          });
          setFrequencyData(frequencyBands);
          
          // Simulate AI response level (in real implementation, this would come from the AI service)
          if (isConversationActive && !isPaused) {
            const responseIntensity = Math.sin(Date.now() * 0.008) * 0.4 + 0.6;
            const responseVariation = Math.sin(Date.now() * 0.003) * 0.2;
            setResponseLevel(Math.max(0.1, responseIntensity + responseVariation));
          }
          
          animationFrameRef.current = requestAnimationFrame(monitorLevels);
        };
        
        monitorLevels();
      } catch (error) {
        console.error('Failed to initialize audio monitoring:', error);
      }
    };

    initAudioMonitoring();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isConversationActive, isPaused, isMuted]);

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

  // Determine sphere visualization state
  const getVisualizationState = () => {
    if (!isConversationActive || !isInitialized) return { isListening: false, isThinking: false, isResponding: false };
    if (isPaused) return { isListening: false, isThinking: true, isResponding: false };
    if (isMuted) return { isListening: false, isThinking: true, isResponding: false };
    
    // Simulate AI response detection (in real implementation, this would come from the AI service)
    const isAIResponding = responseLevel > 0.3;
    
    return {
      isListening: !isAIResponding,
      isThinking: false,
      isResponding: isAIResponding
    };
  };

  const visualizationState = getVisualizationState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Sphere Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <VoiceVisualization
          isListening={visualizationState.isListening}
          isThinking={visualizationState.isThinking}
          isResponding={visualizationState.isResponding}
          audioLevel={audioLevel}
          responseLevel={responseLevel}
          size="fullscreen"
          asBackground={true}
        />
      </div>

      {/* Semi-transparent overlay for better text readability */}
      {(visualizationState.isListening || visualizationState.isResponding) && (
        <div className="absolute inset-0 bg-black bg-opacity-20 z-0" />
      )}

      {/* Settings Button */}
      <IconButton
        onClick={handleSettingsClick}
        icon={<SettingsIcon />}
        ariaLabel="Switch voice"
        className="absolute top-6 right-6 z-10"
      />

      {/* Main Content Area */}
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md animate-fade-in relative z-10">
        {/* Central Voice Sphere */}
        <div className="mb-8">
          <VoiceVisualization
            isListening={visualizationState.isListening}
            isThinking={visualizationState.isThinking}
            isResponding={visualizationState.isResponding}
            audioLevel={audioLevel}
            responseLevel={responseLevel}
            frequencyData={frequencyData}
            conversationDuration={conversationDuration}
            frequencyData={frequencyData}
            conversationDuration={conversationDuration}
            frequencyData={frequencyData}
            conversationDuration={conversationDuration}
            size="xlarge"
          />
        </div>

        {/* Voice Name Display */}
        {currentVoice && (
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-display font-semibold mb-2 transition-colors duration-300 ${
              visualizationState.isResponding ? 'text-green-300 drop-shadow-lg' :
              visualizationState.isListening ? 'text-blue-300 drop-shadow-lg' :
              visualizationState.isThinking ? 'text-purple-300 drop-shadow-lg' :
              'text-white'
            }`}>
              {currentVoice.name}
            </h2>
            <p className={`text-sm font-light ${
              (visualizationState.isListening || visualizationState.isResponding) 
                ? 'text-gray-200 drop-shadow-md' 
                : 'text-gray-400'
            }`}>
              {currentVoice.description}
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="text-center mb-4">
            <div className={`text-sm px-4 py-2 rounded-lg max-w-md font-medium ${
              (visualizationState.isListening || visualizationState.isResponding)
                ? 'text-red-300 bg-red-900 bg-opacity-40 drop-shadow-lg' 
                : 'text-red-400 bg-red-900 bg-opacity-20'
            }`}>
              {error}
              {error.includes('API key') && (
                <div className={`mt-2 text-xs font-mono ${
                  (visualizationState.isListening || visualizationState.isResponding) ? 'text-red-200' : 'text-red-300'
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

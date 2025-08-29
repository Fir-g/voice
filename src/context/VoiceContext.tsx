import React, { createContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import { Voice, VoiceContextType } from '../types';
import { RealtimeService } from '../services/realtimeService';
 

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

interface VoiceProviderProps {
  children: ReactNode;
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const [selectedVoice, setSelectedVoice] = useState<number>(0);
  const [voices, setVoices] = useState<Voice[]>([]);

  // Conversation state
  const [isConversationActive, setIsConversationActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Realtime service ref
  const realtimeRef = useRef<RealtimeService | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  // Initialize realtime service and fetch voices list
  useEffect(() => {
    let isMounted = true;

    const initializeService = async () => {
      try {
        console.log('Creating Realtime service');
        realtimeRef.current = new RealtimeService({
          serverBaseUrl: import.meta.env.VITE_SERVER_BASE_URL,
        });
        if (isMounted) {
          setIsInitialized(true);
          setError(null);
          console.log('Realtime service initialized successfully');
        }
      } catch (err) {
        console.error('Failed to initialize realtime service:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize voice assistant');
          setIsInitialized(false);
        }
      }
    };

    const fetchVoices = async () => {
      // Use a fixed set of supported voices as requested
      const fixed: Voice[] = [
        { id: 'alloy', name: 'Alloy', description: 'Balanced and clear', realtimeVoice: 'alloy' },
        { id: 'ash', name: 'Ash', description: 'Warm and calm', realtimeVoice: 'ash' },
        { id: 'ballad', name: 'Ballad', description: 'Narrative and lyrical', realtimeVoice: 'ballad' },
        { id: 'coral', name: 'Coral', description: 'Bright and friendly', realtimeVoice: 'coral' },
        { id: 'echo', name: 'Echo', description: 'Crisp and lively', realtimeVoice: 'echo' },
        { id: 'sage', name: 'Sage', description: 'Calm and thoughtful', realtimeVoice: 'sage' },
        { id: 'shimmer', name: 'Shimmer', description: 'Sparkling and energetic', realtimeVoice: 'shimmer' },
        { id: 'verse', name: 'Verse', description: 'Expressive and dynamic', realtimeVoice: 'verse' }
      ];

      if (isMounted) {
        setVoices(fixed);
        setSelectedVoice(0);
        setIsInitialLoad(false);
      }
    };

    initializeService();
    fetchVoices();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      // Clean up realtime service if it exists
      if (realtimeRef.current) {
        realtimeRef.current.stop().catch(console.error);
        realtimeRef.current = null;
      }
    };
  }, []);

  const nextVoice = (): void => {
    if (voices.length === 0) return;
    setSelectedVoice((prev) => (prev + 1) % voices.length);
  };

  const prevVoice = (): void => {
    if (voices.length === 0) return;
    setSelectedVoice((prev) => (prev - 1 + voices.length) % voices.length);
  };

  const startConversation = useCallback(async (): Promise<void> => {
    try {
      if (!realtimeRef.current || !isInitialized) {
        throw new Error('Voice assistant not initialized');
      }
      const currentVoice = voices[selectedVoice];
      const mapped = currentVoice?.realtimeVoice || 'verse';
      await realtimeRef.current.start(mapped);
      setIsConversationActive(true);
      setIsPaused(false);
      setError(null);
      console.log('Starting conversation with voice:', voices[selectedVoice]?.name || 'unknown');
    } catch (err) {
      console.error('Failed to start conversation:', err);
      setError(err instanceof Error ? err.message : 'Failed to start conversation');
      throw err;
    }
  }, [isInitialized, selectedVoice, voices]);

  const pauseConversation = useCallback(async (): Promise<void> => {
    try {
      if (!realtimeRef.current) {
        throw new Error('Conversation service not available');
      }
      await realtimeRef.current.pause();
      setIsPaused(true);
      setError(null);
      console.log('Pausing conversation');
    } catch (err) {
      console.error('Failed to pause conversation:', err);
      setError(err instanceof Error ? err.message : 'Failed to pause conversation');
      throw err;
    }
  }, []);

  const resumeConversation = useCallback(async (): Promise<void> => {
    try {
      if (!realtimeRef.current) {
        throw new Error('Conversation service not available');
      }
      await realtimeRef.current.resume();
      setIsPaused(false);
      setError(null);
      console.log('Resuming conversation');
    } catch (err) {
      console.error('Failed to resume conversation:', err);
      setError(err instanceof Error ? err.message : 'Failed to resume conversation');
      throw err;
    }
  }, []);

  const restartConversation = useCallback(async (): Promise<void> => {
    try {
      if (!realtimeRef.current) {
        throw new Error('Conversation service not available');
      }
      await realtimeRef.current.stop();
      const currentVoice = voices[selectedVoice];
      const mapped = currentVoice?.realtimeVoice || 'verse';
      await realtimeRef.current.start(mapped);
      setIsConversationActive(true);
      setIsPaused(false);
      setError(null);
      console.log('Restarting conversation');
    } catch (err) {
      console.error('Failed to restart conversation:', err);
      setError(err instanceof Error ? err.message : 'Failed to restart conversation');
      throw err;
    }
  }, [selectedVoice, voices]);

  const stopConversation = useCallback(async (): Promise<void> => {
    try {
      if (!realtimeRef.current) {
        return;
      }
      await realtimeRef.current.stop();
      setIsConversationActive(false);
      setIsPaused(false);
      setError(null);
      console.log('Stopping conversation');
    } catch (err) {
      console.error('Failed to stop conversation:', err);
      setError(err instanceof Error ? err.message : 'Failed to stop conversation');
      throw err;
    }
  }, []);

  const setMuted = useCallback((muted: boolean): void => {
    setIsMuted(muted);
    if (realtimeRef.current) {
      realtimeRef.current.setMuted(muted);
    }
  }, []);

  // Update voice configuration when voice changes
  useEffect(() => {
    // Ensure selectedVoice is valid when voices array changes
    if (voices.length > 0 && selectedVoice >= voices.length) {
      setSelectedVoice(0);
    }
  }, [selectedVoice, voices, isInitialized, isConversationActive]);

  // Auto-restart conversation when voice changes
  useEffect(() => {
    // Only restart if there's an active conversation, the service is initialized, and it's not the initial load
    if (isConversationActive && isInitialized && realtimeRef.current && !isInitialLoad) {
      const restartWithNewVoice = async () => {
        try {
          console.log('Voice changed, restarting conversation with new voice');
          await restartConversation();
        } catch (err) {
          console.error('Failed to restart conversation with new voice:', err);
        }
      };
      
      restartWithNewVoice();
    }
  }, [selectedVoice, isInitialLoad, isConversationActive, isInitialized, restartConversation]);

  const value: VoiceContextType = {
    selectedVoice,
    setSelectedVoice,
    voices,
    currentVoice: voices[selectedVoice],
    nextVoice,
    prevVoice,
    isConversationActive,
    isPaused,
    isInitialized,
    error,
    startConversation,
    pauseConversation,
    resumeConversation,
    restartConversation,
    stopConversation,
    isMuted,
    setMuted
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};

export { VoiceContext };

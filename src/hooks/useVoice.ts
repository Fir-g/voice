import { useContext } from 'react';
import { VoiceContext } from '../context/VoiceContext';
import { VoiceContextType } from '../types';

// Custom hook for voice context
export const useVoice = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  
  if (!context) {
    console.error('useVoice hook called outside of VoiceProvider');
    throw new Error('useVoice must be used within a VoiceProvider. Please ensure the component is wrapped with VoiceProvider.');
  }
  
  return context;
};

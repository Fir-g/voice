export interface Voice {
  id: string;
  name: string;
  description: string;
  // Name expected by the Realtime API (e.g., "verse", "alloy")
  realtimeVoice: string;
}

export interface VoiceContextType {
  selectedVoice: number;
  setSelectedVoice: (index: number) => void;
  voices: Voice[];
  currentVoice: Voice | undefined;
  nextVoice: () => void;
  prevVoice: () => void;
  // Conversation state
  isConversationActive: boolean;
  isPaused: boolean;
  isInitialized: boolean;
  error: string | null;
  startConversation: () => Promise<void>;
  pauseConversation: () => Promise<void>;
  resumeConversation: () => Promise<void>;
  restartConversation: () => Promise<void>;
  stopConversation: () => Promise<void>;
  isMuted: boolean;
  setMuted: (muted: boolean) => void;
}

export interface VoiceCircleProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
  state?: 'idle' | 'listening' | 'speaking' | 'muted' | 'paused';
  level?: number; // 0..1 visual intensity when listening/speaking
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

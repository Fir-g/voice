import React, { useRef, useEffect, useState } from 'react';

interface AudioAnalyzerProps {
  isActive: boolean;
  onAudioLevel: (level: number) => void;
  onFrequencyData: (data: number[]) => void;
  smoothingTimeConstant?: number;
}

const AudioAnalyzer: React.FC<AudioAnalyzerProps> = ({
  isActive,
  onAudioLevel,
  onFrequencyData,
  smoothingTimeConstant = 0.8
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize audio context and analyzer
  useEffect(() => {
    if (!isActive) {
      cleanup();
      return;
    }

    const initializeAudio = async () => {
      try {
        // Create audio context
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create analyzer node
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 512; // Higher resolution for better frequency analysis
        analyserRef.current.smoothingTimeConstant = smoothingTimeConstant;
        analyserRef.current.minDecibels = -90;
        analyserRef.current.maxDecibels = -10;

        // Get microphone stream
        microphoneStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 44100,
          }
        });

        // Connect microphone to analyzer
        const source = audioContextRef.current.createMediaStreamSource(microphoneStreamRef.current);
        source.connect(analyserRef.current);

        setIsInitialized(true);
        startAnalysis();
      } catch (error) {
        console.error('Failed to initialize audio analyzer:', error);
        cleanup();
      }
    };

    initializeAudio();

    return cleanup;
  }, [isActive, smoothingTimeConstant]);

  const startAnalysis = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeDataArray = new Uint8Array(bufferLength);

    const analyze = () => {
      if (!analyserRef.current || !isActive) return;

      // Get frequency data
      analyserRef.current.getByteFrequencyData(dataArray);
      analyserRef.current.getByteTimeDomainData(timeDataArray);

      // Calculate overall audio level
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const normalizedLevel = Math.min(average / 128, 1);
      onAudioLevel(normalizedLevel);

      // Extract frequency bands (32 bands for visualization)
      const bandCount = 32;
      const bandSize = Math.floor(bufferLength / bandCount);
      const frequencyBands = Array.from({ length: bandCount }, (_, i) => {
        const start = i * bandSize;
        const end = Math.min(start + bandSize, bufferLength);
        const bandData = dataArray.slice(start, end);
        const bandAverage = bandData.reduce((sum, val) => sum + val, 0) / bandData.length;
        return Math.min(bandAverage / 255, 1);
      });

      onFrequencyData(frequencyBands);

      animationFrameRef.current = requestAnimationFrame(analyze);
    };

    analyze();
  };

  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      microphoneStreamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setIsInitialized(false);
  };

  // This component doesn't render anything visible
  return null;
};

export default AudioAnalyzer;
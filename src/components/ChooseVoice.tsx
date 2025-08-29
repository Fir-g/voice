import { useNavigate } from 'react-router-dom';
import { Button, IconButton, LeftArrowIcon, RightArrowIcon, CrossIcon } from './ui';
import { useVoice } from '../hooks/useVoice';
import { useEffect, useRef } from 'react';

const VoiceSelection = () => {
  const navigate = useNavigate();
  const { selectedVoice, setSelectedVoice, voices } = useVoice();
  const originalVoiceRef = useRef<number>(0);
  
  // Store the original voice selection when component mounts
  useEffect(() => {
    originalVoiceRef.current = selectedVoice;
  }, []);

  const nextVoice = () => {
    if (voices.length === 0) return;
    const newIndex = (selectedVoice + 1) % voices.length;
    console.log('Changing voice from', voices[selectedVoice]?.name || 'unknown', 'to', voices[newIndex]?.name || 'unknown');
    setSelectedVoice(newIndex);
  };

  const prevVoice = () => {
    if (voices.length === 0) return;
    const newIndex = (selectedVoice - 1 + voices.length) % voices.length;
    console.log('Changing voice from', voices[selectedVoice]?.name || 'unknown', 'to', voices[newIndex]?.name || 'unknown');
    setSelectedVoice(newIndex);
  };

  const hasVoices = voices.length > 0;
  const currentVoice = hasVoices ? voices[selectedVoice] : undefined;
  const prevVoiceData = hasVoices ? voices[(selectedVoice - 1 + voices.length) % voices.length] : undefined;
  const nextVoiceData = hasVoices ? voices[(selectedVoice + 1) % voices.length] : undefined;

  const handleCancel = () => {
    // Reset to the original voice selection
    setSelectedVoice(originalVoiceRef.current);
    navigate('/');
  };

  const handleDone = () => {
    navigate('/');
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden px-4">
      {/* Close Button */}
      <IconButton
        onClick={() => navigate('/')}
        icon={<CrossIcon />}
        ariaLabel="Close and go back to home"
        className="absolute top-4 right-4 md:top-6 md:right-6 z-20 text-white"
      />

      {/* Heading ABOVE video */}
      <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold tracking-tight z-20 mb-4 md:mb-8 mt-14 md:mt-20">
        Choose a voice
      </h1>

      {/* Video in center - responsive sizing */}
      <div className="relative flex-1 flex items-center justify-center z-10 w-full max-w-4xl">
        <video
          className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem] 2xl:w-[36rem] 2xl:h-[36rem] object-cover rounded-full"
          muted
          loop
          playsInline
          autoPlay
          style={{
            filter: 'brightness(1.2) contrast(1.1) saturate(1.3)',
            mixBlendMode: 'screen'
          }}
        >
          <source src="/original-6433de79a34f799bf4a634cbbdda7967.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full" />
      </div>

      {/* Voice selection BELOW video */}
      <div className="w-full text-center space-y-8 md:space-y-12 relative z-20 pb-4 md:pb-8 -mt-20 md:-mt-28">
        {/* Voice Selection Navigation */}
        <div className="flex flex-row items-center justify-center space-x-2 sm:space-x-4 md:space-x-8 lg:space-x-16">
          {/* Previous Voice */}
          <div className="text-center min-w-[80px] sm:min-w-[120px] md:min-w-[150px] lg:min-w-[180px] xl:min-w-[200px]">
            <div className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg font-medium font-display mb-1 md:mb-2">{prevVoiceData?.name || '...'}</div>
            <div className="text-gray-400 text-xs font-light hidden sm:block">{prevVoiceData?.description || ''}</div>
          </div>

          {/* Left Arrow */}
          <IconButton
            onClick={prevVoice}
            icon={<LeftArrowIcon />}
            ariaLabel="Previous voice"
            className="text-white hover:text-blue-300 transition-colors p-1 sm:p-2 md:p-4 text-xl sm:text-2xl md:text-3xl"
          />

          {/* Current Voice */}
          <div className="text-center min-w-[120px] sm:min-w-[200px] md:min-w-[250px] lg:min-w-[280px] xl:min-w-[300px]">
            <div className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-display font-semibold mb-1 sm:mb-2 md:mb-4 tracking-tight">
              {currentVoice?.name || 'Loading voices...'}
            </div>
            <div className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg font-light">
              {currentVoice?.description || ''}
            </div>
          </div>

          {/* Right Arrow */}
          <IconButton
            onClick={nextVoice}
            icon={<RightArrowIcon />}
            ariaLabel="Next voice"
            className="text-white hover:text-blue-300 transition-colors p-1 sm:p-2 md:p-4 text-xl sm:text-2xl md:text-3xl"
          />

          {/* Next Voice */}
          <div className="text-center min-w-[80px] sm:min-w-[120px] md:min-w-[150px] lg:min-w-[180px] xl:min-w-[200px]">
            <div className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg font-medium font-display mb-1 md:mb-2">{nextVoiceData?.name || '...'}</div>
            <div className="text-gray-400 text-xs font-light hidden sm:block">{nextVoiceData?.description || ''}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 md:space-y-6 max-w-80 mx-auto">
          <Button 
            onClick={handleDone}
            variant="primary"
            size="lg"
            fullWidth
            className="rounded-full bg-white text-black hover:bg-gray-100 text-base md:text-lg py-3 md:py-4"
          >
            Done
          </Button>
          <Button 
            onClick={handleCancel}
            variant="secondary"
            size="lg"
            fullWidth
            className="rounded-full bg-transparent text-white border-2 border-white hover:bg-white hover:text-black text-base md:text-lg py-3 md:py-4"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoiceSelection;
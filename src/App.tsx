import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { VoiceProvider } from './context/VoiceContext';
import ChooseVoice from './components/ChooseVoice';
import VoiceCall from './components/VoiceCall';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <VoiceProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Navigate to="/voice-call" replace />} />
              <Route path="/voice-call" element={<VoiceCall />} />
              <Route path="/choose-voice" element={<ChooseVoice />} />
            </Routes>
          </div>
        </Router>
      </VoiceProvider>
    </ErrorBoundary>
  );
};

export default App;

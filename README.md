# Voice Assistant UI

A modern React-based voice assistant application powered by OpenAI Realtime via WebRTC. Built with TypeScript, Vite, Tailwind CSS, React Router, and a minimal Express server to mint ephemeral Realtime tokens.

## Features

- **Realtime voice**: Low-latency, bidirectional WebRTC audio with OpenAI Realtime
- **Multiple AI voices**: Switch seamlessly among predefined voices (Breeze, Maple, Vale)
- **WebRTC audio**: High‑quality input/output, no manual chunking
- **Ephemeral sessions**: Server creates short‑lived tokens; API key never hits the client
- **Voice Selection Interface**: Choose from multiple AI voices with smooth transitions
- **Voice Call Interface**: Interactive call screen with microphone controls
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Modern dark UI with smooth animations
- **State Management**: Centralized voice state management with React Context
- **Type Safety**: Full TypeScript support for better development experience
- **Fast Development**: Vite for lightning-fast hot module replacement
- **Error Handling**: Comprehensive error handling and user feedback
- **Video Animation Orb**: Dynamic video animation that plays when the AI is speaking
- **Full-Screen Video Background**: Immersive video background that covers the entire screen during active conversations

## Pages

### Page 1: Choose a Voice
- Dark background with voice selection interface
- Large circular voice avatar with gradient
- Navigation arrows for voice switching
- Voice name and description display
- Done and Cancel buttons

### Page 2: Voice Call Interface
- Large voice avatar display with dynamic video animation when speaking
- Microphone button with mute/unmute functionality
- Play/pause button for conversation control
- Restart button when conversation is paused
- Real-time status indicators
- Error display and loading states
- Full-screen video background that activates during AI speech
- Enhanced text readability with drop shadows and overlays

## Technology Stack

- **React 18** (TypeScript)
- **Vite** + **Tailwind CSS**
- **Context API** + **React Router DOM**
- **WebRTC** with OpenAI Realtime
- **Express** server for ephemeral session minting

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── CircularButton.tsx
│   │   ├── IconButton.tsx
│   │   ├── Modal.tsx
│   │   ├── StatusIndicator.tsx
│   │   ├── icons.tsx
│   │   └── index.ts
│   ├── ChooseVoice.tsx      # Voice selection page
│   ├── VoiceCall.tsx        # Voice call interface
│   ├── VoiceCircle.tsx      # Reusable voice avatar component
│   └── VideoOrb.tsx         # Video animation orb for speaking state
├── context/
│   └── VoiceContext.tsx     # Voice state management
├── hooks/
│   └── useVoice.ts          # Voice context hook
├── services/
│   ├── realtimeService.ts   # WebRTC + OpenAI Realtime orchestration
│   └── api.ts               # Minimal API client (voices list)
├── types/
│   └── index.ts            # TypeScript type definitions
├── App.tsx                 # Main app component
├── main.tsx                # React entry point
└── index.css               # Global styles with Tailwind
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- OpenAI API key (server side only)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd voice-assistant-ui
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp env.example .env

# Client env (optional overrides)
VITE_API_BASE_URL=http://localhost:3001/api
VITE_SERVER_BASE_URL=http://localhost:3001

# Server env (create .env for server.js)
OPENAI_API_KEY=sk-...
```

4. Get your OpenAI API key:
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add it to your `.env` file

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### How to Use

1. **Choose a Voice**: On the first page, select your preferred AI voice using the navigation arrows
2. **Start Conversation**: Click the play button to begin recording and talking with the AI
3. **Control Conversation**: 
   - Use the microphone button to mute/unmute your input
   - Use the play/pause button to control the conversation
   - When paused, use the restart button to start a new conversation
4. **Settings**: Click the settings button (top right) to change voices

### Voice Options

Preconfigured list fetched from the server (see `server.js`): Breeze, Maple, Vale.

### Architecture

- The client requests `/session` from the server to mint an ephemeral client secret.
- The client exchanges SDP with OpenAI Realtime using that secret.
- Audio input/output flows over WebRTC; no manual transcription or TTS code in the client.

### Browser Compatibility

The application requires a modern browser with support for:
- MediaRecorder API
- WebRTC getUserMedia
- AudioContext API
- ES6+ features

### Security Notes

The OpenAI API key remains on the server. The client only receives ephemeral credentials with very short TTL.

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Troubleshooting

### Common Issues

1. **"OpenAI API key not found"**: Make sure you've set `VITE_OPENAI_API_KEY` in your `.env` file
2. **"Microphone access denied"**: Allow microphone permissions in your browser
3. **"Failed to initialize voice assistant"**: Check your internet connection and API key validity
4. **Audio not playing**: Ensure your browser supports the required audio APIs

### Development Tips

- Use browser developer tools to monitor API calls and errors
- Check the console for detailed error messages
- Test with different browsers to ensure compatibility
- Monitor OpenAI API usage to avoid rate limits

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

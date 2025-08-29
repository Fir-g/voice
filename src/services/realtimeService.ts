export interface RealtimeConfig {
  model?: string;
  voice?: string;
  serverBaseUrl?: string;
}

export class RealtimeService {
  private peerConnection: RTCPeerConnection | null = null;
  private microphoneStream: MediaStream | null = null;
  private remoteAudioElement: HTMLAudioElement | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private isActive = false;
  private isPaused = false;
  private isMuted = false;
  private config: Required<RealtimeConfig>;

  constructor(config?: RealtimeConfig) {
    this.config = {
      model: config?.model || 'gpt-4o-realtime-preview-2024-12-17',
      voice: config?.voice || 'verse',
      serverBaseUrl: config?.serverBaseUrl || import.meta.env?.VITE_SERVER_BASE_URL || 'http://localhost:3001',
    };
  }

  async start(voiceOverride?: string): Promise<void> {
    if (this.isActive) {
      await this.stop();
    }

    const voice = voiceOverride || this.config.voice;

    // Get mic permissions and stream
    this.microphoneStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    // Create RTCPeerConnection
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    // Outgoing audio: add mic track
    for (const track of this.microphoneStream.getTracks()) {
      this.peerConnection.addTrack(track, this.microphoneStream);
    }

    // Incoming audio: create element and autoplay
    this.peerConnection.addEventListener('track', (event: RTCTrackEvent) => {
      if (event.track.kind === 'audio') {
        const [remoteStream] = event.streams;
        if (!this.remoteAudioElement) {
          this.remoteAudioElement = new Audio();
          this.remoteAudioElement.autoplay = true;
        }
        this.remoteAudioElement.srcObject = remoteStream;
        this.remoteAudioElement.play().catch(() => {});
      }
    });

    // Data channel for JSON events (optional)
    this.dataChannel = this.peerConnection.createDataChannel('oai-events');
    this.dataChannel.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        console.debug('Realtime event:', data);
      } catch {
        // Ignore non-JSON payloads
      }
    };

    // Create offer
    const offer = await this.peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: false });
    await this.peerConnection.setLocalDescription(offer);

    // Get ephemeral client secret from server
    const sessionRes = await fetch(`${this.config.serverBaseUrl}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: this.config.model, voice }),
    });
    if (!sessionRes.ok) {
      const text = await sessionRes.text();
      throw new Error(`Failed to create session: ${text}`);
    }
    const sessionJson = await sessionRes.json();
    const ephemeralKey: string | undefined = sessionJson?.client_secret?.value || sessionJson?.client_secret || sessionJson?.value;
    if (!ephemeralKey) {
      throw new Error('Invalid session response: missing client_secret');
    }

    // Exchange SDP with OpenAI
    const baseUrl = 'https://api.openai.com/v1/realtime';
    const sdpRes = await fetch(`${baseUrl}?model=${encodeURIComponent(this.config.model)}`, {
      method: 'POST',
      body: (this.peerConnection.localDescription as RTCSessionDescription).sdp,
      headers: {
        'Authorization': `Bearer ${ephemeralKey}`,
        'Content-Type': 'application/sdp',
        'Accept': 'application/sdp',
        'OpenAI-Beta': 'realtime=v1',
      },
    });
    if (!sdpRes.ok) {
      const text = await sdpRes.text();
      throw new Error(`SDP exchange failed: ${text}`);
    }
    const answerSdp = await sdpRes.text();
    await this.peerConnection.setRemoteDescription({ type: 'answer', sdp: answerSdp });

    this.isActive = true;
    this.isPaused = false;
    this.setMuted(this.isMuted);
  }

  async pause(): Promise<void> {
    if (!this.peerConnection || !this.isActive) return;
    this.isPaused = true;
    this.setTrackEnabled(false);
  }

  async resume(): Promise<void> {
    if (!this.peerConnection || !this.isActive) return;
    this.isPaused = false;
    this.setTrackEnabled(!this.isMuted);
  }

  async stop(): Promise<void> {
    this.isActive = false;
    this.isPaused = false;

    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.remoteAudioElement) {
      this.remoteAudioElement.pause();
      this.remoteAudioElement.srcObject = null;
      this.remoteAudioElement = null;
    }

    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach(t => t.stop());
      this.microphoneStream = null;
    }
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (!this.isPaused) {
      this.setTrackEnabled(!muted);
    }
  }

  private setTrackEnabled(enabled: boolean) {
    if (this.microphoneStream) {
      this.microphoneStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  getActive(): boolean { return this.isActive; }
  getPaused(): boolean { return this.isPaused; }
  getMuted(): boolean { return this.isMuted; }
}


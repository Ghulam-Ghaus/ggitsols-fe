'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';

interface ChatMessage {
  sender: 'user' | 'agent';
  text: string;
}

interface VoiceCallContextType {
  isConnected: boolean;
  isMuted: boolean;
  status: 'idle' | 'calling' | 'active' | 'speaking' | 'processing';
  callDuration: number;
  chatLog: ChatMessage[];
  interimTranscript: string;
  startCall: () => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  analyserNode: AnalyserNode | null;
}

const VoiceCallContext = createContext<VoiceCallContextType | undefined>(undefined);

export function VoiceCallProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<'idle' | 'calling' | 'active' | 'speaking' | 'processing'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    { sender: 'agent', text: 'Assalam-o-Alaikum! GG IT Solutions Voice Support is online.' },
  ]);
  const [interimTranscript, setInterimTranscript] = useState('');

  const socketRef = useRef<Socket | null>(null);
  
  // Web Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  
  // State refs to avoid stale closures in audio callback
  const isMutedRef = useRef(false);
  const statusRef = useRef<'idle' | 'calling' | 'active' | 'speaking' | 'processing'>('idle');
  
  // Timing ref for gapless PCM scheduling
  const nextPlayTimeRef = useRef<number>(0);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Call duration counter
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status !== 'idle') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Convert Float32 browser microphone audio to mono 16-bit PCM ArrayBuffer
  const floatTo16BitPCM = (float32Array: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  };

  // Convert mono 16-bit PCM ArrayBuffer to Float32Array for AudioContext playback
  const pcm16ToFloat32 = (arrayBuffer: ArrayBuffer): Float32Array => {
    const int16Array = new Int16Array(arrayBuffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768;
    }
    return float32Array;
  };

  // Helper to instantly silence the model on interruption / hang up
  const stopAllActivePlayback = () => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch (e) {
        // Source may already be finished playing
      }
    });
    activeSourcesRef.current = [];
    nextPlayTimeRef.current = 0;
  };

  // Playback raw 24kHz mono PCM float audio chunk
  const playPCMChunk = (pcmData: ArrayBuffer) => {
    const audioContext = audioContextRef.current;
    if (!audioContext || audioContext.state === 'suspended') return;

    const float32Data = pcm16ToFloat32(pcmData);
    
    // Create AudioBuffer: 1 channel (mono), 24000Hz sample rate
    const audioBuffer = audioContext.createBuffer(1, float32Data.length, 24000);
    audioBuffer.getChannelData(0).set(float32Data);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    
    // Connect to global analyser node so the active visualizer renders waves
    if (analyserNodeRef.current) {
      source.connect(analyserNodeRef.current);
    } else {
      source.connect(audioContext.destination);
    }

    const currentTime = audioContext.currentTime;
    
    // Schedule buffer to play sequentially with zero gaps
    const playTime = Math.max(nextPlayTimeRef.current, currentTime);
    source.start(playTime);
    
    nextPlayTimeRef.current = playTime + audioBuffer.duration;
    activeSourcesRef.current.push(source);

    // Keep source list pruned of finished audio buffers
    source.onended = () => {
      activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
    };
  };

  const startCall = async () => {
    if (socketRef.current) return;

    setStatus('calling');
    setChatLog([{ sender: 'agent', text: 'Assalam-o-Alaikum! Connecting call...' }]);

    // Initialize Web Audio Context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 16000, // Forces the browser to downsample incoming microphone streams to 16kHz
    });
    audioContextRef.current = audioContext;

    // Set up analyzer node for waveforms
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.connect(audioContext.destination);
    analyserNodeRef.current = analyser;

    // Connect to backend secure proxy Gateway
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
    const socket = io(backendUrl, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setStatus('active');
      setChatLog([{ sender: 'agent', text: 'Assalam-o-Alaikum! Gemini Live Support is connected.' }]);
      startRecordingStream();
    });

    socket.on('disconnect', () => {
      endCall();
    });

    // Handle real-time audio chunk returned from Gemini (24kHz PCM)
    socket.on('audio-chunk', (data: { base64PCM: string }) => {
      setStatus('speaking');
      const binaryString = window.atob(data.base64PCM);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      playPCMChunk(bytes.buffer);
    });

    // Handle user transcripts (interim speech text)
    socket.on('interim-transcript', (data: { text: string }) => {
      setInterimTranscript(data.text);
    });

    // Handle final conversational dialogue transcripts
    socket.on('agent-text', (data: { text: string }) => {
      setChatLog((prev) => [...prev, { sender: 'agent', text: data.text }]);
      setInterimTranscript('');
    });

    socket.on('user-text', (data: { text: string }) => {
      setChatLog((prev) => [...prev, { sender: 'user', text: data.text }]);
      setInterimTranscript('');
    });

    // Handle model turn completing (speaking finished, wait for user input)
    socket.on('turn-complete', () => {
      setStatus('active'); // active listening state
    });

    // Handle user interruption event
    socket.on('interrupted', () => {
      console.log('Gemini Live API: User interruption detected. Silencing speech.');
      stopAllActivePlayback();
      setStatus('active');
    });

    // Handle router page actions / scrolling function tools
    socket.on('action', (action: { type: 'route' | 'scroll'; path?: string; elementId?: string }) => {
      console.log('Gemini Live API triggering page action:', action);
      setTimeout(() => {
        if (action.type === 'route' && action.path) {
          router.push(action.path);
        } else if (action.type === 'scroll' && action.elementId) {
          const el = document.getElementById(action.elementId.replace('#', ''));
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 500);
    });
  };

  const startRecordingStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = audioContextRef.current;
      if (!audioContext) return;

      const source = audioContext.createMediaStreamSource(stream);
      
      // Create ScriptProcessorNode with bufferSize = 2048, 1 input channel, 1 output channel
      const processor = audioContext.createScriptProcessor(2048, 1, 1);
      processorNodeRef.current = processor;

      source.connect(processor);
      
      // Must connect processor to destination otherwise onaudioprocess won't fire in some browsers
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        const socket = socketRef.current;
        if (!socket || !socket.connected) return;

        // Skip sending mic input if user is muted
        if (isMutedRef.current) return;

        // Get microphone channel input data (Float32)
        const floatData = e.inputBuffer.getChannelData(0);
        
        // Downsample and format to 16-bit PCM buffer
        const pcmBuffer = floatTo16BitPCM(floatData);

        // Stream raw PCM chunk over socket
        socket.emit('audio-chunk', pcmBuffer);
      };
    } catch (err) {
      console.error('Microphone streaming setup failed:', err);
      alert('Microphone access is required for real-time conversation.');
      endCall();
    }
  };

  const endCall = () => {
    stopAllActivePlayback();

    // Clean up nodes
    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
      processorNodeRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserNodeRef.current = null;

    // Disconnect websocket
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setIsConnected(false);
    setStatus('idle');
    setChatLog([{ sender: 'agent', text: 'Assalam-o-Alaikum! GG IT Solutions Voice Support is online.' }]);
    setInterimTranscript('');
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <VoiceCallContext.Provider
      value={{
        isConnected,
        isMuted,
        status,
        callDuration,
        chatLog,
        interimTranscript,
        startCall,
        endCall,
        toggleMute,
        analyserNode: analyserNodeRef.current,
      }}
    >
      {children}
    </VoiceCallContext.Provider>
  );
}

export function useVoiceCall() {
  const context = useContext(VoiceCallContext);
  if (context === undefined) {
    throw new Error('useVoiceCall must be used within a VoiceCallProvider');
  }
  return context;
}

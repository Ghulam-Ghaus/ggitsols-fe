'use client';

import React, { useEffect, useRef } from 'react';
import { useVoiceCall } from '@/context/VoiceCallContext';

export default function VoiceAssistant() {
  const {
    isConnected,
    isMuted,
    status,
    callDuration,
    chatLog,
    interimTranscript,
    startCall,
    endCall,
    toggleMute,
    analyserNode,
  } = useVoiceCall();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Canvas visualizer draw loop using the shared layout context AnalyserNode
  useEffect(() => {
    if (status !== 'idle' && analyserNode) {
      drawWave();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [status, analyserNode]);

  const drawWave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserNode) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // Extract raw audio data
      if (status === 'speaking' || (status === 'active' && !isMuted)) {
        analyserNode.getByteTimeDomainData(dataArray);
      } else {
        // Draw flat line if muted or processing
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = 128;
        }
      }

      ctx.lineWidth = 3;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#3b82f6'); // Blue
      gradient.addColorStop(0.5, '#a855f7'); // Purple
      gradient.addColorStop(1, '#ec4899'); // Pink
      ctx.strokeStyle = gradient;

      ctx.beginPath();
      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    };
    render();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Scroll chat subtitles to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, interimTranscript]);

  return (
    <div
      className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-3xl w-full max-w-[420px] min-h-[460px] shadow-2xl 
                 shadow-blue-500/5 transition-all duration-500 ease-out hover:border-blue-500/30 hover:shadow-blue-500/10 
                 flex flex-col overflow-hidden relative [transform-style:preserve-3d] hover:[transform:rotateX(3deg)_rotateY(-3deg)_translateZ(10px)]"
    >
      {/* 3D Glass shine layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none z-0"></div>

      {status === 'idle' ? (
        /* INACTIVE CALL SCREEN */
        <div className="flex-1 p-8 flex flex-col justify-between items-center text-center relative z-10">
          <div className="mt-4">
            <div className="relative w-24 h-24 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse pointer-events-none"></div>
              <div className="absolute -inset-2 rounded-full border border-blue-500/10 animate-ping pointer-events-none"></div>
              
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white mt-6">AI Voice Assistant</h3>
            <p className="text-xs font-semibold text-blue-400 tracking-wider uppercase mt-1">Real-time Calling Agent</p>
          </div>

          <p className="text-sm text-slate-400 max-w-sm leading-relaxed my-6">
            Start a voice call in English or Urdu. Ask about python, web development, AI courses, founders Ghulam Ghaus & Saqib, or route pages using voice!
          </p>

          <button
            onClick={startCall}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all group"
            title="Start Call"
          >
            <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-20 animate-ping group-hover:opacity-30 pointer-events-none"></span>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="fill-current">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </button>
          
          <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-4">Tap to Start Call</span>
        </div>
      ) : (
        /* ACTIVE CALL SCREEN */
        <div className="flex-1 p-6 flex flex-col justify-between relative z-10">
          
          {/* Active Call Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">Active Call</span>
            </div>
            <span className="text-sm font-mono bg-white/5 px-2.5 py-1 rounded-lg text-slate-300 border border-white/5">
              {formatTime(callDuration)}
            </span>
          </div>

          {/* Glowing Avatar/Status Indicator in Call */}
          <div className="my-4 text-center">
            <div className={`relative w-20 h-20 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center transition-all ${status === 'speaking' ? 'scale-105 border-purple-500/30' : ''}`}>
              <div className={`absolute inset-0 rounded-full opacity-20 pointer-events-none ${status === 'speaking' ? 'bg-purple-500 animate-pulse' : 'bg-blue-500 animate-pulse'}`}></div>
              <div className={`absolute -inset-2 rounded-full border opacity-10 pointer-events-none animate-ping ${status === 'speaking' ? 'border-purple-500' : 'border-blue-500'}`}></div>
              
              {status === 'speaking' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" x2="12" y1="19" y2="22"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                </svg>
              )}
            </div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-3">
              {status === 'active' && (isMuted ? 'Muted' : 'Listening...')}
              {status === 'calling' && 'Connecting...'}
              {status === 'processing' && 'Thinking...'}
              {status === 'speaking' && 'Speaking...'}
            </p>
          </div>

          {/* Subtitle / Chat Transcript display inside call panel */}
          <div className="flex-1 max-h-[140px] min-h-[100px] overflow-y-auto bg-slate-950/40 rounded-2xl border border-white/5 p-3 flex flex-col space-y-2">
            {chatLog.slice(-3).map((chat, idx) => (
              <p
                key={idx}
                className={`text-xs ${
                  chat.sender === 'user' ? 'text-blue-400 text-right' : 'text-slate-300'
                }`}
              >
                <span className="font-semibold">{chat.sender === 'user' ? 'You: ' : 'Agent: '}</span>
                {chat.text}
              </p>
            ))}
            
            {/* Realtime voice input bubble */}
            {interimTranscript && !isMuted && (
              <p className="text-xs text-blue-400/70 text-right italic animate-pulse">
                {interimTranscript}...
              </p>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Audio Waveform Canvas */}
          <div className="h-12 w-full my-3 flex items-center justify-center bg-slate-950/20 rounded-xl overflow-hidden">
            <canvas ref={canvasRef} width="350" height="48" className="w-full h-full" />
          </div>

          {/* Call Controls Bar */}
          <div className="flex items-center justify-center space-x-6 border-t border-white/5 pt-4">
            {/* Mute Toggle Button */}
            <button
              onClick={toggleMute}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                isMuted
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
              title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic-off">
                  <line x1="2" x2="22" y1="2" y2="22"/>
                  <path d="M18.89 13.19A8.6 8.6 0 0 0 19 12V7a7 7 0 0 0-3.54-6.07"/>
                  <path d="M9.11 3.42A7 7 0 0 0 9 5v5.88"/>
                  <path d="M5 10v2a7 7 0 0 0 10.84 5.86"/>
                  <line x1="12" x2="12" y1="19" y2="22"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" x2="12" y1="19" y2="22"/>
                </svg>
              )}
            </button>

            {/* End Call Button */}
            <button
              onClick={endCall}
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
              title="End Call"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-[135deg] fill-current">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

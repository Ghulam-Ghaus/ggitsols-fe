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
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
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
      gradient.addColorStop(0, '#0284c7'); // Sky-600
      gradient.addColorStop(0.5, '#0ea5e9'); // Sky-500
      gradient.addColorStop(1, '#06b6d4'); // Cyan-500
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

  // Scroll chat subtitles to bottom within the container (not the viewport)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatLog, interimTranscript]);

  return (
    <div
      className="bg-white/95 backdrop-blur-xl border border-sky-100 rounded-3xl w-full max-w-[420px] min-h-[460px] shadow-2xl 
                 shadow-sky-500/5 transition-all duration-500 ease-out hover:border-sky-300 hover:shadow-sky-500/15 
                 flex flex-col overflow-hidden relative [transform-style:preserve-3d]"
    >
      {/* 3D Glass shine layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-50/50 via-white/20 to-transparent pointer-events-none z-0"></div>

      {status === 'idle' ? (
        /* INACTIVE CALL SCREEN */
        <div className="flex-1 p-8 flex flex-col justify-between items-center text-center relative z-10">
          <div className="mt-4">
            <div className="relative w-24 h-24 mx-auto rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-sky-400/20 animate-pulse pointer-events-none"></div>
              <div className="absolute -inset-2 rounded-full border border-sky-300/40 animate-ping pointer-events-none"></div>
              
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-600">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-6">AI Voice Assistant</h3>
            <p className="text-xs font-semibold text-sky-600 tracking-wider uppercase mt-1">Real-time Calling Agent</p>
          </div>

          <p className="text-sm text-slate-600 max-w-sm leading-relaxed my-6">
            Start a voice call in English or Urdu. Ask about python, web development, AI courses, founder Ghulam Ghaus, or explore curriculum using voice!
          </p>

          <button
            onClick={startCall}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all group"
            title="Start Call"
          >
            <span className="absolute -inset-1 rounded-full bg-sky-500 opacity-20 animate-ping group-hover:opacity-40 pointer-events-none"></span>
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
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-800 tracking-wider uppercase">Active Call</span>
            </div>
            <span className="text-sm font-mono bg-sky-50 px-2.5 py-1 rounded-lg text-sky-800 border border-sky-100 font-semibold">
              {formatTime(callDuration)}
            </span>
          </div>

          {/* Glowing Avatar/Status Indicator in Call */}
          <div className="my-4 text-center">
            <div className={`relative w-20 h-20 mx-auto rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center transition-all ${status === 'speaking' ? 'scale-105 border-sky-400' : ''}`}>
              <div className={`absolute inset-0 rounded-full opacity-20 pointer-events-none ${status === 'speaking' ? 'bg-sky-400 animate-pulse' : 'bg-blue-400 animate-pulse'}`}></div>
              <div className={`absolute -inset-2 rounded-full border opacity-10 pointer-events-none animate-ping ${status === 'speaking' ? 'border-sky-400' : 'border-blue-400'}`}></div>
              
              {status === 'speaking' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-600">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" x2="12" y1="19" y2="22"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-600">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                </svg>
              )}
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-3">
              {status === 'active' && (isMuted ? 'Muted' : 'Listening...')}
              {status === 'calling' && 'Connecting...'}
              {status === 'processing' && 'Thinking...'}
              {status === 'speaking' && 'Speaking...'}
            </p>
          </div>

          {/* Subtitle / Chat Transcript display inside call panel */}
          <div 
            ref={chatContainerRef}
            className="flex-1 max-h-[140px] min-h-[100px] overflow-y-auto bg-slate-50 rounded-2xl border border-slate-200/80 p-3 flex flex-col space-y-2"
          >
            {chatLog.slice(-3).map((chat, idx) => (
              <p
                key={idx}
                className={`text-xs ${
                  chat.sender === 'user' ? 'text-sky-700 font-medium text-right' : 'text-slate-700'
                }`}
              >
                <span className="font-semibold">{chat.sender === 'user' ? 'You: ' : 'Agent: '}</span>
                {chat.text}
              </p>
            ))}
            
            {/* Realtime voice input bubble */}
            {interimTranscript && !isMuted && (
              <p className="text-xs text-sky-600/80 text-right italic animate-pulse">
                {interimTranscript}...
              </p>
            )}
          </div>

          {/* Audio Waveform Canvas */}
          <div className="h-12 w-full my-3 flex items-center justify-center bg-sky-50/60 rounded-xl overflow-hidden border border-sky-100">
            <canvas ref={canvasRef} width="350" height="48" className="w-full h-full" />
          </div>

          {/* Call Controls Bar */}
          <div className="flex items-center justify-center space-x-6 border-t border-slate-100 pt-4">
            {/* Mute Toggle Button */}
            <button
              onClick={toggleMute}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                isMuted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
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

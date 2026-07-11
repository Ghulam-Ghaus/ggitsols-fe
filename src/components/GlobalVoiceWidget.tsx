'use client';

import React from 'react';
import { useVoiceCall } from '@/context/VoiceCallContext';
import { usePathname } from 'next/navigation';

export default function GlobalVoiceWidget() {
  const pathname = usePathname();
  const { status, isMuted, callDuration, toggleMute, endCall } = useVoiceCall();

  // Only show this floating widget on other pages if a call is active
  if (pathname === '/' || status === 'idle') {
    return null;
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 shadow-2xl animate-fade-in gap-3 text-slate-100">
      {/* Active Pulse */}
      <span className="relative flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
      </span>

      {/* Call Info */}
      <div className="flex flex-col text-left pr-2">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-400">Gemini Live</span>
        <span className="text-xs font-mono font-medium leading-none mt-0.5">{formatTime(callDuration)}</span>
      </div>

      <div className="h-6 w-[1px] bg-white/10"></div>

      {/* Controls */}
      <button
        onClick={toggleMute}
        className={`p-2 rounded-full border transition-all ${
          isMuted
            ? 'bg-rose-500/20 border-rose-500/30 text-rose-400'
            : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
        }`}
        title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="1" y1="1" x2="23" y2="23"/>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" x2="12" y1="19" y2="22"/>
          </svg>
        )}
      </button>

      <button
        onClick={endCall}
        className="p-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md shadow-rose-600/10 active:scale-95"
        title="End Call"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="rotate-[135deg]">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      </button>
    </div>
  );
}

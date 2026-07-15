import React, { useState, useEffect, useRef } from 'react';
import useConference from '@/hooks/useConference.jsx';

const RoleBadge = ({role}) => (
  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">{role}</span>
);

const ParticipantTile = ({p, spotlight, onReact, children}) => {
  return (
    <div className={`relative rounded-xl overflow-hidden bg-slate-800 text-white flex flex-col items-center justify-center p-2 transition-transform ${spotlight ? 'scale-105 ring-4 ring-emerald-400' : ''}`}>
      <div className="w-full h-36 bg-black/70 flex items-center justify-center">{                   }
        {children || <div className="text-sm opacity-80">{p.name}</div>}
      </div>
      <div className="w-full flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <RoleBadge role={p.role || 'Member'} />
          {p.muted ? <span className="text-xs text-red-300">Muted</span> : <span className="text-xs text-emerald-200">Live</span>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onReact(p.id, '👍')} className="text-white/80 hover:text-emerald-300">👍</button>
          <button onClick={() => onReact(p.id, '❤️')} className="text-white/80 hover:text-emerald-300">❤️</button>
        </div>
      </div>
    </div>
  );
};

const RoomVideoGrid = ({ participants = [], spotlightId, onReact = () => {}, roomId }) => {
  const localUserId = (participants.find(p => p.isLocal)?.id) || (participants[0]?.id);
  const { localStream, peers } = useConference({ roomId, localUserId });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {            }
      {localStream && (
        <div className="relative rounded-xl overflow-hidden bg-slate-800 text-white flex flex-col items-center justify-center p-2">
          <video className="w-full h-36 bg-black" ref={(el) => { if (el && localStream) el.srcObject = localStream; }} autoPlay playsInline muted />
          <div className="w-full flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <RoleBadge role={'You'} />
            </div>
            <div className="flex items-center gap-2">
              <button className="text-white/80 hover:text-emerald-300">📷</button>
            </div>
          </div>
        </div>
      )}

      {peers.map(p => (
        <ParticipantTile key={p.socketId} p={{ id: p.socketId, name: p.userId || p.socketId, muted:false }} spotlight={spotlightId === p.socketId} onReact={onReact}>
          <video className="w-full h-36 bg-black" ref={(el) => { if (el && p.stream) el.srcObject = p.stream; }} autoPlay playsInline />
        </ParticipantTile>
      ))}

      {                                       }
      {participants.filter(p => !p.isLocal).map((p) => (
        <ParticipantTile key={p.id} p={p} spotlight={spotlightId === p.id} onReact={onReact} />
      ))}
    </div>
  );
};

export default RoomVideoGrid;

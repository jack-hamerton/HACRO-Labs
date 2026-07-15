import React from 'react';
import { User as UserIcon, MicOff, VideoOff } from 'lucide-react';

const ParticipantSidebar = ({participants = [], onToggleMute = () => {}, filter = 'all'}) => {
  const filtered = participants.filter(p => filter === 'all' ? true : (filter === 'live' ? !p.muted : p.muted));
  return (
    <aside className="w-72 bg-white border-l border-slate-200 p-4 overflow-y-auto">
      <h4 className="font-semibold text-slate-900 mb-3">Participants</h4>
      <div className="space-y-2">
        {filtered.map(p => (
          <div key={p.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700"><UserIcon className="w-4 h-4" /></div>
              <div>
                <div className="text-sm font-medium text-slate-900">{p.name}</div>
                <div className="text-xs text-slate-500">{p.role || 'Member'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {p.muted ? <MicOff className="w-4 h-4 text-red-500" /> : null}
              {p.videoOff ? <VideoOff className="w-4 h-4 text-slate-400" /> : null}
              <button onClick={() => onToggleMute(p.id)} className="text-xs text-emerald-600">Toggle</button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ParticipantSidebar;

import React, { useState } from 'react';

const BreakoutRooms = ({rooms = [], onReassign = () => {}}) => {
  const [dragging, setDragging] = useState(null);

  const onDragStart = (e, participant) => {
    setDragging(participant);
    e.dataTransfer.setData('text/plain', participant.id);
  };

  const onDropToRoom = (e, roomId) => {
    e.preventDefault();
    if (!dragging) return;
    onReassign(dragging.id, roomId);
    setDragging(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {rooms.map((r) => (
        <div key={r.id} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropToRoom(e, r.id)} className="rounded-xl border border-slate-200 p-3 bg-white">
          <h4 className="font-semibold text-slate-900 mb-2">{r.name} <span className="text-xs text-muted-foreground">({r.participants.length})</span></h4>
          <div className="grid gap-2">
            {r.participants.map((p) => (
              <div key={p.id} draggable onDragStart={(e) => onDragStart(e, p)} className="px-3 py-2 rounded-md bg-slate-50 border border-slate-100 cursor-grab">
                {p.name} <span className="text-xs text-muted-foreground">{p.role}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BreakoutRooms;

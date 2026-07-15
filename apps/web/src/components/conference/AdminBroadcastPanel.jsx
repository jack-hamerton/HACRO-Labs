import React from 'react';

const AdminBroadcastPanel = ({message = '', visible = false}) => {
  if (!visible) return null;
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4">
      <div className="rounded-xl bg-emerald-600 text-white p-3 shadow-lg animate-pulse">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Broadcast</div>
          <div className="text-sm opacity-90">Live</div>
        </div>
        <div className="mt-2 text-sm">{message}</div>
      </div>
    </div>
  );
};

export default AdminBroadcastPanel;

import React from 'react';

const ReactionLog = ({reactions = []}) => {
  const counts = reactions.reduce((acc, r) => { acc[r] = (acc[r] || 0) + 1; return acc; }, {});
  const entries = Object.entries(counts).sort((a,b) => b[1]-a[1]);
  return (
    <div className="rounded-xl p-3 bg-white border border-slate-200">
      <h5 className="font-semibold text-slate-900 mb-2">Reactions</h5>
      <div className="flex items-center gap-3">
        {entries.length === 0 ? <div className="text-sm text-slate-500">No reactions yet</div> : entries.map(([emoji, count]) => (
          <div key={emoji} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
            <span>{emoji}</span>
            <span className="text-xs font-semibold">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReactionLog;

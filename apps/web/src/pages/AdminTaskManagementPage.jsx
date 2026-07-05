import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout.jsx';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { ArrowUp, ArrowDown, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const AdminTaskManagementPage = () => {
  const { isSuperAdmin, token, currentAdmin } = useAdminAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [admins, setAdmins] = useState([]);
  const [newAssignee, setNewAssignee] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (token) fetchAdmins();
  }, [token]);

  const fetchAdmins = async () => {
    try {
      const res = await apiServerClient.fetch('/admin', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to load admins');
      const data = await res.json();
      setAdmins(Array.isArray(data.admins) ? data.admins : []);
    } catch (err) {
      // fallback to empty
      setAdmins([]);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Try PocketBase collection 'tasks' if available
      if (pb.collection) {
        try {
          const recs = await pb.collection('tasks').getFullList({ sort: 'order' });
          setTasks(recs.map((r, i) => ({ id: r.id, title: r.title || r.name || 'Untitled', assigned_to: r.assigned_to || null, progress: r.progress || 0, raw: r })));
          setLoading(false);
          return;
        } catch (err) {
          // collection may not exist
        }
      }
      // Fallback: local placeholder
      setTasks([
        { id: 'local-1', title: 'Review membership applications' },
        { id: 'local-2', title: 'Follow up with donors' },
      ]);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const moveTask = async (index, dir) => {
    const to = index + dir;
    if (to < 0 || to >= tasks.length) return;
    const copy = [...tasks];
    const [item] = copy.splice(index, 1);
    copy.splice(to, 0, item);
    setTasks(copy);
    // If PB available, persist order
    try {
      if (item.raw && pb.collection) {
        for (let i = 0; i < copy.length; i++) {
          const t = copy[i];
          if (t.raw) await pb.collection('tasks').update(t.id, { order: i });
        }
      }
    } catch (err) {
      toast.error('Failed to persist task ordering');
    }
  };

  const createTask = async () => {
    if (!newTitle.trim()) return;
    const title = newTitle.trim();
    setNewTitle('');
    try {
      const payload = { title, assigned_to: newAssignee || null, progress: 0 };
      if (pb.collection) {
        const created = await pb.collection('tasks').create(payload, { $autoCancel: false });
        setTasks((t) => [...t, { id: created.id, title: created.title || title, assigned_to: created.assigned_to || null, progress: created.progress || 0, raw: created }]);
        toast.success('Task created');
        return;
      }
      setTasks((t) => [...t, { id: `local-${Date.now()}`, title, assigned_to: newAssignee || null, progress: 0 }]);
      toast.success('Task created (local)');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const deleteTask = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      const idx = tasks.findIndex((t) => t.id === id);
      if (idx === -1) return;
      const item = tasks[idx];
      if (item.raw && pb.collection) {
        await pb.collection('tasks').delete(id);
      }
      setTasks((t) => t.filter((x) => x.id !== id));
      toast.success('Task removed');
    } catch (err) {
      toast.error('Failed to remove task');
    }
  };

  const updateProgress = async (id, progress) => {
    try {
      const idx = tasks.findIndex((t) => t.id === id);
      if (idx === -1) return;
      const item = tasks[idx];
      if (item.raw && pb.collection) {
        await pb.collection('tasks').update(id, { progress });
        fetchTasks();
      } else {
        setTasks((t) => t.map((x) => (x.id === id ? { ...x, progress } : x)));
      }
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  const exportCsv = () => {
    const headers = ['Task Title', 'Assigned Admin', 'Progress', 'Created At', 'Task ID'];
    const rows = tasks.map((task) => {
      const admin = admins.find((a) => a.id === task.assigned_to);
      return [
        `"${String(task.title ?? 'Untitled').replace(/"/g, '""')}"`,
        `"${admin ? String(admin.full_name || admin.email).replace(/"/g, '""') : 'Unassigned'}"`,
        task.progress ?? 0,
        `"${String(task.raw?.created || '').replace(/"/g, '""')}"`,
        `"${task.id}"`
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `task-analytics-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Task Management</h1>
        <p className="text-sm text-muted-foreground mb-6">{isSuperAdmin ? 'Super Admin view: full control' : 'Admin view: manage tasks and order'}</p>

        <div className="mb-4 grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-2">
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="New task title" className="flex-1 px-4 py-2 rounded border" />
          <div className="flex gap-2">
            <select value={newAssignee} onChange={(e) => setNewAssignee(e.target.value)} className="px-3 py-2 rounded border w-full">
              <option value="">Unassigned</option>
              {admins.map((a) => (
                <option key={a.id} value={a.id}>{a.full_name || a.email}</option>
              ))}
            </select>
            <button onClick={createTask} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded">
              <Plus className="w-4 h-4" /> Create
            </button>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg border border-white/10 p-4">
          {loading ? (
            <p>Loading…</p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((t, i) => (
                <li key={t.id} className="flex items-center justify-between gap-4 bg-white/3 p-3 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-200 font-medium">{i + 1}</div>
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-xs text-muted-foreground">Assigned: {t.assigned_to ? (admins.find(a => a.id === t.assigned_to)?.full_name || t.assigned_to) : 'Unassigned'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-40">
                      <input type="range" min={0} max={100} value={t.progress || 0} onChange={(e) => updateProgress(t.id, Number(e.target.value))} className="w-full" />
                      <div className="text-xs text-right mt-1">{t.progress || 0}%</div>
                    </div>
                    <button onClick={() => moveTask(i, -1)} className="p-2 rounded hover:bg-white/5"><ArrowUp className="w-4 h-4" /></button>
                    <button onClick={() => moveTask(i, 1)} className="p-2 rounded hover:bg-white/5"><ArrowDown className="w-4 h-4" /></button>
                    {(isSuperAdmin || true) && (
                      <button onClick={() => deleteTask(t.id)} className="p-2 rounded hover:bg-red-600/20 text-red-400"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          {isSuperAdmin && (
            <button onClick={() => exportCsv()} className="px-3 py-2 rounded bg-emerald-600 text-white">Export CSV</button>
          )}
        </div>

        {/* Analytics summary for superadmin */}
        {isSuperAdmin && (
          <div className="mt-6 rounded-lg border border-white/10 p-4 bg-white/3">
            <h3 className="text-lg font-semibold mb-3">Per-admin task completion</h3>
            <div className="mb-4 rounded-lg bg-slate-950/70 p-3">
              <div className="text-sm font-medium mb-2">Progress chart</div>
              <div className="space-y-3">
                {admins.map((a) => {
                  const assigned = tasks.filter((t) => t.assigned_to === a.id);
                  const avg = assigned.length === 0 ? 0 : Math.round((assigned.reduce((s, it) => s + (it.progress || 0), 0) / assigned.length));
                  return (
                    <div key={a.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{a.full_name || a.email}</span>
                        <span>{avg}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${avg}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {admins.length === 0 ? (
                <div className="text-sm text-muted-foreground">No admin data available.</div>
              ) : (
                admins.map((a) => {
                  const assigned = tasks.filter((t) => t.assigned_to === a.id);
                  const avg = assigned.length === 0 ? 0 : Math.round((assigned.reduce((s, it) => s + (it.progress || 0), 0) / assigned.length));
                  return (
                    <div key={a.id} className="rounded p-3 bg-white/5">
                      <div className="font-medium">{a.full_name || a.email}</div>
                      <div className="text-xs text-muted-foreground">Tasks: {assigned.length}</div>
                      <div className="mt-2">
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${avg}%` }} />
                        </div>
                        <div className="text-xs text-right mt-1">Average completion: {avg}%</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* CSV export helper (client-side) */}
        {false && <div />}
      </div>
    </AdminLayout>
  );
};

export default AdminTaskManagementPage;

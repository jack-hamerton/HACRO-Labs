import React, { useEffect, useState, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { Send, Trash2, MessageCircle, CornerDownLeft } from 'lucide-react';
import { toast } from 'sonner';

const AdminGroupChatPage = () => {
  const { currentAdmin, isSuperAdmin } = useAdminAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const endRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    let unsubscribe;
    if (pb.collection) {
      unsubscribe = pb.collection('admin_messages').subscribe('*', (e) => {
        if (['create', 'update', 'delete'].includes(e.action)) {
          fetchMessages();
        }
      });
    }
    return () => { if (unsubscribe && pb.collection) { try { pb.collection('admin_messages').unsubscribe('*'); } catch (e) {} } };
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      if (pb.collection) {
        const recs = await pb.collection('admin_messages').getFullList({ sort: 'created', expand: 'sender,reply_to.sender' });
        setMessages(recs.map((r) => ({
          id: r.id,
          text: r.message,
          sender: r.expand?.sender || null,
          created: r.created,
          replyTo: r.expand?.reply_to ? {
            id: r.expand.reply_to.id,
            message: r.expand.reply_to.message,
            sender: r.expand.reply_to.expand?.sender || null,
          } : null,
        })));
      } else {
        setMessages([]);
      }
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
    } catch (err) {
      toast.error('Failed to load admin chat');
    } finally {
      setLoading(false);
    }
  };

  const getSenderLabel = (sender) => sender?.full_name || sender?.email || 'Admin';

  const handleSend = async (e) => {
    e?.preventDefault?.();
    if (!newMessage.trim()) return;
    const trimmed = newMessage.trim();
    const optimistic = {
      id: `temp-${Date.now()}`,
      text: trimmed,
      sender: { full_name: currentAdmin?.full_name || currentAdmin?.email },
      created: new Date().toISOString(),
      replyTo: replyTo ? { id: replyTo.id, message: replyTo.text, sender: replyTo.sender } : null,
    };
    setMessages((prev) => [...prev, optimistic]);
    setNewMessage('');
    setReplyTo(null);

    try {
      if (pb.collection) {
        await pb.collection('admin_messages').create({
          message: trimmed,
          sender: currentAdmin?.id || null,
          reply_to: replyTo?.id || null,
        }, { $autoCancel: false });
        return;
      }
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      toast.error('Failed to send message');
    }
  };

  const handleReply = (message) => {
    setReplyTo(message);
    setNewMessage(`@${getSenderLabel(message.sender)} `);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this admin message?')) return;
    try {
      if (pb.collection) {
        await pb.collection('admin_messages').delete(id);
        return;
      }
      setMessages((m) => m.filter((x) => x.id !== id));
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-3">Admin Group Chat</h1>
        <p className="text-sm text-muted-foreground mb-4">Group chat for admins. All admins can message; superadmin can moderate.</p>

        <div className="bg-white/5 rounded-lg border border-white/10 p-4 flex flex-col h-[60vh]">
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {loading ? <p>Loading…</p> : messages.map((m) => (
              <div key={m.id} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-200">{getSenderLabel(m.sender).charAt(0)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">{getSenderLabel(m.sender)}</div>
                    <div className="text-xs text-muted-foreground">{new Date(m.created).toLocaleString()}</div>
                  </div>
                  {m.replyTo && (
                    <div className="border-l-2 border-emerald-500/30 pl-3 mt-2 mb-1 text-xs text-emerald-100/90">
                      <div className="font-medium">Reply to {getSenderLabel(m.replyTo.sender)}</div>
                      <div>{m.replyTo.message}</div>
                    </div>
                  )}
                  <div className="mt-1">{m.text}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button type="button" onClick={() => handleReply(m)} className="p-2 rounded hover:bg-white/10 text-emerald-200"><CornerDownLeft className="w-4 h-4" /></button>
                  {isSuperAdmin && (
                    <button type="button" onClick={() => handleDelete(m.id)} className="p-2 rounded hover:bg-red-600/20 text-red-400"><Trash2 className="w-4 h-4" /></button>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form onSubmit={handleSend} className="mt-3 flex flex-col gap-2">
            {replyTo && (
              <div className="rounded border border-emerald-500/40 bg-emerald-500/10 p-3 flex items-center justify-between gap-3 text-sm">
                <div>
                  Replying to <span className="font-semibold">{getSenderLabel(replyTo.sender)}</span>: {replyTo.text}
                </div>
                <button type="button" onClick={() => setReplyTo(null)} className="text-emerald-200 underline">Cancel</button>
              </div>
            )}
            <div className="flex gap-2">
              <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 px-3 py-2 rounded border bg-transparent" placeholder="Write a message to all admins..." />
              <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded"><Send className="w-4 h-4" />Send</button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminGroupChatPage;

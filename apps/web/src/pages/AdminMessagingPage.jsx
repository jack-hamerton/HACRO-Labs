import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout.jsx';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Trash2, Pin } from 'lucide-react';
import { toast } from 'sonner';

const AdminMessagingPage = () => {
  const { isSuperAdmin } = useAdminAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSenderLabel = (sender) => sender?.full_name || sender?.email || 'Member';

  useEffect(() => {
    fetchMessages();
    

    if (pb.collection) {
      const unsub = pb.collection('messages').subscribe('*', (e) => {
        

        fetchMessages();
      });
      return () => {
        try { pb.collection('messages').unsubscribe('*'); } catch (e) {}
      };
    }
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      if (pb.collection) {
        const recs = await pb.collection('messages').getFullList({ sort: '-created', expand: 'member_id,group_id,reply_to,reply_to.sender' });
        setMessages(recs.map((r) => ({
          id: r.id,
          created: r.created,
          message_content: r.message_content,
          pinned: r.pinned,
          member: r.expand?.member_id || null,
          group: r.expand?.group_id || null,
          replyTo: r.expand?.reply_to ? {
            id: r.expand.reply_to.id,
            message: r.expand.reply_to.message_content,
            sender: r.expand.reply_to.expand?.sender || null,
          } : null,
        })));
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Delete message?')) return;
    try {
      if (pb.collection) {
        await pb.collection('messages').delete(id);
        setMessages((m) => m.filter(x => x.id !== id));
        toast.success('Message deleted');
      }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const togglePin = async (id, current) => {
    try {
      if (pb.collection) {
        await pb.collection('messages').update(id, { pinned: !current });
        fetchMessages();
      }
    } catch (err) {
      toast.error('Failed to update pin');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Messaging</h1>
        <p className="text-sm text-muted-foreground mb-6">{isSuperAdmin ? 'Super Admin view: full message moderation' : 'Admin view: moderate and manage messages'}</p>

        <div className="bg-white/5 rounded-lg border border-white/10 p-4">
          {loading ? (
            <p>Loading…</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages found.</p>
          ) : (
            <ul className="space-y-3">
              {messages.map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-4 bg-white/3 p-3 rounded">
                  <div>
                    <div className="text-sm font-medium">{m.member ? `${m.member.first_name} ${m.member.last_name}` : 'Unknown'}</div>
                    <div className="text-xs text-muted-foreground">{m.group ? m.group.name : 'General'} • {new Date(m.created).toLocaleString()}</div>
                    {m.replyTo && (
                      <div className="border-l-2 border-emerald-500/30 pl-3 mt-2 mb-2 text-xs text-emerald-100/90">
                        <div className="font-medium">Replying to {getSenderLabel(m.replyTo.sender)}</div>
                        <div className="mt-1">{m.replyTo.message}</div>
                      </div>
                    )}
                    <div className="mt-2">{m.message_content}</div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button onClick={() => togglePin(m.id, m.pinned)} className={`p-2 rounded ${m.pinned ? 'bg-emerald-600 text-white' : 'hover:bg-white/5'}`}>
                      <Pin className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteMessage(m.id)} className="p-2 rounded hover:bg-red-600/20 text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessagingPage;

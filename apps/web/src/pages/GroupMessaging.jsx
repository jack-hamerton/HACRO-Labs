import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Pin, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';

const GroupMessaging = () => {
  const { groupId } = useParams();
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    
    pb.collection('messages').subscribe('*', function (e) {
      if (e.action === 'create' && e.record.group_id === groupId) {
        // Fetch expanded member info for the new message
        pb.collection('messages').getOne(e.record.id, { expand: 'member_id', $autoCancel: false })
          .then(expandedMsg => {
            setMessages(prev => [...prev, expandedMsg]);
            scrollToBottom();
          });
      } else if (e.action === 'delete') {
        setMessages(prev => prev.filter(m => m.id !== e.record.id));
      }
    });

    return () => {
      pb.collection('messages').unsubscribe('*');
    };
  }, [groupId]);

  const fetchMessages = async () => {
    try {
      const records = await pb.collection('messages').getFullList({
        filter: `group_id="${groupId}"`,
        sort: 'created',
        expand: 'member_id',
        $autoCancel: false
      });
      setMessages(records);
      scrollToBottom();
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await pb.collection('messages').create({
        group_id: groupId,
        member_id: currentUser.id,
        message_content: newMessage.trim(),
        pinned: false
      }, { $autoCancel: false });
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    try {
      await pb.collection('messages').delete(id, { $autoCancel: false });
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Group Chat - Hacro Labs</title></Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col h-[calc(100vh-64px)]">
          <div className="flex items-center mb-6">
            <button onClick={() => navigate('/group-dashboard')} className="mr-4 p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">Group Chat</h1>
          </div>

          <div className="flex-1 bg-card border border-border rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map(msg => {
                const isMe = msg.member_id === currentUser.id;
                const sender = msg.expand?.member_id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">{sender?.first_name} {sender?.last_name}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(msg.created).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className={`relative group max-w-[80%] p-3 rounded-2xl ${isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'}`}>
                      <p className="text-sm">{msg.message_content}</p>
                      {isAdmin && (
                        <button onClick={() => handleDelete(msg.id)} className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-destructive hover:bg-destructive/10 rounded transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSend} className="p-4 border-t border-border bg-muted/30 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button type="submit" disabled={!newMessage.trim()} className="btn-primary px-4 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupMessaging;
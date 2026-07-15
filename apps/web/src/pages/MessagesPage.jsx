import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { Send, ArrowLeft, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import MemberPortalLayout from '@/components/MemberPortalLayout.jsx';

const MessagesPage = () => {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const selectedMemberId = searchParams.get('memberId');

  useEffect(() => {
    if (!currentUser) return;
    fetchConversations();

    const unsubscribe = pb.collection('member_messages').subscribe('*', (e) => {
      const record = e?.record;
      if (!record) return;
      const senderId = record.sender_id;
      const recipientId = record.recipient_id;
      if (senderId !== currentUser.id && recipientId !== currentUser.id) return;

      fetchConversations();
      if (activeConversation?.member?.id && [senderId, recipientId].includes(activeConversation.member.id)) {
        fetchMessages(activeConversation.member.id);
      }
    });

    return () => {
      try {
        pb.collection('member_messages').unsubscribe('*');
      } catch (err) {
        // ignore cleanup errors
      }
      if (unsubscribe && typeof unsubscribe.unsubscribe === 'function') {
        unsubscribe.unsubscribe();
      }
    };
  }, [currentUser, activeConversation]);

  useEffect(() => {
    if (!selectedMemberId || !conversations.length) return;
    const target = conversations.find((c) => c.member.id === selectedMemberId);
    if (target) {
      setActiveConversation(target);
      fetchMessages(target.member.id);
    }
  }, [selectedMemberId, conversations]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const buildConversations = (records) => {
    const map = new Map();

    records.forEach((record) => {
      const isSender = record.sender_id === currentUser.id;
      const other = isSender ? record.expand?.recipient_id : record.expand?.sender_id;
      if (!other) return;

      const existing = map.get(other.id);
      const timestamp = new Date(record.created).getTime();
      if (!existing || timestamp > existing.lastTimestamp) {
        map.set(other.id, {
          member: other,
          lastMessage: record.message_content,
          lastCreated: record.created,
          lastTimestamp: timestamp,
          isSender
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.lastTimestamp - a.lastTimestamp);
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('member_messages').getFullList({
        sort: '-created',
        expand: 'sender_id,recipient_id',
        $autoCancel: false
      });
      const filtered = records.filter((record) => record.sender_id === currentUser.id || record.recipient_id === currentUser.id);
      const conversations = buildConversations(filtered);
      setConversations(conversations);

      if (selectedMemberId) {
        const selected = conversations.find((c) => c.member.id === selectedMemberId);
        if (selected) {
          setActiveConversation(selected);
          await fetchMessages(selected.member.id);
        }
      } else if (!activeConversation && conversations.length > 0) {
        setActiveConversation(conversations[0]);
        await fetchMessages(conversations[0].member.id);
      }
    } catch (error) {
      console.error('Failed to load conversations', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (memberId) => {
    setLoading(true);
    try {
      const filter = `((sender_id = "${currentUser.id}" && recipient_id = "${memberId}") || (sender_id = "${memberId}" && recipient_id = "${currentUser.id}"))`;
      const records = await pb.collection('member_messages').getFullList({
        filter,
        sort: 'created',
        expand: 'sender_id,recipient_id',
        $autoCancel: false
      });
      setMessages(records);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to load messages', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    setSending(true);
    try {
      const payload = {
        sender_id: currentUser.id,
        recipient_id: activeConversation.member.id,
        message_content: newMessage.trim(),
        read_status: false
      };
      await pb.collection('member_messages').create(payload, { $autoCancel: false });
      setNewMessage('');
      await fetchMessages(activeConversation.member.id);
      await fetchConversations();
    } catch (error) {
      console.error('Failed to send message', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const renderConversationLabel = (conversation) => {
    const name = conversation.member?.first_name || conversation.member?.email || conversation.member?.phone || 'Member';
    return `${name}`;
  };

  return (
    <>
      <Helmet>
        <title>Messages - HACRO Hub</title>
      </Helmet>
      <MemberPortalLayout title="Messages" subtitle="Chat privately with group members.">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
            <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="border-b border-border px-6 py-5 flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
                  <p className="text-sm text-muted-foreground">Select a member to message.</p>
                </div>
              </div>
              <div className="divide-y divide-border">
                {loading && !conversations.length ? (
                  <div className="p-6 text-sm text-muted-foreground">Loading conversations…</div>
                ) : conversations.length === 0 ? (
                  <div className="p-6 text-sm text-muted-foreground">No conversations yet. Start by messaging a member from your group dashboard.</div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.member.id}
                      type="button"
                      onClick={() => {
                        setActiveConversation(conversation);
                        fetchMessages(conversation.member.id);
                      }}
                      className={`w-full text-left px-6 py-4 transition-colors ${activeConversation?.member?.id === conversation.member.id ? 'bg-primary/10' : 'hover:bg-muted'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-foreground">{renderConversationLabel(conversation)}</div>
                          <div className="text-sm text-muted-foreground">{conversation.lastMessage}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">{new Date(conversation.lastCreated).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm flex flex-col h-[calc(100vh-220px)]">
              <div className="border-b border-border px-6 py-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{activeConversation ? renderConversationLabel(activeConversation) : 'Select a conversation'}</h2>
                  <p className="text-sm text-muted-foreground">Private chat with another member.</p>
                </div>
                <Link to="/group-dashboard" className="text-sm text-primary hover:underline">Back to group</Link>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loading ? (
                  <div className="text-sm text-muted-foreground">Loading messages…</div>
                ) : activeConversation ? (
                  messages.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No messages yet. Send the first one!</div>
                  ) : (
                    messages.map((msg) => {
                      const isMine = msg.sender_id === currentUser.id;
                      const sender = isMine ? currentUser : msg.expand?.sender_id;
                      return (
                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-3xl p-4 ${isMine ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                            <div className="text-xs text-muted-foreground mb-1">{sender?.first_name || sender?.email || sender?.phone || 'Member'}</div>
                            <div>{msg.message_content}</div>
                            <div className="mt-2 text-[11px] text-muted-foreground text-right">{new Date(msg.created).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        </div>
                      );
                    })
                  )
                ) : (
                  <div className="text-sm text-muted-foreground">Choose a conversation from the list to start chatting.</div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="border-t border-border px-6 py-4 bg-background">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={!activeConversation}
                    placeholder={activeConversation ? 'Type your message...' : 'Select a conversation first'}
                    className="flex-1 rounded-full border border-border px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || !activeConversation || sending}
                    className="btn-primary rounded-full px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </MemberPortalLayout>
    </>
  );
};

export default MessagesPage;

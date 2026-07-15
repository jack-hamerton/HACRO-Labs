import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import RoomVideoGrid from '@/components/conference/RoomVideoGrid.jsx';
import BreakoutRooms from '@/components/conference/BreakoutRooms.jsx';
import ParticipantSidebar from '@/components/conference/ParticipantSidebar.jsx';
import ReactionLog from '@/components/conference/ReactionLog.jsx';
import AdminBroadcastPanel from '@/components/conference/AdminBroadcastPanel.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ConferenceRoomPage = () => {
  const { id } = useParams();
  const { isAuthenticated, currentUser } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [broadcast, setBroadcast] = useState({visible:false, message:''});

  useEffect(() => {
    

    

    setParticipants([
      {id:'p1', name:'Alice', role:'Leader', muted:false, videoOff:false},
      {id:'p2', name:'Bob', role:'Member', muted:true, videoOff:true},
      {id:'p3', name:'Charlie', role:'Member', muted:false, isLocal:false}
    ]);
    setRooms([{id:'r1', name:'Breakout A', participants:[]}, {id:'r2', name:'Breakout B', participants:[]}]);
  }, [id]);

  const handleReact = (participantId, emoji) => {
    setReactions(prev => [...prev, emoji]);
  };

  const handleReassign = (participantId, roomId) => {
    

    setRooms(prev => prev.map(r => ({...r, participants: r.participants.filter(p => p.id !== participantId)})));
    setRooms(prev => prev.map(r => r.id === roomId ? {...r, participants: [...r.participants, {id:participantId, name:participantId}]} : r));
  };

  if (!isAuthenticated) return <div className="min-h-screen flex items-center justify-center">Please login</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AdminBroadcastPanel visible={broadcast.visible} message={broadcast.message} />
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <RoomVideoGrid roomId={id} participants={[{...currentUser, id: currentUser?.id, name: currentUser?.name || currentUser?.email, isLocal:true}, ...participants]} spotlightId={participants[0]?.id} onReact={handleReact} />
          <BreakoutRooms rooms={rooms} onReassign={handleReassign} />
        </section>

        <aside className="space-y-4">
          <ParticipantSidebar participants={participants} onToggleMute={(id)=>{setParticipants(prev=>prev.map(p=>p.id===id?{...p,muted:!p.muted}:p))}} />
          <ReactionLog reactions={reactions} />
        </aside>
      </main>
    </div>
  );
};

export default ConferenceRoomPage;

import { useEffect, useRef, useState } from 'react';
import pb from '@/lib/pocketbaseClient';

const defaultStuns = (import.meta.env.VITE_STUN_SERVERS || 'stun:stun.l.google.com:19302').split(',').map(s=>s.trim()).filter(Boolean);

export default function useConference({ roomId, localUserId } = {}) {
  const wsRef = useRef(null);
  const pcMap = useRef(new Map());
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState([]); // { socketId, userId, stream }
  const ownSocketId = useRef(null);

  useEffect(() => {
    if (!roomId || !localUserId) return;

    const apiUrl = import.meta.env.VITE_API_URL || (window.location.origin.replace(/:\d+$/, ':3001'));
    const wsUrl = apiUrl.replace(/^http/, 'ws') + '/ws';
    const token = pb.authStore.token;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'join', roomId, userId: localUserId, token }));
    };

    ws.onmessage = async (evt) => {
      const data = JSON.parse(evt.data);
      const { type } = data;

      if (type === 'joined') {
        ownSocketId.current = data.socketId;
        return;
      }

      if (type === 'peer-joined') {
        const { socketId, userId } = data;
        // If we are the newcomer (our id > other) we create offer, otherwise wait
        if (!pcMap.current.has(socketId)) {
          await createPeerConnection(socketId, userId, true);
        }
        return;
      }

      if (type === 'offer') {
        const { from, payload } = data;
        await handleOffer(from, payload);
        return;
      }

      if (type === 'answer') {
        const { from, payload } = data;
        const pc = pcMap.current.get(from)?.pc;
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(payload));
        }
        return;
      }

      if (type === 'ice-candidate') {
        const { from, payload } = data;
        const pc = pcMap.current.get(from)?.pc;
        if (pc && payload) {
          try { await pc.addIceCandidate(payload); } catch (e) { /* ignore */ }
        }
        return;
      }

      if (type === 'peer-left') {
        const { socketId } = data;
        removePeer(socketId);
        return;
      }
    };

    ws.onclose = () => {
      // cleanup
    };

    // getLocalMedia
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setLocalStream(stream);
      } catch (err) {
        console.warn('Could not get local media', err);
      }
    })();

    async function createPeerConnection(socketId, userId, shouldOffer = false) {
      const pc = new RTCPeerConnection({ iceServers: defaultStuns.map(u=>({ urls: u })) });
      const remoteStream = new MediaStream();

      pc.ontrack = (e) => {
        e.streams[0]?.getTracks().forEach(t => remoteStream.addTrack(t));
        setPeers(prev => {
          const copy = prev.filter(p => p.socketId !== socketId);
          return [...copy, { socketId, userId, stream: remoteStream }];
        });
      };

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          wsRef.current?.send(JSON.stringify({ type: 'ice-candidate', to: socketId, payload: e.candidate }));
        }
      };

      // add local tracks
      if (localStream) {
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
      }

      pcMap.current.set(socketId, { pc, userId });

      if (shouldOffer) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        wsRef.current?.send(JSON.stringify({ type: 'offer', to: socketId, payload: pc.localDescription }));
      }
    }

    async function handleOffer(from, payload) {
      if (!pcMap.current.has(from)) {
        await createPeerConnection(from, null, false);
      }
      const entry = pcMap.current.get(from);
      if (!entry) return;
      const pc = entry.pc;
      await pc.setRemoteDescription(new RTCSessionDescription(payload));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      wsRef.current?.send(JSON.stringify({ type: 'answer', to: from, payload: pc.localDescription }));
    }

    function removePeer(socketId) {
      const entry = pcMap.current.get(socketId);
      if (entry) {
        try { entry.pc.close(); } catch (e) {}
        pcMap.current.delete(socketId);
      }
      setPeers(prev => prev.filter(p => p.socketId !== socketId));
    }

    return () => {
      try { ws.close(); } catch (e) {}
      pcMap.current.forEach(e => { try { e.pc.close(); } catch (err) {} });
      pcMap.current.clear();
      setPeers([]);
      if (localStream) {
        localStream.getTracks().forEach(t => t.stop());
      }
      setLocalStream(null);
    };
  }, [roomId, localUserId]);

  return { localStream, peers };
}

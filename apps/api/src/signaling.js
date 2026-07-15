import { WebSocketServer } from 'ws';
import url from 'url';
import pb, { authPb, authenticateSuperuser } from './utils/pocketbaseClient.js';



const rooms = new Map();

function safeSend(ws, data) {
  try {
    ws.send(JSON.stringify(data));
  } catch (err) {
    

  }
}

async function verifyMembership(conferenceId, memberId, token) {
  try {
    if (token) {
      

      authPb.authStore.save(token, 'members');
    }

    

    try {
      const res = await pb.collection('conference_memberships').getList(1, 50, {
        filter: `conference = "${conferenceId}" && member = "${memberId}"`
      });
      if (res && res.items && res.items.length > 0) return true;
    } catch (err) {
      

    }

    

    try {
      const member = await authPb.collection('members').getOne(memberId);
      if (!member) return false;
      if (member.is_admin || member.roles?.includes('admin')) return true;
      

      if (member.groups && member.groups.includes(conferenceId)) return true;
    } catch (err) {
      

    }

    return false;
  } catch (err) {
    console.error('verifyMembership error', err.message || err);
    return false;
  }
}

export default function attachSignaling(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const location = url.parse(req.url, true);
    ws.id = Math.random().toString(36).slice(2, 9);
    ws.roomId = null;
    ws.userId = null;

    ws.on('message', async (msg) => {
      let data;
      try {
        data = JSON.parse(msg.toString());
      } catch (err) {
        return;
      }

      const { type } = data;

      if (type === 'join') {
        const { roomId, userId, token } = data;
        if (!roomId || !userId) {
          safeSend(ws, { type: 'error', message: 'missing roomId or userId' });
          return;
        }

        const allowed = await verifyMembership(roomId, userId, token);
        if (!allowed) {
          safeSend(ws, { type: 'error', message: 'not authorized to join room' });
          ws.close();
          return;
        }

        ws.roomId = roomId;
        ws.userId = userId;

        let room = rooms.get(roomId);
        if (!room) {
          room = new Map();
          rooms.set(roomId, room);
        }
        room.set(ws.id, { ws, userId });

        

        for (const [otherId, info] of room.entries()) {
          if (otherId === ws.id) continue;
          safeSend(info.ws, { type: 'peer-joined', userId, socketId: ws.id });
          safeSend(ws, { type: 'peer-joined', userId: info.userId, socketId: otherId });
        }

        safeSend(ws, { type: 'joined', roomId, socketId: ws.id });
        return;
      }

      

      if (type === 'offer' || type === 'answer' || type === 'ice-candidate' || type === 'signal') {
        const { to, payload } = data;
        if (!ws.roomId) return;
        const room = rooms.get(ws.roomId);
        if (!room) return;
        const target = room.get(to);
        if (!target) return;
        safeSend(target.ws, { type, from: ws.id, payload });
        return;
      }

      if (type === 'leave') {
        if (ws.roomId) {
          const room = rooms.get(ws.roomId);
          if (room) {
            room.delete(ws.id);
            for (const [, info] of room.entries()) {
              safeSend(info.ws, { type: 'peer-left', socketId: ws.id, userId: ws.userId });
            }
            if (room.size === 0) rooms.delete(ws.roomId);
          }
        }
        ws.close();
      }
    });

    ws.on('close', () => {
      if (ws.roomId) {
        const room = rooms.get(ws.roomId);
        if (room) {
          room.delete(ws.id);
          for (const [, info] of room.entries()) {
            safeSend(info.ws, { type: 'peer-left', socketId: ws.id, userId: ws.userId });
          }
          if (room.size === 0) rooms.delete(ws.roomId);
        }
      }
    });
  });

  console.info('WebSocket signaling server attached at /ws');
}

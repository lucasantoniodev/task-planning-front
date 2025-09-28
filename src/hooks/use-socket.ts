import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    let newSocket: Socket | null = null;

    const setupSocket = async (user: User | null) => {
      if (!user) {
        if (newSocket) newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
        return;
      }

      const token = await user.getIdToken(true);

      newSocket = io(import.meta.env.VITE_WS_URL, {
        autoConnect: true,
        auth: { token },
        path: '/socket.io',
      });

      newSocket.on('connect', () => setIsConnected(true));
      newSocket.on('disconnect', () => setIsConnected(false));
      newSocket.on('connect_error', async (err) => {
        console.warn('Erro de conexão:', err.message);

        const freshToken = await user.getIdToken(true);
        newSocket!.auth = { token: freshToken };
        newSocket?.connect();
      });

      newSocket.connect();
      setSocket(newSocket);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setupSocket(user);
    });

    return () => {
      unsubscribe();
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  return { socket, isConnected };
}

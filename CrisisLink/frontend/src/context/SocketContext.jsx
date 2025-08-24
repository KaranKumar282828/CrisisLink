import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { initSocket, disconnectSocket, SOCKET_EVENTS } from "../lib/socket";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.id) {
      const newSocket = initSocket();
      setSocket(newSocket);
      setIsConnected(true);

      // Register user with socket server
      newSocket.emit('register_user', {
        userId: user.id,
        role: user.role,
        name: user.name
      });

      // Handle connection events
      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('Socket connected');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Socket disconnected');
      });

      return () => {
        newSocket.off('connect');
        newSocket.off('disconnect');
        disconnectSocket();
      };
    }
  }, [user]);

  const value = {
    socket,
    isConnected,
    SOCKET_EVENTS
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
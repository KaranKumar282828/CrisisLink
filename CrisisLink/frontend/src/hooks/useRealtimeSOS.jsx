import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import toast from "react-hot-toast";

export const useRealtimeSOS = (onSOSCreated = null, onSOSAccepted = null, onSOSUpdated = null) => {
  const { socket, isConnected, SOCKET_EVENTS } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for new SOS requests
    const handleNewSOS = (sosData) => {
      toast.success(`New SOS request: ${sosData.type}`);
      if (onSOSCreated) onSOSCreated(sosData);
    };

    // Listen for SOS acceptances
    const handleSOSAccepted = (data) => {
      toast.info(`SOS accepted by volunteer`);
      if (onSOSAccepted) onSOSAccepted(data);
    };

    // Listen for SOS updates
    const handleSOSUpdated = (data) => {
      if (onSOSUpdated) onSOSUpdated(data);
    };

    // Subscribe to events
    socket.on(SOCKET_EVENTS.SOS_CREATED, handleNewSOS);
    socket.on(SOCKET_EVENTS.SOS_ACCEPTED, handleSOSAccepted);
    socket.on(SOCKET_EVENTS.SOS_UPDATED, handleSOSUpdated);

    // Cleanup
    return () => {
      if (socket) {
        socket.off(SOCKET_EVENTS.SOS_CREATED, handleNewSOS);
        socket.off(SOCKET_EVENTS.SOS_ACCEPTED, handleSOSAccepted);
        socket.off(SOCKET_EVENTS.SOS_UPDATED, handleSOSUpdated);
      }
    };
  }, [socket, isConnected, onSOSCreated, onSOSAccepted, onSOSUpdated]);

  // Function to emit SOS events
  const emitSOSEvent = (event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  return {
    emitSOSEvent,
    isConnected
  };
};
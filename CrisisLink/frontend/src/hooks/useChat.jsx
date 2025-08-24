import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";

export const useChat = (sosId, participants = []) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { socket, SOCKET_EVENTS } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    const handleNewMessage = (message) => {
      if (message.sosId === sosId) {
        setMessages(prev => [...prev, message]);
      }
    };

    // Listen for typing indicators
    const handleTyping = (data) => {
      if (data.sosId === sosId) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on(SOCKET_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
    socket.on('user_typing', handleTyping);

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_RECEIVED, handleNewMessage);
      socket.off('user_typing', handleTyping);
    };
  }, [socket, sosId, SOCKET_EVENTS]);

  const sendMessage = (content) => {
    if (!socket || !content.trim()) return;

    const message = {
      sosId,
      content: content.trim(),
      timestamp: new Date(),
      sender: {
        id: socket.userId,
        name: socket.userName,
        role: socket.userRole
      }
    };

    socket.emit(SOCKET_EVENTS.MESSAGE_SENT, message);
    setMessages(prev => [...prev, message]);
  };

  const sendTypingIndicator = (isTyping) => {
    if (socket) {
      socket.emit('typing', {
        sosId,
        isTyping,
        userId: socket.userId
      });
    }
  };

  return {
    messages,
    isTyping,
    sendMessage,
    sendTypingIndicator
  };
};
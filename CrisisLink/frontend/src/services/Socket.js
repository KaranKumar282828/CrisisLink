import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    try {
      this.socket = io(SOCKET_URL, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to server');
        this.isConnected = true;
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ Disconnected from server:', reason);
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('🔌 Connection error:', error);
        this.isConnected = false;
      });

      return this.socket;
    } catch (error) {
      console.error('Failed to connect socket:', error);
      return null;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 Socket disconnected');
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Cannot emit - socket not connected');
    }
  }

  getSocket() {
    return this.socket;
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Create and export a singleton instance
const socketService = new SocketService();
export default socketService;
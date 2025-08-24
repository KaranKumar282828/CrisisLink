import jwt from 'jsonwebtoken';

// Store connected users (in production, use Redis)
const connectedUsers = new Map();

export const initializeSocket = (io) => {
  // Socket.IO authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      socket.userName = decoded.name;
      
      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', {
      id: socket.userId,
      role: socket.userRole,
      name: socket.userName,
      socketId: socket.id
    });

    // Store user connection
    connectedUsers.set(socket.userId, {
      socketId: socket.id,
      role: socket.userRole,
      name: socket.userName,
      connectedAt: new Date()
    });

    // Join room based on role
    if (socket.userRole === 'volunteer') {
      socket.join('volunteers');
      console.log(`Volunteer ${socket.userName} joined volunteers room`);
    }

    if (socket.userRole === 'admin') {
      socket.join('admins');
    }

    // Join user-specific room
    socket.join(`user_${socket.userId}`);

    // Handle user registration
    socket.on('register_user', (data) => {
      console.log('User registered with data:', data);
      
      // Update user data
      if (connectedUsers.has(socket.userId)) {
        connectedUsers.set(socket.userId, {
          ...connectedUsers.get(socket.userId),
          ...data,
          lastSeen: new Date()
        });
      }

      socket.emit('registration_success', {
        message: 'Successfully registered with socket server',
        userId: socket.userId
      });
    });

    // Handle location updates from volunteers
    socket.on('location_update', (data) => {
      console.log('Location update from:', socket.userId, data);
      
      // Update user location
      if (connectedUsers.has(socket.userId)) {
        connectedUsers.set(socket.userId, {
          ...connectedUsers.get(socket.userId),
          location: data,
          lastLocationUpdate: new Date()
        });
      }

      // Broadcast to other volunteers (optional)
      socket.to('volunteers').emit('volunteer_location_updated', {
        userId: socket.userId,
        userName: socket.userName,
        ...data
      });
    });

    // Handle SOS acceptance
    socket.on('sos_accepted', (data) => {
      console.log('SOS accepted by:', socket.userId, data);
      
      // Notify all volunteers that this SOS was accepted
      io.to('volunteers').emit('sos_accepted', {
        sosId: data.sosId,
        acceptedBy: {
          id: socket.userId,
          name: socket.userName
        },
        acceptedAt: new Date()
      });

      // Notify the specific user who created the SOS
      io.to(`user_${data.userId}`).emit('sos_accepted_by_volunteer', {
        sosId: data.sosId,
        volunteer: {
          id: socket.userId,
          name: socket.userName
        }
      });
    });

    // Handle SOS creation (emitted from your SOS routes)
    socket.on('sos_created', (sosData) => {
      console.log('New SOS created:', sosData._id);
      
      // Broadcast to all volunteers
      io.to('volunteers').emit('sos_created', sosData);
      
      // Also notify admins
      io.to('admins').emit('new_sos_alert', sosData);
    });

    // Handle SOS status updates
    socket.on('sos_status_update', (data) => {
      console.log('SOS status updated:', data);
      
      // Notify relevant users
      io.to(`user_${data.userId}`).emit('sos_status_updated', data);
      
      if (data.volunteerId) {
        io.to(`user_${data.volunteerId}`).emit('sos_status_updated', data);
      }
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log('User disconnected:', {
        id: socket.userId,
        name: socket.userName,
        reason: reason
      });

      // Remove from connected users
      connectedUsers.delete(socket.userId);
      
      // Notify other volunteers if this was a volunteer
      if (socket.userRole === 'volunteer') {
        socket.to('volunteers').emit('volunteer_disconnected', {
          userId: socket.userId,
          userName: socket.userName
        });
      }
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

// Utility function to emit events from routes
export const emitToVolunteers = (io, event, data) => {
  io.to('volunteers').emit(event, data);
};

export const emitToUser = (io, userId, event, data) => {
  io.to(`user_${userId}`).emit(event, data);
};

export const emitToAdmins = (io, event, data) => {
  io.to('admins').emit(event, data);
};

export const getConnectedUsers = () => {
  return Array.from(connectedUsers.entries()).map(([userId, data]) => ({
    userId,
    ...data
  }));
};
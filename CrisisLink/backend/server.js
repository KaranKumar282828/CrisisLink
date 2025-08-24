import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server as IOServer } from "socket.io";
import jwt from "jsonwebtoken";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import testRoutes from "./src/routes/testRoutes.js";
import sosRoutes from "./src/routes/sosRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

const app = express();
const server = http.createServer(app);

// Socket.IO setup with authentication
const io = new IOServer(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store connected users
const connectedUsers = new Map();

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

// Socket.IO connection handling
io.on("connection", (socket) => {
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
  socket.on("register_user", (data) => {
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
  socket.on("location_update", (data) => {
    console.log('Location update from:', socket.userId, data);
    
    // Update user location
    if (connectedUsers.has(socket.userId)) {
      connectedUsers.set(socket.userId, {
        ...connectedUsers.get(socket.userId),
        location: data,
        lastLocationUpdate: new Date()
      });
    }

    // Broadcast to other volunteers
    socket.to('volunteers').emit('volunteer_location_updated', {
      userId: socket.userId,
      userName: socket.userName,
      ...data
    });
  });

  // Handle SOS acceptance
  socket.on("sos_accepted", (data) => {
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
    if (data.userId) {
      io.to(`user_${data.userId}`).emit('sos_accepted_by_volunteer', {
        sosId: data.sosId,
        volunteer: {
          id: socket.userId,
          name: socket.userName
        }
      });
    }
  });

  // Handle disconnect
  socket.on("disconnect", (reason) => {
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

// Make io available to routes
app.locals.io = io;

// Utility functions for routes to emit events
app.locals.emitToVolunteers = (event, data) => {
  io.to('volunteers').emit(event, data);
};

app.locals.emitToUser = (userId, event, data) => {
  io.to(`user_${userId}`).emit(event, data);
};

app.locals.emitToAdmins = (event, data) => {
  io.to('admins').emit(event, data);
};

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/test", testRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    connectedUsers: connectedUsers.size,
    uptime: process.uptime()
  });
});

// Socket info endpoint (for debugging)
app.get("/api/socket-info", (_req, res) => {
  const users = Array.from(connectedUsers.entries()).map(([userId, data]) => ({
    userId,
    ...data
  }));
  
  res.json({
    totalConnected: connectedUsers.size,
    connectedUsers: users,
    volunteerCount: users.filter(u => u.role === 'volunteer').length,
    adminCount: users.filter(u => u.role === 'admin').length
  });
});

app.get("/", (_req, res) => res.send("ResQLink API running"));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔌 Socket.IO enabled with authentication`);
    console.log(`🌐 CORS enabled for: ${process.env.CLIENT_ORIGIN || "http://localhost:5173"}`);
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
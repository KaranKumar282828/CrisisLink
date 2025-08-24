import { Router } from "express";
import SOS from "../models/SOS.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = Router();

/**
 * Create SOS (User)
 * POST /api/sos
 * body: { type, description, location: { lat, lng } }
 */
router.post("/", requireAuth, requireRole("user"), async (req, res) => {
  try {
    const { type, description, location } = req.body;
    
    if (!location?.lat || !location?.lng) {
      return res.status(400).json({ message: "Location coordinates are required" });
    }

    const newSOS = await SOS.create({
      user: req.user.id,
      type: type || "Emergency",
      description: description || "I need immediate assistance",
      location: {
        type: "Point",
        coordinates: [location.lng, location.lat]
      }
    });

    // Populate user data for Socket.IO emission
    const populatedSOS = await SOS.findById(newSOS._id)
      .populate("user", "name phone email")
      .populate("volunteer", "name email");

    // Emit real-time event to all volunteers
    try {
      const io = req.app.locals.io;
      if (io) {
        // Emit to volunteers room
        io.to("volunteers").emit("sos_created", {
          _id: populatedSOS._id,
          type: populatedSOS.type,
          description: populatedSOS.description,
          status: populatedSOS.status,
          location: populatedSOS.location,
          createdAt: populatedSOS.createdAt,
          updatedAt: populatedSOS.updatedAt,
          user: {
            id: populatedSOS.user._id,
            name: populatedSOS.user.name,
            phone: populatedSOS.user.phone,
            email: populatedSOS.user.email
          },
          volunteer: populatedSOS.volunteer ? {
            id: populatedSOS.volunteer._id,
            name: populatedSOS.volunteer.name
          } : null
        });

        // Also emit to admins
        io.to("admins").emit("new_sos_alert", {
          _id: populatedSOS._id,
          type: populatedSOS.type,
          user: populatedSOS.user.name,
          createdAt: populatedSOS.createdAt
        });

        console.log(`SOS ${populatedSOS._id} emitted to volunteers and admins`);
      }
    } catch (emitErr) {
      console.error("Socket emit error:", emitErr);
      // Don't fail the request if socket emission fails
    }

    return res.status(201).json({ 
      success: true,
      message: "SOS request created successfully",
      sos: newSOS 
    });

  } catch (err) {
    console.error("SOS creation error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || "Failed to create SOS request" 
    });
  }
});

/**
 * Get SOS created by logged-in user
 * GET /api/sos/my
 */
router.get("/my", requireAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const items = await SOS.find({ user: req.user.id })
      .populate("volunteer", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SOS.countDocuments({ user: req.user.id });

    res.json({ 
      success: true,
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("Get my SOS error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || "Failed to fetch your SOS requests" 
    });
  }
});

/**
 * Get nearby SOS for volunteers (geospatial)
 * GET /api/sos/nearby?lat=..&lng=..&maxDistance=meters
 * require: volunteer role
 */
router.get("/nearby", requireAuth, requireRole("volunteer"), async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const maxDistance = parseInt(req.query.maxDistance || "10000", 10); // default 10km

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ 
        success: false,
        message: "Valid latitude and longitude coordinates are required" 
      });
    }

    // Find pending SOS sorted by distance (nearest first)
    const items = await SOS.find({
      status: "Pending",
      location: {
        $nearSphere: {
          $geometry: { 
            type: "Point", 
            coordinates: [lng, lat] 
          },
          $maxDistance: maxDistance
        }
      }
    })
    .limit(50)
    .populate("user", "name phone")
    .select("-__v");

    res.json({ 
      success: true,
      items,
      count: items.length,
      searchLocation: { lat, lng },
      maxDistance
    });

  } catch (err) {
    console.error("Get nearby SOS error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || "Failed to fetch nearby SOS requests" 
    });
  }
});

/**
 * Volunteer accepts a request
 * POST /api/sos/:id/accept
 * require: volunteer
 */
router.post("/:id/accept", requireAuth, requireRole("volunteer"), async (req, res) => {
  try {
    const sos = await SOS.findById(req.params.id)
      .populate("user", "name phone")
      .populate("volunteer", "name email");

    if (!sos) {
      return res.status(404).json({ 
        success: false,
        message: "SOS request not found" 
      });
    }

    if (sos.status !== "Pending") {
      return res.status(400).json({ 
        success: false,
        message: "This SOS request has already been handled" 
      });
    }

    // Check if already accepted by another volunteer
    if (sos.volunteer && sos.volunteer._id.toString() !== req.user.id) {
      return res.status(409).json({ 
        success: false,
        message: "This SOS request has already been accepted by another volunteer" 
      });
    }

    sos.volunteer = req.user.id;
    sos.status = "In Progress";
    sos.acceptedAt = new Date();
    await sos.save();

    // Emit real-time event for SOS acceptance
    try {
      const io = req.app.locals.io;
      if (io) {
        // Notify all volunteers that this SOS was accepted
        io.to("volunteers").emit("sos_accepted", {
          sosId: sos._id,
          acceptedBy: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
          },
          acceptedAt: sos.acceptedAt,
          userId: sos.user._id
        });

        // Notify the user who created the SOS
        io.to(`user_${sos.user._id}`).emit("sos_accepted_by_volunteer", {
          sosId: sos._id,
          volunteer: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
          },
          acceptedAt: sos.acceptedAt
        });

        console.log(`SOS ${sos._id} accepted by volunteer ${req.user.name}`);
      }
    } catch (emitErr) {
      console.error("Socket emit error:", emitErr);
    }

    res.json({ 
      success: true,
      message: "SOS request accepted successfully",
      sos 
    });

  } catch (err) {
    console.error("Accept SOS error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || "Failed to accept SOS request" 
    });
  }
});

/**
 * Update SOS status (volunteer or admin)
 * PATCH /api/sos/:id/status { status: "Resolved" }
 */
router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Pending", "In Progress", "Resolved", "Cancelled"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}` 
      });
    }

    const sos = await SOS.findById(req.params.id)
      .populate("user", "name phone")
      .populate("volunteer", "name email");

    if (!sos) {
      return res.status(404).json({ 
        success: false,
        message: "SOS request not found" 
      });
    }

    // Authorization checks
    if (status === "Resolved" || status === "Cancelled") {
      const isAdmin = req.user.role === "admin";
      const isAssignedVolunteer = sos.volunteer && sos.volunteer._id.toString() === req.user.id;
      const isCreator = sos.user._id.toString() === req.user.id;

      if (!isAdmin && !isAssignedVolunteer && !isCreator) {
        return res.status(403).json({ 
          success: false,
          message: "Only admin, assigned volunteer, or creator can update status to Resolved/Cancelled" 
        });
      }
    }

    const oldStatus = sos.status;
    sos.status = status;
    
    if (status === "Resolved") {
      sos.resolvedAt = new Date();
    } else if (status === "Cancelled") {
      sos.cancelledAt = new Date();
    }

    await sos.save();

    // Emit real-time status update
    try {
      const io = req.app.locals.io;
      if (io) {
        io.emit("sos_status_updated", {
          sosId: sos._id,
          oldStatus,
          newStatus: status,
          updatedAt: sos.updatedAt,
          userId: sos.user._id,
          volunteerId: sos.volunteer?._id,
          updatedBy: {
            id: req.user.id,
            name: req.user.name,
            role: req.user.role
          }
        });

        // Notify specific users
        if (sos.user._id) {
          io.to(`user_${sos.user._id}`).emit("your_sos_updated", {
            sosId: sos._id,
            newStatus: status,
            updatedAt: sos.updatedAt
          });
        }

        if (sos.volunteer?._id) {
          io.to(`user_${sos.volunteer._id}`).emit("assigned_sos_updated", {
            sosId: sos._id,
            newStatus: status,
            updatedAt: sos.updatedAt
          });
        }
      }
    } catch (emitErr) {
      console.error("Socket emit error:", emitErr);
    }

    res.json({ 
      success: true,
      message: `SOS status updated to ${status}`,
      sos 
    });

  } catch (err) {
    console.error("Update SOS status error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || "Failed to update SOS status" 
    });
  }
});

/**
 * Get SOS by ID
 * GET /api/sos/:id
 */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const sos = await SOS.findById(req.params.id)
      .populate("user", "name phone email")
      .populate("volunteer", "name email phone");

    if (!sos) {
      return res.status(404).json({ 
        success: false,
        message: "SOS request not found" 
      });
    }

    // Authorization: User can see their own SOS or if they're a volunteer/admin
    const isOwner = sos.user._id.toString() === req.user.id;
    const isAssignedVolunteer = sos.volunteer && sos.volunteer._id.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAssignedVolunteer && !isAdmin) {
      return res.status(403).json({ 
        success: false,
        message: "Access denied. You can only view your own SOS requests." 
      });
    }

    res.json({ 
      success: true,
      sos 
    });

  } catch (err) {
    console.error("Get SOS by ID error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || "Failed to fetch SOS request" 
    });
  }
});

export default router;
import { Router } from "express";
import User from "../models/User.js";
import SOS from "../models/SOS.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = Router();

// Admin dashboard statistics
router.get("/stats", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVolunteers = await User.countDocuments({ role: "volunteer" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    
    const totalSOS = await SOS.countDocuments();
    const pendingSOS = await SOS.countDocuments({ status: "Pending" });
    const inProgressSOS = await SOS.countDocuments({ status: "In Progress" });
    const resolvedSOS = await SOS.countDocuments({ status: "Resolved" });

    // Last 7 days statistics
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSOS = await SOS.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // SOS by type
    const sosByType = await SOS.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);

    // Response time statistics (average time from creation to acceptance)
    const responseStats = await SOS.aggregate([
      { $match: { status: { $in: ["In Progress", "Resolved"] } } },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: { $subtract: ["$updatedAt", "$createdAt"] } },
          minResponseTime: { $min: { $subtract: ["$updatedAt", "$createdAt"] } },
          maxResponseTime: { $max: { $subtract: ["$updatedAt", "$createdAt"] } }
        }
      }
    ]);

    res.json({
      users: { total: totalUsers, volunteers: totalVolunteers, admins: totalAdmins },
      sos: { total: totalSOS, pending: pendingSOS, inProgress: inProgressSOS, resolved: resolvedSOS },
      recent: { sos: recentSOS, users: recentUsers },
      sosByType,
      responseTime: responseStats[0] || {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get all users with pagination and filtering
router.get("/users", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role;
    const search = req.query.search;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get all SOS requests with filtering
router.get("/sos", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const type = req.query.type;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const sosRequests = await SOS.find(filter)
      .populate("user", "name email phone")
      .populate("volunteer", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await SOS.countDocuments(filter);

    res.json({
      sosRequests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Update user status (block/unblock)
router.patch("/users/:id/status", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = status;
    await user.save();

    res.json({ message: "User status updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete("/users/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't allow deletion of own account
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Update SOS status
router.patch("/sos/:id/status", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatus = ["Pending", "In Progress", "Resolved"];
    
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const sos = await SOS.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user volunteer");

    if (!sos) {
      return res.status(404).json({ message: "SOS request not found" });
    }

    res.json({ message: "SOS status updated", sos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
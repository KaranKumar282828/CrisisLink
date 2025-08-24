import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const sendAuth = (res, user) => {
  const token = signToken({ id: user._id, role: user.role });
  // cookie + json
  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // set true in production (HTTPS)
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    .json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already in use" });

    const user = await User.create({ name, email, password, role });
    sendAuth(res, user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    sendAuth(res, user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
});

export default router;

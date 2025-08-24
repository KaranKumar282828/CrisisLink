import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = Router();

router.get("/ping", (_req, res) => res.json({ ok: true }));

router.get("/protected", requireAuth, (req, res) => {
  res.json({ message: `Hello ${req.user.id}`, role: req.user.role });
});

router.get("/admin-only", requireAuth, requireRole("admin"), (_req, res) => {
  res.json({ secret: "admin stuff" });
});

export default router;


import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

function publicUser(row) {
  return {
    id: row.id,
    name: row.name,
    membershipId: row.membership_id,
    role: row.role
  };
}

function makeToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      membershipId: user.membershipId,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  );
}

// MEMBER REGISTRATION
router.post("/register", asyncHandler(async (req, res) => {
  const { name, membershipId, password } = req.body || {};

  if (
    typeof name !== "string" ||
    typeof membershipId !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !membershipId.trim() ||
    !password
  ) {
    return res.status(400).json({
      message: "Name, membership ID and password are required."
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must contain at least 8 characters."
    });
  }

  const hash = await bcrypt.hash(password, 12);

  const [result] = await pool.execute(
    `INSERT INTO users (name, membership_id, password_hash, role)
     VALUES (?, ?, ?, 'Member')`,
    [name.trim(), membershipId.trim(), hash]
  );

  const user = {
    id: result.insertId,
    name: name.trim(),
    membershipId: membershipId.trim(),
    role: "Member"
  };

  res.status(201).json({
    message: "Member account created successfully.",
    user,
    token: makeToken(user)
  });
}));

// USER LOGIN
router.post("/login", asyncHandler(async (req, res) => {
  const { membershipId, password } = req.body || {};

  if (!membershipId || !password) {
    return res.status(400).json({
      message: "Membership ID and password are required."
    });
  }

  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE membership_id=? LIMIT 1",
    [String(membershipId).trim()]
  );

  if (
    !rows.length ||
    !(await bcrypt.compare(String(password), rows[0].password_hash))
  ) {
    return res.status(401).json({
      message: "Membership ID or password is incorrect."
    });
  }

  const user = publicUser(rows[0]);

  res.json({
    message: "Signed in successfully.",
    user,
    token: makeToken(user)
  });
}));

// CURRENT SIGNED-IN USER
router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;

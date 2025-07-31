import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/database.js";
import authRoutes from "./src/routes/auth.js";
import messageRoutes from "./src/routes/messages.js";
import questionRoutes from "./src/routes/questionRoutes.js";
import AdminQuestionRoutes from "./src/routes/AdminQuestionRoutes.js";
import userProfileRoutes from "./src/routes/userProfileRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import contactRoutes from "./src/routes/contactRoute.js";
import session from "express-session";
import passport from "passport";
import socketHandler from "./src/services/socketHandler.js";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";
import Question from "./src/models/Question.js";
import jwt from "jsonwebtoken";
import tagRouter from "./src/routes/tagRoutes.js";
import answerRoutes from "./src/routes/answerRoutes.js";
import { createServer } from 'http';
import { Server } from 'socket.io';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './src/models/User.js';
import chatRoutes from './src/routes/chatRoutes.js';
import socketHandler from './src/services/socketHandler.js';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.JWT_SECRET || "yoursecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/admin/questions", AdminQuestionRoutes);
app.use("/api/profile", userProfileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/answer", answerRoutes);
app.use("/contact", contactRoutes);
app.use("/api/tags", tagRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Stack Overflow Clone API Server is running!",
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found',
//   });
// });

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// Use cookieParser and session for Socket.IO auth
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth setup (if not already present)
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = await User.create({
        fullName: profile.displayName,
        email: profile.emails[0].value,
        password: 'google-oauth',
        avatar: profile.photos[0]?.value,
        isVerified: true,
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Add chat routes
app.use('/api/chats', chatRoutes);

// Socket.io setup (after all routes and middleware)
const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});
socketHandler(io);

app.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already exists with this email",
        });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error creating user",
        error: error.message,
      });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    // Generate a real JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "yoursecret",
      { expiresIn: "7d" }
    );
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error during login",
        error: error.message,
      });
  }
});

// CREATE ADMIN ROUTE
app.post("/api/create-admin", async (req, res) => {
  try {
    const email = "admin@gmail.com";
    const password = "admin123";
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res
        .status(200)
        .json({ success: true, message: "Admin user already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const adminUser = new User({
      fullName: "Admin User",
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });
    await adminUser.save();
    res
      .status(201)
      .json({ success: true, message: "Admin user created successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// USER CRUD ROUTES
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, data: users, count: users.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required",
      });
    }
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      fullName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "user",
      isVerified: true,
    });
    await user.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format" });
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (updates.password && updates.password.trim() !== "") {
      updates.password = await bcrypt.hash(updates.password, 12);
    } else {
      delete updates.password;
    }

    updates.updatedAt = new Date();

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      message: "User deleted successfully",
      data: { id: deletedUser._id },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format" });
    }
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all questions for frontend (no approval required)
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json({ success: true, data: questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while fetching questions",
      });
  }
});

// Create question (no approval required)
app.post("/api/questions", async (req, res) => {
  const { title, content, tags, category, author } = req.body;
  if (!title || !content || !category || !author) {
    return res.status(400).json({
      success: false,
      message:
        "Validation Error: Title, content, category, and author are required fields.",
      received: { title, content, tags, category, author },
    });
  }

  const newQuestion = new Question({
    title,
    content,
    tags: tags || [],
    category,
    author,
  });

  try {
    await newQuestion.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Question created successfully",
        data: newQuestion,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error creating question",
        error: error.message,
      });
  }
});

// Edit question (no edited tag)
app.put("/api/questions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log(`Received update for question ${id}:`, updates);

    // Ensure required fields are not being removed
    if (updates.title === "" || updates.content === "") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Title and content cannot be empty.",
        });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedQuestion) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    console.log("Question updated successfully:", updatedQuestion._id);
    res.json({
      success: true,
      message: "Question updated successfully",
      data: updatedQuestion,
    });
  } catch (error) {
    console.error(`Error updating question ${req.params.id}:`, error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE QUESTION
app.delete("/api/questions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Attempting to delete question:", id);
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    console.log("Question deleted successfully:", id);
    res.json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    console.error(`Error deleting question ${req.params.id}:`, error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Admin Dashboard Route (Single Source of Truth) ---
app.get("/api/admin/dashboard", async (req, res) => {
  try {
    // User Stats
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: "admin" });
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) },
    });
    const allUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    // Question Stats
    const totalQuestions = await Question.countDocuments();
    const approvedQuestions = await Question.countDocuments({
      isApproved: true,
    });
    const openQuestions = await Question.countDocuments({ status: "open" });
    // Use all questions for admin dashboard (pending, approved, etc)
    const allQuestions = await Question.find().sort({ createdAt: -1 });

    // Chart Data
    const monthlyUserData = [];
    const monthlyQuestionData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthUsers = await User.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      });
      const monthQuestions = await Question.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      });

      const monthName = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      monthlyUserData.push({ month: monthName, users: monthUsers });
      monthlyQuestionData.push({ month: monthName, questions: monthQuestions });
    }

    // Admin Profile
    const adminProfile = await User.findOne({
      email: "admin@gmail.com",
    }).select("-password");

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          usersByRole: { admin: adminCount, user: totalUsers - adminCount },
          recentUsers,
          totalQuestions,
          questionsByStatus: {
            open: openQuestions,
            closed: totalQuestions - openQuestions,
          },
          questionsByApproval: {
            approved: approvedQuestions,
            pending: totalQuestions - approvedQuestions,
          },
        },
        charts: {
          monthlyUsers: monthlyUserData,
          monthlyQuestions: monthlyQuestionData,
        },
        users: allUsers,
        questions: allQuestions,
        adminProfile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message,
      data: {
        stats: {},
        charts: { monthlyUsers: [], monthlyQuestions: [] },
        users: [],
        questions: [],
        adminProfile: {},
      },
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `The requested URL ${req.originalUrl} was not found on this server.`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("UNHANDLED ERROR:", err);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred.",
  });
});

// Start the server using server.listen (not app.listen)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("");
  console.log("🚀 ========================================");
  console.log(`Server running on port ${PORT}`);
  console.log("🗄️  Database: MongoDB connected successfully");
  console.log("🎯 ALL DATA IS NOW FROM THE LIVE DATABASE");
  console.log("");
  console.log("🔗 Main Endpoints:");
  console.log(`   🔑 Auth: POST /api/auth/login`);
  console.log(`   👥 Users: GET /api/users`);
  console.log(`   ❓ Questions: GET /api/questions`);
  console.log(`   📊 Dashboard: GET /api/admin/dashboard`);
  console.log("🚀 ========================================");
  console.log("");
});

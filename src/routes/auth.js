import express from "express";
import passport from "passport";
import User from "../models/User.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();

//Google OAuth Setup
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        let user = await User.findOne({
          email: profile.emails[0].value.toLowerCase(),
        });
        if (!user) {
          user = await User.create({
            fullName: profile.displayName,
            email: profile.emails[0].value.toLowerCase(),
            password: "google_oauth",
            avatar: profile.photos[0]?.value,
            isVerified: true,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

//Google OAuth Route

//Start OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//Callback URL
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    // req.user is set by passport after successful authentication
    const user = req.user;
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "yoursecret",
      { expiresIn: "7d" }
    );
    // Send script to set localStorage and redirect to frontend
    res.send(`
      <script>
        localStorage.setItem('user', JSON.stringify(${JSON.stringify({
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        })}));
        localStorage.setItem('token', '${token}');
        window.location.href = 'http://localhost:5173/google-callback';
      </script>
    `);
  }
);

//Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.CLIENT_URL);
  });
});

//Forgot Password - OTP Handling
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetOTP = otp;
  user.resetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Send OTP via email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "khadkasandip489@gmail.com",
      pass: "atfdaldhcnpaahkg",
    },
  });

  await transporter.sendMail({
    from: '"Stack Overflow Clone" <your_gmail@gmail.com>',
    to: user.email,
    subject: "Password Reset Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;">
        <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 32px;">
          <h2 style="color: #4f46e5; text-align: center; margin-bottom: 24px;">Password Reset Verification</h2>
          <p>Hi <b>${user.fullName || "there"}</b>,</p>
          <p>We received a request to reset your password for your Stack Overflow Clone account.</p>
          <p style="margin: 24px 0 8px 0;">Please use the verification code below to reset your password:</p>
          <div style="font-size: 2.2rem; font-weight: bold; letter-spacing: 0.5rem; color: #4f46e5; background: #f1f5f9; padding: 16px 0; border-radius: 6px; text-align: center; margin-bottom: 24px;">
            ${otp}
          </div>
          <p style="margin-bottom: 16px;">This code is valid for <b>10 minutes</b>. If you did not request a password reset, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
          <div style="text-align: center; color: #94a3b8; font-size: 0.95rem;">
            &copy; ${new Date().getFullYear()} Stack Overflow Clone. All rights reserved.
          </div>
        </div>
      </div>
    `,
  });

  res.json({ success: true, message: "OTP sent to email" });
});

// Verify OTP route
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({
    email: email.trim().toLowerCase(),
    resetOTP: otp.trim(),
    resetOTPExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }

  res.json({ success: true, message: "OTP verified." });
});

// Reset Password route
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({
    email: email.trim().toLowerCase(),
    resetOTP: otp.trim(),
    resetOTPExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }

  // Hash the new password
  user.password = await bcrypt.hash(newPassword, 12);

  // Clear OTP fields
  user.resetOTP = undefined;
  user.resetOTPExpires = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful." });
});

export default router;

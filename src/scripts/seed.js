import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'admin123';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log('Admin user already exists.');
    process.exit(0);
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const admin = new User({
    fullName: 'Admin',
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
    isVerified: true,
  });
  await admin.save();
  console.log('Admin user created successfully.');
  process.exit(0);
};

seedAdmin().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});

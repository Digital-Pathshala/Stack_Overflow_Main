import mongoose from 'mongoose';
import Room from '../models/Room.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const initializeRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find or create admin user for room creation
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.findOne();
      if (adminUser) {
        adminUser.role = 'admin';
        await adminUser.save();
      }
    }

    if (!adminUser) {
      console.log('No users found. Please create a user first.');
      return;
    }

    // Create default rooms
    const defaultRooms = [
      {
        name: 'general',
        description: 'General discussion room',
        createdBy: adminUser._id,
        isPrivate: false
      },
      {
        name: 'help',
        description: 'Help and support room',
        createdBy: adminUser._id,
        isPrivate: false
      },
      {
        name: 'random',
        description: 'Random chat room',
        createdBy: adminUser._id,
        isPrivate: false
      }
    ];

    for (const roomData of defaultRooms) {
      const existingRoom = await Room.findOne({ name: roomData.name });
      if (!existingRoom) {
        const newRoom = new Room(roomData);
        await newRoom.save();
        console.log(`Created room: ${roomData.name}`);
      } else {
        console.log(`Room already exists: ${roomData.name}`);
      }
    }

    console.log('Room initialization completed');
  } catch (error) {
    console.error('Error initializing rooms:', error);
  } finally {
    await mongoose.disconnect();
  }
};

initializeRooms(); 
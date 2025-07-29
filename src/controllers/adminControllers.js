import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' }).select('-password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin profile'
    });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { fullName, email, currentPassword, newPassword } = req.body;
    const admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin profile not found'
      });
    }

    // Update basic info
    admin.fullName = fullName;
    admin.email = email;

    // Handle password update if provided
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      admin.password = await bcrypt.hash(newPassword, 10);
    }

    await admin.save();
    const { password, ...updatedAdmin } = admin.toObject();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedAdmin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};
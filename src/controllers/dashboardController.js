import User from "../models/User.js";
import Question from "../models/Question.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Get current counts
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: "admin" });
    const regularUsers = await User.countDocuments({ role: "user" });
    const totalQuestions = await Question.countDocuments();
    const openQuestions = await Question.countDocuments({ status: "open" });
    const closedQuestions = await Question.countDocuments({ status: "closed" });

    // Get historical data for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const questionGrowth = await Question.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        usersByRole: {
          admin: adminUsers,
          user: regularUsers,
        },
        totalQuestions,
        questionsByStatus: {
          open: openQuestions,
          closed: closedQuestions,
        },
        userGrowth,
        questionGrowth,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
    });
  }
};

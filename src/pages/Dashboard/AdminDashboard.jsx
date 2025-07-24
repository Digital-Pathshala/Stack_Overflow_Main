import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "./AdminDashboard.css";

// Register all required plugins including Filler
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    usersByRole: {
      admin: 0,
      user: 0,
    },
    totalQuestions: 0,
    questionsByStatus: {
      open: 0,
      closed: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications] = useState([]);
  const [messages] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState({
    labels: [],
    datasets: [],
  });
  const [questionOverviewData, setQuestionOverviewData] = useState({
    labels: [],
    datasets: [],
  });

  const formatMonthData = (growthData) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentDate = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(currentDate.getMonth() - (5 - i));
      return {
        month: d.getMonth(),
        year: d.getFullYear(),
      };
    });

    return {
      labels: last6Months.map((d) => `${months[d.month]} ${d.year}`),
      data: last6Months.map((date) => {
        const matchingData = growthData.find(
          (d) => d._id.month === date.month + 1 && d._id.year === date.year
        );
        return matchingData ? matchingData.count : 0;
      }),
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;
        setCurrentUser(user);

        // Fetch dashboard stats
        const response = await axios.get(
          "http://localhost:5000/api/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setStats(response.data.data);

          // Format data for charts
          const userMonthlyData = formatMonthData(
            response.data.data.userGrowth
          );
          const questionMonthlyData = formatMonthData(
            response.data.data.questionGrowth
          );

          setUserGrowthData({
            labels: userMonthlyData.labels,
            datasets: [
              {
                label: "New Users",
                data: userMonthlyData.data,
                borderColor: "#16a34a",
                backgroundColor: "rgba(22, 163, 74, 0.1)",
                tension: 0.4,
                fill: true,
              },
            ],
          });

          setQuestionOverviewData({
            labels: questionMonthlyData.labels,
            datasets: [
              {
                label: "New Questions",
                data: questionMonthlyData.data,
                borderColor: "#7c3aed",
                backgroundColor: "rgba(124, 58, 237, 0.1)",
                tension: 0.4,
                fill: true,
              },
            ],
          });
        }
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login page
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Growth",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="top-bar">
        <div className="date-display">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className="top-actions">
          <div className="notification-icon">
            <i className="fas fa-bell"></i>
            {notifications.length > 0 && (
              <span className="badge">{notifications.length}</span>
            )}
          </div>
          <div className="message-icon">
            <i className="fas fa-envelope"></i>
            {messages.length > 0 && (
              <span className="badge">{messages.length}</span>
            )}
          </div>
          <div className="user-profile">
            <img
              src={currentUser?.avatar || "/default-avatar.png"}
              alt="User"
              className="avatar"
            />
            <span>{currentUser?.fullName || "Admin User"}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>

      <div className="welcome-section">
        <h1>Hi, {currentUser?.fullName || "Admin"}</h1>
        <p>Welcome to Admin Dashboard</p>
      </div>

      {/* User Statistics Section */}
      <div className="section-title">
        <h2>User Statistics</h2>
      </div>
      <div className="stats-grid">
        <div className="stat-card total-users">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>{stats?.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card regular-users">
          <div className="stat-icon">
            <i className="fas fa-user"></i>
          </div>
          <div className="stat-info">
            <h3>{stats?.usersByRole?.user || 0}</h3>
            <p>Regular Users</p>
          </div>
        </div>

        <div className="stat-card admin-users">
          <div className="stat-icon">
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="stat-info">
            <h3>{stats?.usersByRole?.admin || 0}</h3>
            <p>Admin Users</p>
          </div>
        </div>
      </div>

      {/* Question Statistics Section */}
      <div className="section-title">
        <h2>Question Statistics</h2>
      </div>
      <div className="stats-grid questions-grid">
        <div className="stat-card total-questions">
          <div className="stat-icon">
            <i className="fas fa-question-circle"></i>
          </div>
          <div className="stat-info">
            <h3>{stats?.totalQuestions || 0}</h3>
            <p>Total Questions</p>
            <div className="stat-breakdown">
              <span className="stat-detail">
                <i className="fas fa-lock-open"></i>{" "}
                {stats?.questionsByStatus?.open || 0} Open
              </span>
              <span className="stat-detail">
                <i className="fas fa-lock"></i>{" "}
                {stats?.questionsByStatus?.closed || 0} Closed
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>User Growth</h3>
          <div className="chart-container">
            <Line data={userGrowthData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Questions Overview</h3>
          <div className="chart-container">
            <Line data={questionOverviewData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

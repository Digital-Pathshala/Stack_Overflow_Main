import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.jpg";
import {
  Search,
  Bell,
  User,
  TrendingUp,
  MessageCircle,
  Eye,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Question = () => {
  const [activeTab, setActiveTab] = useState("Recent");
  const [questions, setQuestions] = useState([]);
  const [showUserQuestions, setShowUserQuestions] = useState(false);

  const navigate = useNavigate();
  const loggedInUserId = localStorage.getItem("userId");
  const API_BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/question/getAllQuestions`);
        const data = await response.json();
        setQuestions(data?.data || []);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    fetchQuestions();
  }, []);

  const displayedQuestions = showUserQuestions
    ? questions.filter((q) => q.author === loggedInUserId)
    : questions;

  const handleAskQuestion = () => {
    navigate("/askQuestion");
  };

  const handleBack = () => {
    navigate("/"); // navigate to home page
  };

  const popularTags = [
    { name: "python", color: "bg-green-100 text-green-800" },
    { name: "javascript", color: "bg-green-100 text-green-800" },
    { name: "react", color: "bg-green-100 text-green-800" },
    { name: "nodejs", color: "bg-green-100 text-green-800" },
    { name: "css", color: "bg-green-100 text-green-800" },
    { name: "algorithms", color: "bg-green-100 text-green-800" },
    { name: "html", color: "bg-green-100 text-green-800" },
    { name: "sql", color: "bg-green-100 text-green-800" },
  ];

  const topContributors = [
    { name: "Mausam Gurung", reputation: 223 },
    { name: "Adit Tamang", reputation: 223 },
    { name: "Sandip Khadka", reputation: 223 },
    { name: "Ribesh Raut", reputation: 223 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="h-10 w-auto" />
            </div>
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search questions, tags or topics"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
              <User className="h-6 w-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Top Buttons */}
          <div className="flex justify-between mb-4">
            <button
              onClick={handleAskQuestion}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Ask Question
            </button>

            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-lg"
            >
              ← Back to Home
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6">
            {["Recent", "Trending", "Unanswered"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab === "Trending" && <TrendingUp className="inline h-4 w-4 mr-1" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {displayedQuestions.length === 0 ? (
              <p className="text-gray-600">No questions to display.</p>
            ) : (
              displayedQuestions.map((question) => (
                <div
                  key={question._id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center space-y-2 text-gray-500">
                      <ArrowUp className="h-5 w-5 hover:text-green-500 cursor-pointer" />
                      <span>↑ {question.vote?.up || 0}</span>
                      <ArrowDown className="h-5 w-5 hover:text-red-500 cursor-pointer" />
                      <span>↓ {question.vote?.down || 0}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-green-600 cursor-pointer">
                        {question.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{question.content}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {question.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full hover:bg-green-200 cursor-pointer"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>{question.answers}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{question.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">🏷️ Popular Tags</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {popularTags.map((tag) => (
                <span
                  key={tag.name}
                  className={`px-3 py-1 text-sm rounded-full cursor-pointer hover:opacity-80 ${tag.color}`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">View all tags</button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
            <div className="space-y-3">
              {topContributors.map((contributor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">{contributor.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{contributor.reputation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;

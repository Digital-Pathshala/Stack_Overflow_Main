import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebars/Sidebar";
import dp1 from "../../assets/dp1.jpg";
import { Search, ShieldUser, Inbox, Trophy } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const Home = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/question/getAllQuestions`
        );
        const data = await response.json();
        setQuestions(data.data || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <img src={dp1} alt="Logo" className="w-10 h-10 rounded-full" />
            <span className="font-bold text-xl">
              <span style={{ color: "#1db954" }}>Digital</span>{" "}
              <span className="font-normal">Pathsala</span>
            </span>
          </div>

          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Inbox />
            <ShieldUser />
            <Trophy />
            <button className="p-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          {/* Questions Feed */}
          <h2 className="text-2xl font-semibold mb-4">Latest Questions</h2>

          {questions.length === 0 ? (
            <p>Loading questions...</p>
          ) : (
            <div className="space-y-4">
              {questions.map((q) => (
                <div
                  key={q._id}
                  className="border p-4 rounded-md shadow hover:shadow-md transition"
                >
                  <h3 className="text-lg font-bold text-blue-600">{q.title}</h3>
                  <div className="text-sm text-gray-500 mt-1">
                    Asked by <strong>{q.askedBy}</strong> ·{" "}
                    {new Date(q.createdAt).toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <span>
                      Upvotes: {q.votes?.up ?? 0} | Downvotes: {q.votes?.down ?? 0}
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {q.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-200 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;

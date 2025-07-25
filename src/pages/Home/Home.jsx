import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebars/Sidebar";
import dp1 from "../../assets/dp1.jpg";
import { Search, ShieldUser, Inbox, Trophy } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:5000";

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/questions`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setQuestions(data.data || []);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Unable to load questions. Check if backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
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
          </div>
        </div>
      </header>

      {/* Main Section */}
      <div className="flex min-h-screen bg-white">
        <Sidebar />

        <main className="flex-1 px-8 py-10">
          {/* Welcome */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back, <span className="text-green-600">Adit Tamang</span>
            </h2>
            <p className="text-gray-500 text-md mt-1">
              What do you want to learn today?
            </p>
          </div>

          {/* Latest Questions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Latest Questions
              </h3>

              {loading ? (
                <p className="text-gray-400">Loading questions...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="space-y-6">
                  {questions.map((q) => (
                    <div
                      key={q._id}
                      className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200"
                    >
                      <h4 className="text-xl font-bold text-blue-700 mb-1">
                        {q.title}
                      </h4>
                      <div className="text-sm text-gray-500 mb-2">
                        Asked by <span className="font-medium">{q.askedBy}</span> ·{" "}
                        {new Date(q.createdAt).toLocaleString()}
                      </div>
                      <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
                        <span>
                          Upvotes: <strong>{q.votes?.up ?? 0}</strong> | Downvotes:{" "}
                          <strong>{q.votes?.down ?? 0}</strong>
                        </span>
                        <div className="flex gap-2 flex-wrap ml-auto">
                          {q.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-200 text-xs text-gray-700 px-2 py-1 rounded"
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
            </div>

            {/* Interesting Section */}
            <div>
              <h3 className="text-2xl font-semibold text-green-600 mb-4">
                Interesting for you
              </h3>
              {loading ? (
                <p className="text-gray-400">Loading posts...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="space-y-4">
                  {questions.slice(0, 4).map((q) => (
                    <div
                      key={q._id}
                      className="border-l-4 border-green-500 bg-green-50 px-4 py-3 rounded-md shadow-sm"
                    >
                      <h4 className="text-md font-semibold text-gray-800">
                        {q.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebars/Sidebar";
import dp1 from "../../assets/dp1.jpg";
import { Search, ShieldUser, Inbox, Trophy } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [questions, setQuestions] = useState([]); // For filtered questions
  const [selectedTag, setSelectedTag] = useState(null); // Active tag clicked
  const navigate = useNavigate();

  // Fetch all tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/tags`);
        const data = await response.json();
        setTags(data || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  // Fetch questions by selected tag
  const fetchQuestionsByTag = async (tagName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tags/${tagName}`);
      const data = await response.json();
      setQuestions(data.data || []);
      setSelectedTag(tagName);
    } catch (error) {
      console.error("Error fetching questions by tag:", error);
    }
  };

  // Filtered tags by search term
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header (same as Home.jsx) */}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
      <div className="flex min-h-screen bg-white">
        <Sidebar />

        <main className="flex-1 px-8 py-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Tags</h2>
          <p className="text-gray-600 mb-8">
            A tag is a keyword or label that categorizes your question with other, similar questions.
            Using the right tags makes it easier for others to find and answer your question.
          </p>

          {/* Tags Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTags.map((tag) => (
              <div
                key={tag.name}
                onClick={() => fetchQuestionsByTag(tag.name)}
                className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md cursor-pointer transition duration-200"
              >
                <div className="text-lg font-semibold text-blue-700 mb-2">
                  #{tag.name}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {tag.description || "Questions related to this tag"}
                </p>
                <div className="text-xs text-gray-500">
                  {tag.questionCount} questions <br />
                  {tag.recentCount} asked this week
                </div>
              </div>
            ))}
          </div>

          {/* Show Questions for Selected Tag */}
          {selectedTag && (
            <div className="mt-10">
              <h3 className="text-2xl font-bold text-green-600 mb-4">
                Questions tagged with "{selectedTag}"
              </h3>
              {questions.length === 0 ? (
                <p className="text-gray-400">No questions found for this tag.</p>
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
                        Asked by{" "}
                        <span className="font-medium">{q.askedBy || "Anonymous"}</span>{" "}
                        · {new Date(q.createdAt).toLocaleString()}
                      </div>
                      <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
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
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TagsPage;

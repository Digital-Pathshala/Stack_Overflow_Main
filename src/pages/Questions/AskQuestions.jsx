// src/pages/AskQuestion/AskQuestion.jsx

import React, { useState } from 'react';
import { Users, Edit3, Award, Clipboard } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebars/Sidebar';
import Navbar from '../../components/Navbar/Navbar';

const AskQuestion = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('javascript');
  const navigate = useNavigate();

  const authorId = '64b0c8f4d2e8f9b123456789'; // Replace with real user ID after login

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagsArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      const res = await axios.post('http://localhost:5000/api/question/createQuestion', {
        title,
        content,
        tags: tagsArray,
        category,
        author: authorId,
      });

      if (res.status === 200 || res.status === 201) {
        const questionId = res.data.data?._id;
        alert('✅ Question posted successfully!');
        navigate(`/questions/${questionId}`);
      } else {
        alert('⚠️ Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting question:', error.response?.data || error.message);
      alert('❌ Failed to submit question. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-bold">?</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-800">Ask a Question</h1>
              </div>
              <p className="text-green-600 text-sm mb-6">
                Get help from the community by asking a clear, detailed question.
              </p>
              <div className="flex justify-between items-center mb-8">
                {[Edit3, Users, Award].map((Icon, i) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Icon size={20} className="text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-600 text-center">
                        {['Ask a Question', 'Receive Feedback', 'Post Publicly'][i]}
                      </span>
                    </div>
                    {i < 2 && <div className="flex-1 h-px bg-gray-200 mx-4" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} method="POST" className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div>
                <label htmlFor="title" className="font-medium text-gray-800 flex items-center space-x-2 mb-2">
                  <Clipboard size={16} className="text-gray-600" />
                  <span>Question Title</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your question title..."
                />
              </div>

              <div>
                <label htmlFor="content" className="font-medium text-gray-800 mb-2 block">Content</label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe your question in detail..."
                />
              </div>

              <div>
                <label htmlFor="tags" className="font-medium text-gray-800 mb-2 block">Tags (comma-separated)</label>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  required
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., react, node.js, mongodb"
                />
              </div>

              <div>
                <label htmlFor="category" className="font-medium text-gray-800 mb-2 block">Category</label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="react">React</option>
                  <option value="node.js">Node.js</option>
                  <option value="database">Database</option>
                  <option value="css">CSS</option>
                  <option value="html">HTML</option>
                  <option value="general">General</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-green-600 mb-2">Tips for a good question:</h3>
                <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
                  <li>Be specific and clear in your title</li>
                  <li>Provide context and background information</li>
                  <li>Include relevant code snippets</li>
                  <li>Use appropriate tags to help others find your question</li>
                  <li>Show what you've already tried</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;

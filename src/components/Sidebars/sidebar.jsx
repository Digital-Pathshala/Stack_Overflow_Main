import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  House,
  MessageSquare,
  Tags,
  Bookmark,
  Swords,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        <Link
          to="/"
          className={`flex items-center space-x-3 p-2 rounded ${isActive('/') ? 'bg-gray-100 text-green-600' : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
          <House className="w-5 h-5" />
          <span className="font-medium">Home</span>
        </Link>

        <Link
          to="/questions"
          className={`flex items-center space-x-3 p-2 rounded ${isActive('/questions') ? 'bg-gray-100 text-green-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Questions</span>
        </Link>


        <Link
          to="/tags"
          className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded"
        >
          <Tags className="w-4 h-4" />
          <span>Tags</span>
        </Link>

        <Link
          to="/saves"
          className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded"
        >
          <Bookmark className="w-4 h-4" />
          <span>Saves</span>
        </Link>

        <Link
          to="/challenges"
          className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded"
        >
          <Swords className="w-4 h-4" />
          <span>Challenges</span>
          <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded">NEW</span>
        </Link>

        <Link
          to="/chat"
          className={`flex items-center space-x-3 p-2 rounded ${isActive('/chat') ? 'bg-gray-100 text-green-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;

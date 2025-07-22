import React from 'react';
import {
  House,
  MessageSquare,
  Tags,
  Bookmark,
  Swords,
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        <a href="/" className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded">
          <House />
          <span className="font-medium">Home</span>
        </a>
        <a href="/askQuestion" className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded">
          <MessageSquare className="w-4 h-4" />
          <span>Questions</span>
        </a>
        <a href="#" className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded">
          <Tags />
          <span>Tags</span>
        </a>
        <a href="#" className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded">
          <Bookmark className="w-4 h-4" />
          <span>Saves</span>
        </a>
        <a href="#" className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded">
          <Swords />
          <span>Challenges</span>
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">NEW</span>
        </a>
        <a href="/chat" className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded">
          <MessageSquare className="w-4 h-4" />
          <span>Chat</span>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;

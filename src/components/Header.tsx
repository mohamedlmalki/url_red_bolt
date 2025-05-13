import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-bold text-blue-600 flex items-center gap-2 transition-transform hover:scale-105"
        >
          <ExternalLink size={24} />
          <span>RedirectHub</span>
        </Link>
        <nav>
          <Link 
            to="/" 
            className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-6">
      <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
        <p className="flex items-center justify-center gap-1">
          Built with <Heart size={16} className="text-red-500" /> using React & Vite
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} RedirectHub
        </p>
      </div>
    </footer>
  );
};

export default Footer;
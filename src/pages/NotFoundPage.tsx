import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md text-center animate-fade-in">
      <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Redirect Not Found</h1>
      <p className="text-gray-600 mb-6">
        The redirect link you're looking for doesn't exist or may have been removed.
      </p>
      
      <Link 
        to="/"
        className="btn btn-primary"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
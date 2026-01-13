
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg max-w-lg w-full">
        <AlertTriangle className="mx-auto text-yellow-500 mb-6" size={64} />
        <h1 className="text-4xl font-black text-slate-800 mb-2">404 - Page Not Found</h1>
        <p className="text-slate-600 mb-8 text-lg">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors duration-300 inline-block"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;


import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <span className="text-3xl text-green-600 font-bold">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Successful!</h2>
        <p className="text-gray-600 mb-8">
          Your package has been activated. You can now access your benefits through your dashboard.
        </p>
        <div className="space-y-3">
          <Link
            to="/dashboard"
            className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/home"
            className="block w-full bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors border border-gray-200"
          >
            Browse More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;

import React from 'react';

const Page404 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h2>
        <p className="text-gray-600 mb-8">Oops! The page you are looking for does not exist.</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Page404;

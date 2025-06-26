import React from 'react';

const AboutPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-blue-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">About Us</h1>
        <p className="text-lg text-blue-700">
          Welcome to the About page! This is where you can learn more about our project.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Feel free to explore other sections of the application.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
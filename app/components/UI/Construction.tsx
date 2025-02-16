import React from 'react';

export default function UnderConstruction(){
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">Under Construction</h1>
      <p className="text-lg md:text-xl mb-8 text-center">We are working hard to bring you something awesome. Stay tuned!</p>
      <div className="flex space-x-4">
        <a href="mailto:nwrose@umich.edu" className="text-blue-600 hover:text-blue-800 transition">Email</a>
      </div>
    </div>
  );
};
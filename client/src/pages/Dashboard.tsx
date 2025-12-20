import React from 'react';
import { useParams } from 'react-router-dom';

const Dashboard = () => {
  const { shortCode } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Analytics Dashboard</h1>
      <p className="text-gray-600">
        Viewing stats for short code: <span className="font-mono bg-yellow-100 px-2 py-1 rounded">{shortCode}</span>
      </p>
      
      <div className="mt-8 p-6 bg-white rounded-lg shadow border border-gray-200">
        <p className="text-gray-400 italic">Charts coming soon...</p>
      </div>
    </div>
  );
};

export default Dashboard;
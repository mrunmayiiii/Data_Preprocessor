// src/pages/Dashboard/DashboardHome.jsx
import React from 'react';
import { Database, FileText, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-light text-gray-900 mb-4">
        Dashboard Overview
      </h1>
      <p className="text-gray-600 mb-8">
        Manage your datasets efficiently — upload, preprocess, and view insights.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/dashboard/upload"
          className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-all"
        >
          <UploadCloud className="text-[#9FB3DF]" size={40} />
          <h3 className="mt-3 font-medium text-gray-800">Upload Dataset</h3>
          <p className="text-sm text-gray-500 text-center mt-1">
            Add new datasets to your collection
          </p>
        </Link>

        <Link
          to="/dashboard/preprocess"
          className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-all"
        >
          <FileText className="text-[#9FB3DF]" size={40} />
          <h3 className="mt-3 font-medium text-gray-800">View Datasets</h3>
          <p className="text-sm text-gray-500 text-center mt-1">
            Manage and preprocess your uploaded datasets
          </p>
        </Link>

        <Link
          to="/dashboard/processed"
          className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-all"
        >
          <Database className="text-[#9FB3DF]" size={40} />
          <h3 className="mt-3 font-medium text-gray-800">Processed Datasets</h3>
          <p className="text-sm text-gray-500 text-center mt-1">
            View already processed data results
          </p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHome;

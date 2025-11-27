
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { 
  File, 
  Trash2, 
  Calendar,
  FileText,
  Database,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

const UploadedDatasets = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchUploadedDatasets();
  }, []);

  // Fetch Uploaded Datasets
  const fetchUploadedDatasets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/dashboard/uploadedDataset', {
        headers: {
          'Authorization': token
        }
      });
      const data = await response.json();
      setDatasets(data.datasets || []);
    } catch (error) {
      console.error('Error fetching uploaded datasets:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = async (id, name, type) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:8000/api/dashboard/downloadog/${id}`,
      {
        headers: { Authorization: token },
        responseType: "blob", // important for binary data
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${name}.${type}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Download failed:", error);
    alert("Failed to download file.");
  }
};




  // Filters and Search
  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.datasetName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || dataset.fileType === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} style={{ color: '#9FB3DF' }} />
          <p className="text-gray-600">Loading uploaded datasets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">Uploaded Datasets</h1>
        <p className="text-gray-600">View and manage your uploaded datasets</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search datasets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All Types</option>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </select>
          </div>
          <button
            onClick={fetchUploadedDatasets}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={20} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Dataset Cards */}
      {filteredDatasets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <File size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-light text-gray-900 mb-2">No Uploaded Datasets Found</h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Upload a dataset to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map((dataset) => (
            <div key={dataset._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Top Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#E8EDF7' }}>
                    <FileText size={24} style={{ color: '#9FB3DF' }} />
                  </div>
                  <span
                    className="px-3 py-1 text-xs font-medium rounded-full"
                    style={{ backgroundColor: '#E8EDF7', color: '#9FB3DF' }}
                  >
                    {dataset.fileType.toUpperCase()}
                  </span>
                </div>

                {/* Dataset Info */}
                <h3 className="text-lg font-medium text-gray-900 mb-1 truncate" title={dataset.datasetName}>
                  Name: {dataset.datasetName}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">Description: {dataset.description}</p>

                {/* Preprocessing Steps */}
                <div className="text-sm text-gray-600 mb-4">
                  <strong>Preprocessing Steps:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {dataset.preprocessingSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>

                {/* Footer Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Calendar size={16} />
                  <span>{formatDate(dataset.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
               <button
                onClick={() => handleDownload(dataset._id, dataset.datasetName, dataset.fileType)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: '#9FB3DF' }}
              >
                <FileText size={16} />
                <span>Download</span>
              </button>
                 
                
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Count */}
      {filteredDatasets.length > 0 && (
        <div className="mt-6 text-center text-gray-600">
          <p>Showing {filteredDatasets.length} of {datasets.length} uploaded datasets</p>
        </div>
      )}
    </div>
  );
};

export default UploadedDatasets;

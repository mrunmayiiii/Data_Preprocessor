import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Download, 
  Trash2, 
  Calendar,
  FileText,
  Database,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

const PreprocessedDatasets = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchPreprocessedDatasets();
  }, []);

  const fetchPreprocessedDatasets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/preprocessed-datasets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setDatasets(data.datasets || []);
    } catch (error) {
      console.error('Error fetching preprocessed datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (datasetId, filename) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/preprocessed-datasets/${datasetId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading dataset:', error);
    }
  };

  const handleDelete = async (datasetId) => {
    if (!window.confirm('Are you sure you want to delete this preprocessed dataset?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/preprocessed-datasets/${datasetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchPreprocessedDatasets();
    } catch (error) {
      console.error('Error deleting dataset:', error);
    }
  };

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || dataset.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} style={{ color: '#9FB3DF' }} />
          <p className="text-gray-600">Loading preprocessed datasets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">Preprocessed Datasets</h1>
        <p className="text-gray-600">View and manage your preprocessed datasets</p>
      </div>

      {/* Search and Filter Bar */}
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
              <option value="json">JSON</option>
              <option value="excel">Excel</option>
            </select>
          </div>
          <button
            onClick={fetchPreprocessedDatasets}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={20} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Datasets Grid */}
      {filteredDatasets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileCheck size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-light text-gray-900 mb-2">No Preprocessed Datasets Found</h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start by uploading and preprocessing datasets'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map((dataset) => (
            <div
              key={dataset.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#E8EDF7' }}>
                    <FileCheck size={24} style={{ color: '#9FB3DF' }} />
                  </div>
                  <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#E8EDF7', color: '#9FB3DF' }}>
                    {dataset.type?.toUpperCase() || 'CSV'}
                  </span>
                </div>

                {/* Dataset Name */}
                <h3 className="text-lg font-medium text-gray-900 mb-2 truncate" title={dataset.name}>
                  {dataset.name}
                </h3>

                {/* Details */}
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Database size={16} />
                    <span>{dataset.rows?.toLocaleString() || 0} rows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span>{formatFileSize(dataset.size || 0)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{formatDate(dataset.processedDate || new Date())}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleDownload(dataset.id, dataset.name)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
                    style={{ backgroundColor: '#9FB3DF' }}
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => handleDelete(dataset.id)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {filteredDatasets.length > 0 && (
        <div className="mt-6 text-center text-gray-600">
          <p>Showing {filteredDatasets.length} of {datasets.length} preprocessed datasets</p>
        </div>
      )}
    </div>
  );
};

export default PreprocessedDatasets;
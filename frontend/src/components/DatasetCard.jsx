import React from 'react';
import { 
  Eye, 
  Calendar,
  FileText,
  Download
} from 'lucide-react';

const DatasetCard = ({ dataset, onView, onDownload }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return '#22c55e';
      case 'Processing':
        return '#f97316';
      case 'Pending':
        return '#eab308';
      case 'Error':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const handleView = () => {
    if (onView) {
      onView(dataset);
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(dataset);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-2 leading-tight">
            {dataset.name}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {dataset.description}
          </p>
        </div>
        <div 
          className="px-3 py-1 rounded-full text-xs font-medium text-white ml-4 flex-shrink-0"
          style={{ backgroundColor: getStatusColor(dataset.status) }}
        >
          {dataset.status}
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(189, 221, 228, 0.3)' }}>
          <p className="text-xs text-gray-500 mb-1 font-medium">Records</p>
          <p className="text-sm font-semibold text-gray-900">{dataset.records}</p>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(158, 198, 243, 0.3)' }}>
          <p className="text-xs text-gray-500 mb-1 font-medium">File Size</p>
          <p className="text-sm font-semibold text-gray-900">{dataset.size}</p>
        </div>
      </div>
      
      {/* Metadata Section */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3" />
          <span>{dataset.uploadDate}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FileText className="h-3 w-3" />
          <span>{dataset.format}</span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button 
          onClick={handleView}
          className="flex-1 px-4 py-2 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2"
          style={{ backgroundColor: '#9FB3DF' }}
        >
          <Eye className="h-4 w-4" />
          <span>View</span>
        </button>
        <button 
          onClick={handleDownload}
          className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default DatasetCard;
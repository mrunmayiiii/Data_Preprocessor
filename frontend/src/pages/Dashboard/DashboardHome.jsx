import React, { useEffect, useState } from 'react';
import { 
  Download, 
  Eye, 
  Calendar,
  FileText,
  Loader2,
  AlertCircle,
  Database,
  FolderOpen
} from 'lucide-react';

const DashboardHome = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('name');
    if (user) {
      setLoggedInUser(user);
    }

    // Fetch datasets from backend
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    // Simulate API call with sample data
    setTimeout(() => {
      const sampleData = [
        {
          _id: "1",
          datasetName: "Customer Analytics Data",
          description: "Comprehensive customer behavior and purchase history dataset for Q4 2024",
          fileType: "csv",
          preprocessingSteps: ["Remove duplicates", "Handle missing values", "Normalize data"],
          createdAt: "2024-12-15T10:30:00Z",
          file: "uploads/customer_analytics.csv"
        },
        {
          _id: "2",
          datasetName: "Sales Performance Data",
          description: "Monthly sales data across all regions and product categories",
          fileType: "excel",
          preprocessingSteps: ["Outlier detection", "Feature scaling"],
          createdAt: "2024-12-14T14:20:00Z",
          file: "uploads/sales_performance.xlsx"
        },
        {
          _id: "3",
          datasetName: "Product Inventory",
          description: "Real-time inventory tracking with stock levels and reorder points",
          fileType: "csv",
          preprocessingSteps: ["Data validation", "Type conversion", "Remove duplicates"],
          createdAt: "2024-12-13T09:15:00Z",
          file: "uploads/product_inventory.csv"
        }
      ];
      
      setDatasets(sampleData);
      setLoading(false);
    }, 1000);

    // Uncomment for real API call:
    /*
    try {
      const res = await axios.get("/api/dashboard/datasets");
      setDatasets(res.data.datasets);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch datasets");
      setLoading(false);
      console.error(error);
    }
    */
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleViewDataset = (dataset) => {
    console.log('Viewing dataset:', dataset);
    alert(`Viewing: ${dataset.datasetName}`);
    // Navigate to dataset detail page or open modal
  };

  const handleDownloadDataset = (dataset) => {
    console.log('Downloading dataset:', dataset);
    alert(`Downloading: ${dataset.datasetName}`);
    // Uncomment for real download:
    // window.open(`/api/dashboard/download?id=${dataset._id}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} style={{ color: '#9FB3DF' }} />
          <p className="text-gray-600 font-light">Loading datasets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center space-x-3">
          <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
          <p className="text-red-700 font-light">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">
          {loggedInUser ? `${loggedInUser}'s Datasets` : 'My Datasets'}
        </h1>
        <p className="text-gray-600 font-light">Manage and analyze your data collections</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Datasets</p>
            <Database size={20} style={{ color: '#9FB3DF' }} />
          </div>
          <p className="text-3xl font-light text-gray-900">{datasets.length}</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">CSV Files</p>
            <FileText size={20} style={{ color: '#9FB3DF' }} />
          </div>
          <p className="text-3xl font-light text-gray-900">
            {datasets.filter(d => d.fileType === 'csv').length}
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Excel Files</p>
            <FileText size={20} style={{ color: '#9FB3DF' }} />
          </div>
          <p className="text-3xl font-light text-gray-900">
            {datasets.filter(d => d.fileType === 'excel').length}
          </p>
        </div>
      </div>

      {/* Dataset Cards Grid */}
      {datasets.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <FolderOpen size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-light text-gray-900 mb-2">No Datasets Yet</h3>
          <p className="text-gray-600 font-light mb-4">
            Upload your first dataset to get started with data analysis.
          </p>
          <button
            onClick={() => window.location.href = '/dashboard/upload'}
            className="px-6 py-2 rounded-lg font-medium text-white transition-all"
            style={{ backgroundColor: '#9FB3DF' }}
          >
            Upload Dataset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <div 
              key={dataset._id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#9FB3DF' }}>
                      <FileText className="text-white" size={20} />
                    </div>
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: '#9FB3DF' }}
                    >
                      {dataset.fileType.toUpperCase()}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {dataset.datasetName}
                </h3>
                <p className="text-sm text-gray-600 font-light line-clamp-2">
                  {dataset.description}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Date */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Calendar size={16} className="mr-2 flex-shrink-0" />
                  <span className="font-light">Uploaded {formatDate(dataset.createdAt)}</span>
                </div>

                {/* Preprocessing Steps */}
                {dataset.preprocessingSteps && dataset.preprocessingSteps.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-600 mb-2">Preprocessing:</p>
                    <div className="flex flex-wrap gap-1">
                      {dataset.preprocessingSteps.slice(0, 2).map((step, index) => (
                        <span 
                          key={index}
                          className="inline-block px-2 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-200 font-light"
                        >
                          {step}
                        </span>
                      ))}
                      {dataset.preprocessingSteps.length > 2 && (
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-light">
                          +{dataset.preprocessingSteps.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDataset(dataset)}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    <Eye size={16} />
                    <span className="text-sm">View</span>
                  </button>
                  <button
                    onClick={() => handleDownloadDataset(dataset)}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium text-white transition-all"
                    style={{ backgroundColor: '#9FB3DF' }}
                  >
                    <Download size={16} />
                    <span className="text-sm">Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default DashboardHome;
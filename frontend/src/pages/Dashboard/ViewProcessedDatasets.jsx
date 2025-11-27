import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Download,
  FileCheck,
  Calendar,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileType,
  Settings,
} from "lucide-react";

const ViewProcessedDatasets = () => {
  const [processed, setProcessed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch processed datasets from backend
  useEffect(() => {
    const fetchProcessedDatasets = async () => {
      try {
        const token = localStorage.getItem("token"); // or jwtoken (depending on your login)
        const res = await axios.get("http://localhost:8000/api/dashboard/postprocessed", {
          headers: {
          'Authorization': token
        }
        });

        if (res.data?.processedDatasets) {
          setProcessed(res.data.processedDatasets);
        } else {
          setProcessed([]);
        }
      } catch (err) {
        console.error("Failed to fetch processed datasets:", err);
        setError("Failed to fetch processed datasets");
      } finally {
        setLoading(false);
      }
    };

    fetchProcessedDatasets();
  }, []);

  // ✅ Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getFileIcon = (format) => {
    return <FileType size={20} />;
  };

  // ✅ Download dataset from backend
  const handleDownload = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:8000/api/dashboard/${id}/download`, {
      headers: { Authorization: token },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `dataset_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Download failed:", err);
  }
};


  // ✅ Loading screen
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FFF1D5" }}
      >
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} style={{ color: "#9FB3DF" }} />
          <p className="text-gray-600 font-light">Loading processed datasets...</p>
        </div>
      </div>
    );
  }

  // ✅ Error screen
  if (error) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: "#FFF1D5" }}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center space-x-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
            <p className="text-red-700 font-light">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Main Page
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#FFF1D5" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Processed Datasets</h1>
          <p className="text-gray-600 font-light">
            View and download your cleaned and processed datasets
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Total Processed</p>
              <FileCheck size={20} style={{ color: "#9FB3DF" }} />
            </div>
            <p className="text-3xl font-light text-gray-900">{processed.length}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Formats</p>
              <Settings size={20} style={{ color: "#9FB3DF" }} />
            </div>
            <p className="text-3xl font-light text-gray-900">
              {[...new Set(processed.map((p) => p.finalFormat))].length}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <Calendar size={20} style={{ color: "#9FB3DF" }} />
            </div>
            <p className="text-3xl font-light text-gray-900">
              {processed.length > 0 ? formatDate(processed[0].createdAt) : "—"}
            </p>
          </div>
        </div>

        {/* Dataset Grid */}
        {processed.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <FileCheck size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-light text-gray-900 mb-2">No Processed Datasets</h3>
            <p className="text-gray-600 font-light">
              Your processed datasets will appear here once preprocessing is complete.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {processed.map((dataset) => (
              <div
                key={dataset._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div
                  className="p-6 border-b border-gray-100"
                  style={{ backgroundColor: "#F9FAFB" }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: "#9FB3DF" }}>
                        {getFileIcon(dataset.finalFormat)}
                      </div>
                      <div>
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: "#9FB3DF" }}
                        >
                          {dataset.finalFormat?.toUpperCase() || "CSV"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {dataset.datasetId?.datasetName || "Processed Dataset"}
                  </h3>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Date */}
                  {dataset.createdAt && (
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Calendar size={16} className="mr-2 flex-shrink-0" />
                      <span className="font-light">Processed on {formatDate(dataset.createdAt)}</span>
                    </div>
                  )}

                  {/* Steps */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Processing Steps:</p>
                    <div className="flex flex-wrap gap-2">
                      {dataset.preprocessingSteps?.map((step, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-200"
                        >
                          <CheckCircle2 size={12} className="mr-1" />
                          {step}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Download */}
                  <button
                    onClick={() => handleDownload(dataset._id)}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg font-medium text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: "#9FB3DF" }}
                  >
                    <Download size={18} />
                    <span>Download Dataset</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProcessedDatasets;

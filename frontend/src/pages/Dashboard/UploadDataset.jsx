import React, { useState } from 'react';
import axios from 'axios';
import { 
  Upload, 
  File, 
  FileText, 
  X,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2
} from 'lucide-react';

const UploadDataset = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [datasetName, setDatasetName] = useState("");
  const [preprocessingSteps, setPreprocessingSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase();
      if (['csv', 'xlsx', 'xls'].includes(fileType)) {
        setFile(selectedFile);
      } else {
        alert('Please select a valid file (.csv, .xlsx, .xls)');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const addPreprocessingStep = () => {
    if (currentStep.trim()) {
      setPreprocessingSteps([...preprocessingSteps, currentStep.trim()]);
      setCurrentStep("");
    }
  };

  const removePreprocessingStep = (index) => {
    setPreprocessingSteps(preprocessingSteps.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }
    if (!datasetName.trim()) {
      alert('Please enter a dataset name.');
      return;
    }
    if (!description.trim()) {
      alert('Please enter a description.');
      return;
    }
    if (preprocessingSteps.length === 0) {
      alert('Please add at least one preprocessing step.');
      return;
    }

    setUploading(true);
    
    // Get file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileType = ['xlsx', 'xls'].includes(fileExtension) ? 'excel' : 'csv';
    
    // Prepare data to send to backend
    const uploadData = {
      file: file,
      datasetName: datasetName,
      description: description,
      preprocessingSteps: preprocessingSteps,
      fileType: fileType
    };

    const token = localStorage.getItem('token');
    // Uncomment for real API call:
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    formData.append("datasetName", datasetName);
    formData.append("preprocessingSteps", JSON.stringify(preprocessingSteps));
    formData.append("fileType", fileType);

    try {
      const res = await axios.post("http://localhost:8000/api/dashboard/upload", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
    "Authorization": token, // ✅ inside headers
  },
});
      setUploading(false);
      alert("Dataset uploaded successfully!");
      console.log(res.data);
      // Reset form
      setFile(null);
      setDatasetName('');
      setDescription('');
      setPreprocessingSteps([]);
    } catch (error) {
      setUploading(false);
      alert("Upload failed");
      console.error(error);
    }
    
  };

  const removeFile = () => {
    setFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Common preprocessing step suggestions
  const suggestedSteps = [
    "Remove duplicates",
    "Handle missing values",
    "Normalize data",
    "Remove outliers",
    "Feature scaling",
    "Data validation",
    "Type conversion"
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#FFF1D5' }}>
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Upload New Dataset</h1>
          <p className="text-gray-600 font-light">Add a new dataset to your collection</p>
        </div>

        {/* Upload Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Dataset Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dataset Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Customer Analytics Data"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all font-light"
              style={{ focusRingColor: '#9FB3DF' }}
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
            />
          </div>

          {/* Description Textarea */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              placeholder="Describe your dataset and its contents..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all font-light resize-none"
              style={{ focusRingColor: '#9FB3DF' }}
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Preprocessing Steps */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preprocessing Steps *
            </label>
            
            {/* Add Step Input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Enter a preprocessing step..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all font-light"
                style={{ focusRingColor: '#9FB3DF' }}
                value={currentStep}
                onChange={(e) => setCurrentStep(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPreprocessingStep()}
              />
              <button
                onClick={addPreprocessingStep}
                className="px-4 py-2 rounded-lg font-medium text-white transition-all flex items-center space-x-2"
                style={{ backgroundColor: '#9FB3DF' }}
              >
                <Plus size={18} />
                <span>Add</span>
              </button>
            </div>

            {/* Suggested Steps */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2 font-light">Quick add:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedSteps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!preprocessingSteps.includes(step)) {
                        setPreprocessingSteps([...preprocessingSteps, step]);
                      }
                    }}
                    className="px-3 py-1 text-xs rounded-full border border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all font-light"
                  >
                    + {step}
                  </button>
                ))}
              </div>
            </div>

            {/* Added Steps List */}
            {preprocessingSteps.length > 0 && (
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                {preprocessingSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <span className="text-gray-700 font-light">{step}</span>
                    </div>
                    <button
                      onClick={() => removePreprocessingStep(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File *
            </label>
            
            {!file ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                  isDragging 
                    ? 'border-opacity-100 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                style={isDragging ? { borderColor: '#9FB3DF' } : {}}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <Upload 
                  className="mx-auto mb-4 text-gray-400" 
                  size={48}
                  style={isDragging ? { color: '#9FB3DF' } : {}}
                />
                <p className="text-gray-600 font-light mb-2">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-sm text-gray-400 font-light">
                  Supports: CSV, XLSX, XLS
                </p>
                <input
                  id="fileInput"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#9FB3DF' }}>
                      <FileText className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500 font-light">
                        {formatFileSize(file.size)} • {file.name.split('.').pop().toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Info Alert */}
          <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-100 flex items-start space-x-3">
            <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-blue-700 font-light">
              Make sure your dataset is clean and properly formatted before uploading. 
              Supported formats include CSV and Excel (.xlsx, .xls) files.
            </p>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading || !file || !datasetName || !description || preprocessingSteps.length === 0}
            className="w-full py-3 px-6 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            style={{ 
              backgroundColor: uploading || !file || !datasetName || !description || preprocessingSteps.length === 0 ? '#D1D5DB' : '#9FB3DF' 
            }}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span>Upload Dataset</span>
              </>
            )}
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-2">Need help?</h3>
          <p className="text-sm text-gray-600 font-light">
            For best results, ensure your CSV or Excel files have clear headers and consistent data types. 
            Add preprocessing steps that will be applied to your dataset after upload.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadDataset;
// const PreDataset = require("../models/PreDataset");
// const PostDataset = require("../models/PostDataset");
// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");

// // ------------------ 1. Upload Dataset ------------------


// exports.uploaddoc = async (req, res) => {
//   try {
//     console.log("File received:", req.file);
//     console.log("Body received:", req.body);

//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Destructure from request body
//     const { datasetName, description, preprocessingSteps, fileType } = req.body;

//     // Validate required fields
//     if (!datasetName || !description || !fileType || !req.user?._id) {
//       return res.status(400).json({
//         message: "Missing required fields (datasetName, description, fileType, userId)",
//       });
//     }

//     // Parse preprocessingSteps (it might be sent as a stringified array)
//     let steps = preprocessingSteps;
//     if (typeof steps === "string") {
//       try {
//         steps = JSON.parse(steps);
//       } catch (err) {
//         steps = [steps]; // fallback to single-step array
//       }
//     }

//     // ✅ Create and save the document
//     const newDataset = new PreDataset({
//       userId: req.user._id, // from JWT middleware
//       description,
//       datasetName,
//       preprocessingSteps: steps,
//       file: req.file.filename, // store just the filename (not full path)
//       fileType,
//     });

//     await newDataset.save();

//     res.status(201).json({
//       message: "Dataset uploaded successfully",
//       dataset: newDataset,
//     });
//   } catch (error) {
//     console.error("Upload Error:", error);
//     res.status(500).json({
//       message: "Failed to upload dataset",
//       error: error.message,
//     });
//   }
// };



// // ------------------ 2. Get All Uploaded Datasets ------------------
// exports.uploadedDataset = async (req, res) => {
//     try {
//         const datasets = await PreDataset.find({ userId: req.user._id }).sort({ createdAt: -1 });
//         res.status(200).json({ datasets });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Failed to fetch uploaded datasets" });
//     }
// };

// // ------------------ 3. Send Data to Flask for Preprocessing ------------------
// exports.preprocessing = async (req, res) => {
//     try {
//         const { datasetId, steps, finalFormat } = req.body;
//         if (!datasetId || !steps || !finalFormat) {
//             return res.status(400).json({ message: "datasetId, steps, and finalFormat are required" });
//         }

//         const dataset = await PreDataset.findById(datasetId);
//         if (!dataset) return res.status(404).json({ message: "Dataset not found" });

//         // send file + steps to Flask backend
//         const flaskURL = "http://127.0.0.1:5000/preprocess"; // adjust if needed

//         const response = await axios.post(flaskURL, {
//             filePath: path.resolve(dataset.file),
//             steps,
//             finalFormat
//         });

//         const { processedFilePath } = response.data; // Flask returns processed file path

//         // Save processed dataset info to DB
//         const newProcessed = new PostDataset({
//             userId: req.user._id,
//             datasetId: dataset._id,
//             preprocessingSteps: steps,
//             finalFormat,
//             finalFile: processedFilePath,
//             beforeDatasetId: dataset._id,
//         });

//         await newProcessed.save();

//         res.status(201).json({
//             message: "Preprocessing complete and stored successfully",
//             processed: newProcessed
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Preprocessing failed", error: error.message });
//     }
// };

// // ------------------ 4. Get All Processed Datasets ------------------
// exports.postProcessedDataset = async (req, res) => {
//     try {
//         const processedDatasets = await PostDataset.find({ userId: req.user._id })
//             .populate("datasetId", "datasetName file fileType")
//             .sort({ createdAt: -1 });

//         res.status(200).json({ processedDatasets });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Failed to fetch processed datasets" });
//     }
// };

// // ------------------ UNIVERSAL DOWNLOAD HANDLER ------------------
// exports.downloadAnyDataset = async (req, res) => {
//   try {
//     const { datasetId } = req.params;

//     if (!datasetId) {
//       return res.status(400).json({ message: "Dataset ID is required" });
//     }

//     // Try to find in PostDataset first (processed)
//     let dataset = await PostDataset.findById(datasetId);
//     let filePath, filename, fileType;

//     if (dataset) {
//       filePath = path.resolve(dataset.finalFile);
//       filename = `processed_${dataset._id}.${dataset.finalFormat}`;
//       fileType = dataset.finalFormat;
//     } else {
//       // If not found, check in PreDataset (uploaded/raw)
//       dataset = await PreDataset.findById(datasetId);
//       if (!dataset) {
//         return res.status(404).json({ message: "Dataset not found" });
//       }
//       filePath = path.resolve(dataset.file);
//       filename = `uploaded_${dataset._id}.${dataset.fileType}`;
//       fileType = dataset.fileType;
//     }

//     // Check if file exists
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ message: "File not found on server" });
//     }

//     // Stream file to client
//     res.download(filePath, filename);
//   } catch (error) {
//     console.error("Download failed:", error);
//     res.status(500).json({ message: "File download failed" });
//   }
// };



const PreDataset = require("../models/PreDataset");
const PostDataset = require("../models/PostDataset");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

// ------------------ 1. Upload + Send to Flask for Preprocessing ------------------
exports.uploaddoc = async (req, res) => {
  try {
    console.log("File received:", req.file);
    console.log("Body received:", req.body);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { datasetName, description, preprocessingSteps, fileType, finalFormat } = req.body;

    // Validate required fields
    if (!datasetName || !description || !fileType || !req.user?._id) {
      return res.status(400).json({
        message: "Missing required fields (datasetName, description, fileType, userId)",
      });
    }

    // Parse preprocessing steps safely
    let steps = preprocessingSteps;
    if (typeof steps === "string") {
      try {
        steps = JSON.parse(steps);
      } catch (err) {
        steps = [steps];
      }
    }

    // 1️⃣ Save uploaded dataset info
    const newDataset = new PreDataset({
      userId: req.user._id,
      datasetName,
      description,
      preprocessingSteps: steps,
      file: req.file.filename,
      fileType,
    });

    await newDataset.save();

    console.log("Dataset metadata saved. Sending file to Flask...");

    // 2️⃣ Send uploaded file to Flask backend
    const flaskURL = "http://127.0.0.1:5000/preprocess";
    const formData = new FormData();
    const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
    formData.append("file", fs.createReadStream(filePath));
    formData.append("steps", JSON.stringify(steps));
    formData.append("finalFormat", finalFormat || fileType);

    // Send file to Flask API
    const response = await axios.post(flaskURL, formData, {
      headers: formData.getHeaders(),
    });

    console.log("Flask Response:", response.data);

    // Extract processed file path from Flask
    //const processedFilePath = response.data.processed_file_path || null;
    const processedFilePath = path.join(__dirname, "..", response.data.processed_file_path);

    // 3️⃣ Save processed dataset info
    const newProcessed = new PostDataset({
      userId: req.user._id,
      datasetId: newDataset._id,
      preprocessingSteps: steps,
      finalFormat: finalFormat || fileType,
      finalFile: processedFilePath,
      beforeDatasetId: newDataset._id,
    });

    await newProcessed.save();

    res.status(201).json({
      message: "Upload and preprocessing completed successfully.",
      uploadedDataset: newDataset,
      processedDataset: newProcessed,
      flaskResponse: response.data,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      message: "Failed to upload or preprocess dataset",
      error: error.message,
    });
  }
};

// ------------------ 2. Get All Uploaded Datasets ------------------
exports.uploadedDataset = async (req, res) => {
  try {
    const datasets = await PreDataset.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ datasets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch uploaded datasets" });
  }
};

// ------------------ 3. Get All Processed Datasets ------------------
exports.postProcessedDataset = async (req, res) => {
  try {
    const processedDatasets = await PostDataset.find({ userId: req.user._id })
      .populate("datasetId", "datasetName file fileType")
      .sort({ createdAt: -1 });

    res.status(200).json({ processedDatasets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch processed datasets" });
  }
};

// ------------------ 4. Universal Download Handler ------------------
exports.downloadAnyDataset = async (req, res) => {
  try {
    const { datasetId } = req.params;

    if (!datasetId) {
      return res.status(400).json({ message: "Dataset ID is required" });
    }

    let dataset = await PostDataset.findById(datasetId);
    let filePath, filename, fileType;

    if (dataset) {
      // ✅ Handle processed dataset
      filePath = path.isAbsolute(dataset.finalFile)
        ? dataset.finalFile
        : path.join(__dirname, "..", dataset.finalFile);

      filename = `processed_${dataset._id}.${dataset.finalFormat}`;
      fileType = dataset.finalFormat;

    } else {
      // ✅ Handle uploaded (preprocessed) dataset
      dataset = await PreDataset.findById(datasetId);
      if (!dataset) {
        return res.status(404).json({ message: "Dataset not found" });
      }

      filePath = path.join(__dirname, "..", "uploads", dataset.file);
      filename = `uploaded_${dataset._id}.${dataset.fileType}`;
      fileType = dataset.fileType;
    }

    console.log("📁 Downloading file:", filePath);

    if (!fs.existsSync(filePath)) {
      console.error("❌ File not found:", filePath);
      return res.status(404).json({ message: "File not found on server" });
    }

    // ✅ Trigger file download
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Download error:", err);
        return res.status(500).json({ message: "File download failed" });
      }
    });

  } catch (error) {
    console.error("Download failed:", error);
    res.status(500).json({ message: "File download failed", error: error.message });
  }
};

exports.downloadOriginalDataset = async (req, res) => {
  try {
    const datasetId = req.params.id;
    const dataset = await PreDataset.findById(datasetId);

    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }

    const filePath = path.resolve(__dirname, "..", "uploads", dataset.file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(filePath, dataset.file); // sends file for download
  } catch (error) {
    console.error("Download Error:", error);
    res.status(500).json({ message: "Failed to download file" });
  }
};
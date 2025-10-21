const PreDataset = require("../models/PreDataset");
const PostDataset = require("../models/PostDataset");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// ------------------ 1. Upload Dataset ------------------
exports.uploaddoc = async (req, res) => {
    try {
        const upload = require("../middlewares/multerConfig").single("file");

        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const { description, datasetName } = req.body;
            if (!description || !datasetName) {
                return res.status(400).json({ message: "Description and dataset name are required" });
            }

            const fileExt = path.extname(req.file.originalname).toLowerCase();
            let fileType;
            if (fileExt === ".csv") fileType = "csv";
            else if (fileExt === ".xls" || fileExt === ".xlsx") fileType = "excel";
            else if (fileExt === ".json") fileType = "json";
            else return res.status(400).json({ message: "Unsupported file type" });

            const newDataset = new PreDataset({
                userId: req.user._id,
                description,
                datasetName,
                file: req.file.path,
                fileType,
            });

            await newDataset.save();
            res.status(201).json({ message: "File uploaded successfully", dataset: newDataset });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
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

// ------------------ 3. Send Data to Flask for Preprocessing ------------------
exports.preprocessing = async (req, res) => {
    try {
        const { datasetId, steps, finalFormat } = req.body;
        if (!datasetId || !steps || !finalFormat) {
            return res.status(400).json({ message: "datasetId, steps, and finalFormat are required" });
        }

        const dataset = await PreDataset.findById(datasetId);
        if (!dataset) return res.status(404).json({ message: "Dataset not found" });

        // send file + steps to Flask backend
        const flaskURL = "http://127.0.0.1:5000/preprocess"; // adjust if needed

        const response = await axios.post(flaskURL, {
            filePath: path.resolve(dataset.file),
            steps,
            finalFormat
        });

        const { processedFilePath } = response.data; // Flask returns processed file path

        // Save processed dataset info to DB
        const newProcessed = new PostDataset({
            userId: req.user._id,
            datasetId: dataset._id,
            preprocessingSteps: steps,
            finalFormat,
            finalFile: processedFilePath,
            beforeDatasetId: dataset._id,
        });

        await newProcessed.save();

        res.status(201).json({
            message: "Preprocessing complete and stored successfully",
            processed: newProcessed
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Preprocessing failed", error: error.message });
    }
};

// ------------------ 4. Get All Processed Datasets ------------------
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

// ------------------ 5. Download File ------------------
exports.downloadfile = async (req, res) => {
    try {
        const { postDatasetId } = req.body;
        if (!postDatasetId) {
            return res.status(400).json({ message: "postDatasetId is required" });
        }

        const dataset = await PostDataset.findById(postDatasetId);
        if (!dataset) return res.status(404).json({ message: "Processed dataset not found" });

        const filePath = path.resolve(dataset.finalFile);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found on server" });
        }

        res.download(filePath, `processed_${dataset._id}.${dataset.finalFormat}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "File download failed" });
    }
};

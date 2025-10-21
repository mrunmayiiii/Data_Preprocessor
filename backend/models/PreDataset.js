const mongoose = require("mongoose");

const PreDatasetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // linked to User
        },
        description: {
            type: String,
            required: true,
        },
        datasetName: {
            type: String,
            required: true, // human-readable dataset id/name
        },
        preprocessingSteps: [
            {
                type: String,
                required: true
            }
        ],
        file: {
            type: String,
            required: true, // store file path or URL (CSV/Excel)
        },
        fileType: {
            type: String,
            enum: ["csv", "excel"],
            required: true, // restrict to csv/excel
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("PreDataset", PreDatasetSchema);
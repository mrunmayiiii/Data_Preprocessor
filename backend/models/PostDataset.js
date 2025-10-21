const mongoose=require("mongoose")

const PostDataset = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }, // linked to User

        datasetId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BeforePreprocessing",
            required: true
        }, // original dataset reference

        preprocessingSteps: [
            {
                type: String,
                required: true
            }
        ], // steps used in preprocessing (array for multiple steps)

        finalFormat: {
            type: String,
            enum: ["csv", "excel", "json"],
            required: true
        }, // user-specified output format

        finalFile: {
            type: String,
            required: true
        }, // store path/URL for processed file

        beforeDatasetId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BeforePreprocessing",
            required: true
        } // extra explicit relation
    },
    { timestamps: true }
);
module.exports = mongoose.model("PostDataset", PostDataset);


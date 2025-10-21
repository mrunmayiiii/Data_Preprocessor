const { ensureAuthenticated } = require("../middlewares/authMiddleware");
const { uploaddoc,uploadedDataset,preprocessing,postProcessedDataset,downloadfile} =require("../controllers/preprocessedDataset")
const upload = require("../middlewares/multerConfig");
const router=require("express").Router();
const multer = require("multer");
const path = require("path");

router.get('/',ensureAuthenticated,(req,res)=>{
    console.log(req.user);
    ///////info abt user
    //console.log(req.user.name);
    res.status(200).json({
        message:"Dashboard route is working",
    })
});

router.post("/upload",ensureAuthenticated,uploaddoc);
router.get("/uploadedDataset",ensureAuthenticated,uploadedDataset);
router.post("/preprocessdata",ensureAuthenticated,preprocessing);
router.get("/postprocessed",ensureAuthenticated,postProcessedDataset);
router.post("/download",ensureAuthenticated,downloadfile);





router.post("/upload-file", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ fileUrl });
});
module.exports=router;
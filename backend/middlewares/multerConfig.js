const multer = require("multer");

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/json",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv"
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .json, .csv, .xls, and .xlsx formats are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes
const authRoutes = require("./routes/authRoutes");
const DashRouter = require("./routes/DashRouter");
const connectDB = require("./config/db");
connectDB();


app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// near other app.use calls in server.js

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/",(req,res)=>{
    res.send("API is running...");
});

//routes


app.use("/api/auth",authRoutes);
app.use('/api/dashboard',DashRouter);
const PORT =process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));



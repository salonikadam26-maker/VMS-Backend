require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");
const visitorRoutes = require("./routes/visitorRoutes");


const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Student Management API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/students", authMiddleware, studentRoutes);
app.use("/api/visitors",  visitorRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

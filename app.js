const express = require("express");
const pool = require("./Config/DBconfig");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookiParser = require("-parser");
const port = process.env.PORT || 80;
const userRoute = require("./api/routes/user");
const relationships = require("./api/routes/relationship");
const postRoute = require("./api/routes/post");
const commentsRoute = require("./api/routes/comments");
const likeRoute = require("./api/routes/likes");
const authRoute = require("./api/routes/auth");
const messagesRoute = require("./api/routes/message");
const multer = require("multer");
const sanitize = require("sanitize");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookiParser());
app.use(express.json());

app.use(sanitize.middleware);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/", commentsRoute);
app.use("/api/likes", likeRoute);
app.use("/api/users", userRoute);
app.use("/api/relationships", relationships);
app.use("/api/messages", messagesRoute);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../HabeshaChat-FrontEnd/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.use("/uploads", express.static("../HabeshaChat-FrontEnd/public/upload")); // This line tells Express to serve files from the "/uploads" URL path and map them to the actual upload .

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`server running on port ${port}`);
});

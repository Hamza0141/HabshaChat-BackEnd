const express = require("express")
const pool = require("./Config/DBconfig")
const app = express()
require("dotenv").config();
const cors = require("cors");
const cookiParser = require("cookie-parser");
const port = process.env.PORT||80;
const userRoute = require("./api/routes/user")
const relationships = require("./api/routes/relationship");
const postRoute = require("./api/routes/post");
const commentsRoute = require("./api/routes/comments");
const likeRoute = require("./api/routes/likes");
const authRoute = require("./api/routes/auth");
const messagesRoute = require("./api/routes/message")
const multer = require("multer");
const sanitize = require("sanitize");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

const corsOptions = {
  origin: "https://hbesha-chat.pages.dev", // Remove the trailing slash
  optionsSuccessStatus: 200,
  credentials: true, // Allow credentials (cookies) to be sent with the request
};

app.use(cors(corsOptions));
app.use(cookiParser());
app.use(express.json())

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
    cb(null, "https://hbesha-chat.pages.dev/build/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.use(
  "/uploads",
  express.static("https://hbesha-chat.pages.dev/build/upload")
); // This line tells Express to serve files from the "/uploads" URL path and map them to the actual upload .

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file
  res.status(200).json(file.filename)
});





app.listen(port,"0.0.0.0",()=>{
    console.log(`server running on port ${port}`);
});
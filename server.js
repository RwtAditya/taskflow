const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

const userRouter = require("./routes/userRouter");
const taskRouter = require("./routes/taskRouter");
const {verifyToken} = require("./middleware/authMiddleware");

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
})

//routes for auth and tasks
app.use("/api/auth", userRouter);
app.use("/api/tasks", verifyToken, taskRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
    if(error) {
        throw error;
    }
    console.log(`Server is running at port ${PORT}`);
})
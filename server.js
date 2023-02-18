const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const EmployeeRoute = require("./routes/Emproutes");
const { authenticate, logout } = require("./controllers/EmpController");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://127.0.0.1:27017/testdb");
const db = mongoose.connection;
db.on("error", (err) => {
    console.log(err);
});
db.once("open", () => {
    console.log("Database Connection Established!");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("./public"));
app.use(morgan("dev"));
app.use(cookieParser("secret"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const root = "./views";
app.get("/login", (req, res, next) => {
    res.render("login");
});
app.get("/register", (req, res, next) => {
    res.render("registration");
});
app.get("/login", authenticate, (req, res, next) => {
    const { user } = req.body;
    res.render("login", { user });
    //res.render("login");
});
//app.get("/logout", authenticate, logout);

app.use("/api/employee", EmployeeRoute);

app.listen(PORT, () => {
    console.log("Server is running on port 3000");
});

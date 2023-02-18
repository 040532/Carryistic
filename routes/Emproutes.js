const express = require("express");
const router = express.Router();

const { index, show, store, authenticate, login, logout } = require("../controllers/EmpController");

router.get("/", authenticate, index);
router.get("/show", authenticate, show);
router.post("/store", store);
//router.post("/update", authenticate, update);
router.post("/index", login);
//router.post("/logout", authenticate, logout);

module.exports = router;

const express = require("express");
const router = express.Router();
const { identifyContact } = require("../controllers/contactController");

router.post("/", identifyContact);

module.exports = router;

const express = require("express");
const router = express.Router();
const bankController = require("../controllers/bankController");
const { authenticateUser } = require("../middleware/authentication");

router.post("/save-funds", authenticateUser, bankController.saveFunds);
router.post("/withdraw-funds", authenticateUser, bankController.withdrawFunds);
router.get("/bank-statement", authenticateUser, bankController.bankStatement);

module.exports = router;

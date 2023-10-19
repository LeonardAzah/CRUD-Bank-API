const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.get(
  "/",
  authenticateUser,
  authorizePermissions("admin"),
  loanController.getAllLoans
);
router.post("/request-loan", authenticateUser, loanController.requestLoan);
router.post(
  "/aprove-loan",
  authenticateUser,
  authorizePermissions("admin"),
  loanController.approveLoan
);
router.post(
  "/declined-loan",
  authenticateUser,
  authorizePermissions("admin"),
  loanController.declinedLoan
);

module.exports = router;

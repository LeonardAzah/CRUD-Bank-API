const Loan = require("../models/Loan");
const CustomError = require("../errors");
const StatusCodes = require("http-status-codes");
const { paginate, sendApprovedMail, sendDeclinedMail } = require("../utils");
const Bank = require("../models/Bank");
const User = require("../models/User");

const requestLoan = async (req, res) => {
  const { amount } = req.body;
  const loan = await Loan.create({
    user: req.user.userId,
    amount: amount,
  });

  res.status(StatusCodes.CREATED).json({ loan });
};

const getAllLoans = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const loans = await paginate({
    model: Loan,
    page,
    limit,
  });
  res.status(StatusCodes.OK).json({ loans });
};

const getSingleLoan = async (req, res) => {
  const { id } = req.params;
  const loan = await Loan.findOne({ _id: id });
  if (!loan) {
    throw new CustomError.NotFoundError("Loan not found");
  }
  res.status(StatusCodes.OK).json({ loan });
};

const approveLoan = async (req, res) => {
  const { loanId, userId, amount } = req.body;

  const loan = await Loan.findOne({ _id: loanId });
  const bank = await Bank.findOne({ user: userId });
  const user = await User.findOne({ _id: userId });

  if (!loan || !user) {
    throw new CustomError.NotFoundError("Loan or User not found");
  }

  if (loan.status !== "pending") {
    throw new CustomError.BadRequestError("Loan is not pending");
  }

  // Update loan status
  loan.status = "approved";
  await loan.save();

  // Add the loan amount to the user's account
  bank.balance = (bank.balance || 0) + amount;
  await bank.save();

  await sendApprovedMail({
    name: user.name,
    email: user.email,
    amount,
  });
  res
    .status(StatusCodes.OK)
    .json({ message: "Loan approved and amount added to user account" });
};

const declinedLoan = async (req, res) => {
  const { loanId, userId, amount } = req.body;

  const loan = await Loan.findOne({ _id: loanId });
  const bank = await Bank.findOne({ user: userId });
  const user = await User.findOne({ _id: userId });

  if (!loan || !user) {
    throw new CustomError.NotFoundError("Loan or User not found");
  }

  if (loan.status !== "pending") {
    throw new CustomError.BadRequestError("Loan is not pending");
  }

  // Update loan status
  loan.status = "declined";
  await loan.save();

  await sendDeclinedMail({
    name: user.name,
    email: user.email,
    amount,
  });
  res.status(StatusCodes.OK).json({ message: "Loan declined" });
};

module.exports = {
  requestLoan,
  getAllLoans,
  getSingleLoan,
  approveLoan,
  declinedLoan,
};

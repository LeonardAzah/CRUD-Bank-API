const Bank = require("../models/Bank");
const StatusCodes = require("http-status-codes");
const CustomError = require("../errors");

const saveFunds = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.userId;
  const account = await Bank.findOne({ user: userId });
  if (!account) {
    const bank = await Bank.create({
      user: userId,
    });
    bank.balance += amount;
    bank.save();
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Funds saved successfully" });
  }
  account.balance += amount;
  account.save();
  res
    .status(StatusCodes.OK)
    .json({ account, message: "Funds saved successfully" });
};

const withdrawFunds = async (req, res) => {
  const { amount } = req.body;
  const account = await Bank.findOne({ user: req.user.userId });
  if (!account) {
    throw new CustomError.NotFoundError("User account not found");
  }
  if (account.balance < amount) {
    throw new CustomError.BadRequestError("Insufficient funds");
  }
  account.balance -= amount;
  account.save();
  res
    .status(StatusCodes.OK)
    .json({ account, message: "Funds withdrawn successfully" });
};

const bankStatement = async (req, res) => {
  const account = await Bank.findOne({ user: req.user.userId });
  if (!account) {
    throw new CustomError.NotFoundError("User account not found");
  }

  res.status(StatusCodes.OK).json({ account });
};

module.exports = {
  saveFunds,
  withdrawFunds,
  bankStatement,
};

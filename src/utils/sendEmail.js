require("dotenv").config();
const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);
  return transporter.sendMail({
    from: '"crud-bank-api" <process.env.EMAIL>',
    to: to,
    subject: subject,
    html: html,
  });
};

module.exports = sendEmail;

const sendEmail = require("./sendEmail");

const sendApprovedMail = async ({ name, email, amount }) => {
  const message = `<p>Your loan of ${amount} has been approved and your account has been credited.</p>`;
  return sendEmail({
    to: email,
    subject: "Loan Request Approved",
    html: `<h4>Hello, ${name} </h4> ${message}`,
  });
};

const sendDeclinedMail = async ({ name, email, amount }) => {
  const message = `<p>Your loan of ${amount} has been declined. This is due the fact that your account does not meet up to the criteria</p>`;
  return sendEmail({
    to: email,
    subject: "Loan Request Declined",
    html: `<h4>Hello, ${name} </h4> ${message}`,
  });
};

module.exports = {
  sendApprovedMail,
  sendDeclinedMail,
};

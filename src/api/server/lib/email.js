const settings = require('./settings');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const transporter = nodemailer.createTransport(smtpTransport(settings.smtp))

const send = (message) => {
  if (message.to.indexOf('@') <= 0) {
    return;
  }
  message.from = settings.emailFrom;
  transporter.sendMail(message, (err, info) => {
    // err - is the error object if message failed
    // info - includes the result, the exact format depends on the transport mechanism used
  });
}

module.exports = {
  send: send
}

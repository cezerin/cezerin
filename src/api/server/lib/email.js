const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const EmailSettingsService = require('../services/settings/email');

const send = (message) => {
  return new Promise((resolve, reject) => {
    EmailSettingsService.getEmailSettings().then(settings => {
      if (message.to.indexOf('@') <= 0) {
        reject('Invalid email address');
        return;
      }
      message.from = `"${settings.from_name}" <${settings.from_address}>`;
      const smtp = {
        host: settings.host,
        port: settings.port,
        secure: settings.port === 465,
        auth: {
            user: settings.user,
            pass: settings.pass
        }
      }
      let transporter = nodemailer.createTransport(smtpTransport(smtp))
      transporter.sendMail(message, (err, info) => {
        if(err) {
          reject(err)
        } else {
          resolve(info)
        }
      });
    })
  })
}

module.exports = {
  send: send
}

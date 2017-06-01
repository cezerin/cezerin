const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const settings = require('./settings');
const EmailSettingsService = require('../services/settings/email');

const send = (message) => {
  return new Promise((resolve, reject) => {
    EmailSettingsService.getEmailSettings().then(emailSettings => {
      if (message.to.indexOf('@') <= 0) {
        reject('Invalid email address');
        return;
      }

      const useSmtpServerFromConfigFile = emailSettings.host === '';

      const smtp = useSmtpServerFromConfigFile ? {
        host: settings.smtpServer.host,
        port: settings.smtpServer.port,
        secure: settings.smtpServer.secure,
        auth: {
            user: settings.smtpServer.user,
            pass: settings.smtpServer.pass
        }
      } : {
        host: emailSettings.host,
        port: emailSettings.port,
        secure: emailSettings.port === 465,
        auth: {
            user: emailSettings.user,
            pass: emailSettings.pass
        }
      }

      message.from = useSmtpServerFromConfigFile ?
      `"${settings.smtpServer.fromName}" <${settings.smtpServer.fromAddress}>` :
      `"${emailSettings.from_name}" <${emailSettings.from_address}>`;

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

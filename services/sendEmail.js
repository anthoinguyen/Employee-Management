var nodemailer = require('nodemailer');
var express = require('express');

module.exports = {
  Send: function (sendTo, subject, Content) {
    var mailOpts, smtpTrans;
    smtpTrans = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      SMTPAuth: true,
      SMTPSecure: 'tls',
      auth: {
        user: "anthoi.nguyen.dev@gmail.com",
        pass: "thanthoai1223..,a"
      }
    });
    mailOpts = {
      from: 'Phòng Hành Chính Tổ Chức',
      to: sendTo,
      subject: subject,
      generateTextFromHTML: true,
      html: Content
    };
    smtpTrans.sendMail(mailOpts, (err, info) => {
      if (err) {
        console.log("Gui that bai");
      } else {
        console.log("Gui thanh cong");
      }
    });
  },

  SendWithReplyTo: function (sendTo, subject, Content, replyTo) {
    var mailOpts, smtpTrans;
    smtpTrans = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      SMTPAuth: true,
      SMTPSecure: 'tls',
      auth: {
        user: "anthoi.nguyen.dev@gmail.com",
        pass: "thanthoai1223..,a"
      }
    });
    mailOpts = {
      from: 'Phòng Hành Chính Tổ Chức',
      reply_to: replyTo,
      to: sendTo,
      subject: subject,
      generateTextFromHTML: true,
      html: Content
    };
    smtpTrans.sendMail(mailOpts, (err, info) => {
      if (err) {
        console.log("Gui that bai");
      } else {
        console.log("Gui thanh cong");
      }
    });
  }
};

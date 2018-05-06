import nodemailer from 'nodemailer'
//var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: '541032442@qq.com',
      pass: 'gesjbtfngrbnbceg'
    }
  });
  
  const defaultMailOptions = {
    from: '541032442@qq.com',
    to: 'piscium2010@163.com',
    subject: 'Sending Email using Node.js',
    html: '<h1>Welcome</h1><p>That was easy!</p>'
  };
  
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });


export function sendMail(to, subject, html, callback) {
    let mailOptions = Object.assign({},defaultMailOptions,{to, subject, html})
    console.log(`mailOptions`,mailOptions)
    transporter.sendMail(mailOptions, callback)

    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       throw error
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //       if(callback) {
    //           callback()
    //       }
    //     }
    // });
}


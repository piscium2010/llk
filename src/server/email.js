import nodemailer from 'nodemailer'

var transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true,
    auth: {
      user: 'piscium2010@163.com',
      pass: 'Gbu2017'
    }
  });
  
  const defaultMailOptions = {
    from: 'piscium2010@163.com',
    to: 'piscium2010@163.com',
    subject: 'Sending Email using Node.js',
    html: '<h1>Welcome</h1><p>That was easy!</p>'
  };

export function sendMail(to, subject, html, callback) {
    let mailOptions = Object.assign({},defaultMailOptions,{to, subject, html})
    transporter.sendMail(mailOptions, callback)
}


const nodeMailer = require("nodemailer");

exports.sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "aa19816f2a4bb6",
          pass: "ca1f5199cd32e8"
        }
      });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
    
}
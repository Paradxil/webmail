const nodemailer = require("nodemailer");

class SendMailService {
    async sendMail(email, account) {
        try {
            let transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure, // true for 465, false for other ports
                auth: {
                    user: account.smtp.user, // generated ethereal user
                    pass: account.smtp.password, // generated ethereal password
                },
            });
            
            // send mail with defined transport object
            let info = await transporter.sendMail(email);
            console.log(info);
            console.log(info.envelope);
            return info;
        }
        catch(err) {
            throw err;
        }
    }
}

module.exports = SendMailService;
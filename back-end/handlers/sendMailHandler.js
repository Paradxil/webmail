const SendMailService = require('../services/sendMailService');
const GetAccountService = require('../services/getAccountService');

const Response = require("../model/response/response");

class SendMailHandler {
    async handle(req, res) {
        let service = new SendMailService();
        let accountService = new GetAccountService();

        try {
            let account = await accountService.getAccount(req.body.from);

            let email = {
                text: req.body.text,
                html: req.body.html,
                subject: req.body.subject,
                to: req.body.to,
                from: {
                    name: account.name||"",
                    address: account.email
                }
            };

            await service.sendMail(email, account);
            res.send(Response.Success());
        }
        catch(err) {
            console.log(err);
            res.send(Response.Error("Error sending email.")); //TODO: Include more information in the response.
        }
    }
}

module.exports = SendMailHandler;
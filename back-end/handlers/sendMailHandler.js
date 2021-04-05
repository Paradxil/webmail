const SendMailService = require('../services/sendMailService');
const GetAccountService = require('../services/getAccountService');

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
            res.sendStatus(200);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
}

module.exports = SendMailHandler;
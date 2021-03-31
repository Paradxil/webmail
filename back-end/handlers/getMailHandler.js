const GetMailService = require("../services/getMailService");

class GetMailHandler {
    async handle(req, res) {
        let service = new GetMailService();
        try {
            let emails = await service.getMail(req.body.id, req.body.folder);
            res.send(emails);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
}

module.exports = GetMailHandler;
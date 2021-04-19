const GetMailService = require("../services/getMailService");

const Response = require("../model/response/response");

class GetMailHandler {
    async handle(req, res) {
        let service = new GetMailService();
        try {
            let emails = await service.getMail(req.body.id, req.body.folder);
            //TODO: Check for invalid requests.

            res.send(Response.Success(emails));
        } catch (error) {
            console.log(error);
            //TODO: Include more details about the error. Was the imap authentication invalid etc...
            res.send(Response.Error("Error fetching emails."));
        }
    }
}

module.exports = GetMailHandler;
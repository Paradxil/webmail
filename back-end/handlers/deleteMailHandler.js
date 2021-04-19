const DeleteMailService = require("../services/deleteMailService");
const GetAccountService = require("../services/getAccountService");

const Response = require("../model/response/response");

class DeleteMailHandler {
    async handle(req, res) {
        let deleteMailService = new DeleteMailService();
        let getAccountService = new GetAccountService();

        try {
            let account = await getAccountService.getAccount(req.body.accountid);
            await deleteMailService.deleteMail(req.body.uid, account, req.body.folder);
            res.send(Response.Success()); //TODO: Return the id of the email deleted.
        }
        catch(err) {
            console.log(err);
            res.send(Response.Error());
        }
    }
}

module.exports = DeleteMailHandler;
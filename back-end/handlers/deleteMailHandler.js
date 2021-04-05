const DeleteMailService = require("../services/deleteMailService");
const GetAccountService = require("../services/getAccountService");

class DeleteMailHandler {
    async handle(req, res) {
        let deleteMailService = new DeleteMailService();
        let getAccountService = new GetAccountService();

        try {
            let account = await getAccountService.getAccount(req.body.accountid);
            await deleteMailService.deleteMail(req.body.uid, account, req.body.folder);
            res.sendStatus(200);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
}

module.exports = DeleteMailHandler;
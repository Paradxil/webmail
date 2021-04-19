const DeleteAccountService = require('../services/deleteAccountService');
const Response = require("../model/response/response");

class DeleteAccountHandler {
    async handle(req, res) {
        let service = new DeleteAccountService();

        try {
            await service.deleteAccount(req.params.id);
            res.send(Response.Success()); //TODO: Return the id of the account deleted.
        }
        catch(err) {
            console.log(err);
            res.send(Response.Error("Error deleting account."));
        }
    }
}

module.exports = DeleteAccountHandler;
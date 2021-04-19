const GetAccountsService = require('../services/getAccountsService');

const Response = require("../model/response/response");

class GetAccountsHandler {
    async handle(req, res) {
        let service = new GetAccountsService();

        try {
            let accounts = await service.getAccounts(req.user._id);
            //TODO: Check for invalid requests.
            res.send(Response.Success(accounts));
        }
        catch(err) {
            console.log(err);
            res.send(Response.Error("Error getting accounts."));
        }
    }
}

module.exports = GetAccountsHandler;
const GetAccountsService = require('../services/getAccountsService');

class GetAccountsHandler {
    async handle(req, res) {
        let service = new GetAccountsService();

        try {
            let accounts = await service.getAccounts(req.user._id);
            res.send(accounts);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
}

module.exports = GetAccountsHandler;
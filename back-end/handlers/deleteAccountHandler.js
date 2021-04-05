const DeleteAccountService = require('../services/deleteAccountService');

class DeleteAccountHandler {
    async handle(req, res) {
        let service = new DeleteAccountService();

        try {
            await service.deleteAccount(req.params.id);
            res.sendStatus(200);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
}

module.exports = DeleteAccountHandler;
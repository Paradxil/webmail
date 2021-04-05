const UpdateAccountService = require("../services/updateAccountService");
const SyncFoldersService = require("../services/syncFoldersService");

class UpdateAccountHandler {
    async handle(req, res) {
        let service = new UpdateAccountService();
        let syncFoldersService = new SyncFoldersService();

        try {
            let account = {
                _id: req.body._id,
                userid: req.user._id,
                email: req.body.email,
                name: req.body.name,
                imap: req.body.imap,
                smtp: req.body.smtp
            }

            await service.updateAccount(req.body._id, account);
            await syncFoldersService.syncFolders(account);
            res.sendStatus(200);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
}

module.exports = UpdateAccountHandler;
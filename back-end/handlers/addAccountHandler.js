const AddAccountService = require('../services/addAccountService');
const SyncFoldersService = require('../services/syncFoldersService');

class AddAccountHandler {
    async handle(req, res) {
        let service = new AddAccountService();
        let syncFoldersService = new SyncFoldersService();

        try {
            let account = {
                userid: req.user._id,
                email: req.body.email,
                name: req.body.name,
                imap: req.body.imap,
                smtp: req.body.smtp
            }

            await service.addAccount(account);
            await syncFoldersService.syncFolders(account);
            res.sendStatus(200);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
}

module.exports = AddAccountHandler;
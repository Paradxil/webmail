const AddAccountService = require('../services/addAccountService');
const SyncFoldersService = require('../services/syncFoldersService');

class AddAccountHandler {
    async handle(req, res) {
        let service = new AddAccountService();
        let syncFoldersService = new SyncFoldersService();

        try {
            let account = {
                userid: req.user._id,
                host: req.body.host,
                port: req.body.port,
                secure: req.body.secure,
                user: req.body.user,
                password: req.body.password,
                email: req.body.email
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
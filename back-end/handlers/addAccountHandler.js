const AddAccountService = require('../services/addAccountService');
const SyncFoldersService = require('../services/syncFoldersService');

const Response = require("../model/response/response");

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

            //TODO: Check for invalid requests

            await service.addAccount(account);
            await syncFoldersService.syncFolders(account);
            res.send(Response.Success());
        }
        catch(err) {
            console.log(err);
            res.send(Response.Error("Error adding account."));
        }
    }
}

module.exports = AddAccountHandler;
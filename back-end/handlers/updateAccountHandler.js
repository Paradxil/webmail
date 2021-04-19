const UpdateAccountService = require("../services/updateAccountService");
const SyncFoldersService = require("../services/syncFoldersService");

const Response = require("../model/response/response");

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

            //TODO: Check for an invalid request

            await service.updateAccount(req.body._id, account);
            await syncFoldersService.syncFolders(account);
            res.send(Response.Success());
        }
        catch(err) {
            console.log(err);
            res.send(Response.Error("Error updating account."));
        }
    }
}

module.exports = UpdateAccountHandler;
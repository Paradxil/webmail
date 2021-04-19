const GetAccountService = require("../services/getAccountService");
const SyncFoldersService = require("../services/syncFoldersService");
const SyncMailService = require("../services/syncMailService");

const Response = require("../model/response/response");

class SyncMailHandler {
    async handle(req, res) {
        let syncMailService = new SyncMailService();
        let syncFoldersService = new SyncFoldersService();
        let getAccountService = new GetAccountService();

        try {
            let account = await getAccountService.getAccount(req.body.accountid);

            //TODO: Check for invalid request

            //Make sure this account belongs to the current user
            if(account === null || account.userid === null || account.userid !== req.user._id.toString()) {
                res.send(Response.Unauthorized());
                return;
            }

            await syncFoldersService.syncFolders(account);
            await syncMailService.syncMail(account);
            res.send(Response.Success());
        }
        catch(err) {
            console.log(err);
            res.send(Response.Error("Error syncing email.")); //TODO: Include more information. Was the imap account invalid? etc.
        }
    }
}

module.exports = SyncMailHandler;
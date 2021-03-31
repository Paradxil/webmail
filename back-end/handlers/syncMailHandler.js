const GetAccountService = require("../services/getAccountService");
const SyncFoldersService = require("../services/syncFoldersService");
const SyncMailService = require("../services/syncMailService");

class SyncMailHandler {
    async handle(req, res) {
        let syncMailService = new SyncMailService();
        let syncFoldersService = new SyncFoldersService();
        let getAccountService = new GetAccountService();

        try {
            let account = await getAccountService.getAccount(req.body.accountid);

            //Make sure this account belongs to the current user
            if(account === null || account.userid === null || account.userid !== req.user._id.toString()) {
                res.sendStatus(403);
                return;
            }

            await syncFoldersService.syncFolders(account);
            await syncMailService.syncMail(account);
            res.sendStatus(200);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
}

module.exports = SyncMailHandler;
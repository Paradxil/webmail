const StatusService = require("../services/statusService");
const Response = require("../model/response/response");
const GetAccountService = require("../services/getAccountService");

class StatusHandler {
    async handle(req, res) {
        let service = new StatusService();
        let accountService = new GetAccountService();

        let accountid = req.body.accountid;
        let folder = req.body.folder;

        //TODO: Check for invalid requests.

        try {
            let account = await accountService.getAccount(accountid);

            if(account === null) {
                res.send(Response.Error("Error getting account."));
                return;
            }

            let data = await service.getStatus(account, folder);
            res.send(Response.Success(data));
        }
        catch(err) {
            console.log(err);
            res.send(Response.Error("Error getting status."));
        }
    }
}

module.exports = StatusHandler;
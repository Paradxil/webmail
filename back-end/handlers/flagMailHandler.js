const FlagMailService = require("../services/flagMailService");
const GetAccountService = require("../services/getAccountService");
const Response = require("../model/response/response");

class FlagMailHandler {
    async handle(req, res) {
        let accountService = new GetAccountService();

        try {
            let uid = req.body.uid||null;
            let flags = req.body.flags||null;
            let accountid = req.body.accountid||null;
            let folder = req.body.folder||null;

            //Check for invalid requests.
            if(uid === null || flags === null || flags.length === 0 || accountid === null || folder === null) {
                res.send(Response.InvalidRequest("Invalid request parameters.", 
                    uid===null?{name: "uid", expectedType: "Email UID (String)", value: uid}:{},
                    flags===null?{name: "flags", expectedType: "[String]", value: flags}:{},
                    flags===null?{name: "folder", expectedType: "String", value: folder}:{},
                    flags===null?{name: "accountid", expectedType: "Email Account ID (String)", value: accountid}:{}))
                return;
            }

            let account = await accountService.getAccount(accountid);

            let service = new FlagMailService(account);

            if(account === null) {
                res.send(Response.Error("Invalid accountid."));
                return;
            }
            
            try {
                await this.editFlags(service, folder, uid, flags);
            }
            finally {
                await service.close();
            }

            res.send(Response.Success());
        }
        catch(err) {
            console.log(err);
            res.send(Response.Error("Error editing email."));
        }
    }

    async editFlags(service, folder, uid, flags) {};
}

module.exports = FlagMailHandler;
const IMAPConnection = require("../data/imapConnection");
const MailIMAP = require("../data/mailIMAP");

class FlagMailService {
    async addEmailFlags(account, folder, uid, flags) {
        let conn = new IMAPConnection(account);
        let mailImap = new MailIMAP(conn);

        try {
            await conn.connect();

            await mailImap.addEmailFlags(folder, uid, flags);
        }
        catch(err) {
            throw err;
        }
        finally {
            await conn.close();
        }
    }
}

module.exports = FlagMailService;
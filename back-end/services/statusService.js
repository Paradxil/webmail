const IMAPConnection = require("../data/imapConnection");
const MailIMAP = require("../data/mailIMAP");

class StatusService {
    async getStatus(account, folderPath) {
        let conn = new IMAPConnection(account);
        let mailImap = new MailIMAP(conn);

        try {
            await conn.connect();

            return await mailImap.getStatus(folderPath);
        }
        catch(err) {
            throw err;
        }
        finally {
            await conn.close();
        }
    }
}

module.exports = StatusService;
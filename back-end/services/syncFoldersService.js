const IMAPConnection = require("../data/imapConnection");
const MailIMAP = require("../data/mailIMAP");
const EmailAccountDAO = require("../data/emailAccountDAO");

class SyncFoldersService {
    async syncFolders(account) {
        let conn = new IMAPConnection(account);
        let mailImap = new MailIMAP(conn);
        let accountDAO = new EmailAccountDAO();

        try {
            await conn.connect();
            let folders = await mailImap.getAccountFolders();
            let data = {
                folders: folders
            }
            accountDAO.update(account._id, data);
        }
        catch(err) {
            throw err;
        }
        finally {
            await conn.close();
        }
    }
}

module.exports = SyncFoldersService;
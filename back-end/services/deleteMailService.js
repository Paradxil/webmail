const MailDAO = require('../data/mailDAO');
const IMAPConnection = require("../data/imapConnection");
const MailIMAP = require("../data/mailIMAP");

class DeleteMailService {
    async deleteMail(uid, account, folder) {
        if(account === null || account._id == null || folder === null || uid === null) {
            throw new Error("Invalid null argument");
        }

        let conn = new IMAPConnection(account);
        let mailImap = new MailIMAP(conn);
        let mailDAO = new MailDAO();

        try {
            await conn.connect();

            await mailImap.deleteEmail(folder, uid);
            await mailDAO.deleteMail(account._id, folder, uid);
        } 
        catch (error) {
            console.log(error);
            throw(error);
        }
        finally {
            await conn.close();
        }
    }
}

module.exports = DeleteMailService;
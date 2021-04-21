const IMAPConnection = require("../data/imapConnection");
const MailDAO = require("../data/mailDAO");
const MailIMAP = require("../data/mailIMAP");

class FlagMailService {
    async addEmailFlags(account, folder, uid, flags) {
        let conn = new IMAPConnection(account);
        let mailImap = new MailIMAP(conn);
        let mailDAO = new MailDAO();

        try {
            await conn.connect();

            //Separate the standard flags from non-standard flags.
            //Assume that any flag starting with '\' is supported by the IMAP server.
            //Save all other flags to the customFlags property of the email model
            //in the database.
            /*let customFlags = [];
            let imapFlags = [];

            for(let flag of flags) {
                if(flag[0] === '\\') {
                    imapFlags.push(flag);
                }
                else {
                    customFlags.push(flag);
                }
            }*/
            
            await mailImap.addEmailFlags(folder, uid, flags);
            //await mailDAO.addCustomMailFlags(account._id, folder, uid, customFlags);
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
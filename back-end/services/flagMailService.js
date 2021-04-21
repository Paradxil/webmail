const IMAPConnection = require("../data/imapConnection");
const MailDAO = require("../data/mailDAO");
const MailIMAP = require("../data/mailIMAP");

class FlagMailService {
    constructor(account) {
        this.conn = new IMAPConnection(account);
        this.mailImap = new MailIMAP(this.conn);
        this.mailDAO = new MailDAO();
    }

    async close() {
        await this.conn.close();
    }

    async addEmailFlags(folder, uid, flags) {
        try {
            await this.conn.connect();

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
            
            await this.mailImap.addEmailFlags(folder, uid, flags);
            //await mailDAO.addCustomMailFlags(account._id, folder, uid, customFlags);
        }
        catch(err) {
            throw err;
        }
    }

    async removeEmailFlags(folder, uid, flags) {
        try {
            await this.conn.connect();
            await this.mailImap.removeEmailFlags(folder, uid, flags);
        }
        catch(err) {
            throw err;
        }
    }
}

module.exports = FlagMailService;
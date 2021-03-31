class MailIMAP {
    constructor(conn) {
        this.conn = conn;
    }

    /**
     * Get recieved emails from the Imap server.
     * @param {Number} last How far back in days to retrieve emails. Defaults to the last 30 days.
     */
    async getMail(last = 30, folder = "INBOX") {
        let client = this.conn.getClient();
        // Select and lock a mailbox. Throws if mailbox does not exist
        let lock = await client.getMailboxLock(folder);

        try {
            let sinceDate = new Date();
            sinceDate.setDate( sinceDate.getDate() - last );

            let search = {
                since: sinceDate
            }

            // list subjects for all messages
            // uid value is always included in FETCH response, envelope strings are in unicode.
            let mail = [];
            for await (let msg of client.fetch(search, { envelope: true, uid:true, source: true, bodyStructure: true})){
                mail.push(msg);
            }
            return mail;
        } finally {
            // Make sure lock is released, otherwise next `getMailboxLock()` never returns
            lock.release();
        }
    }

    async getAccountFolders() {
        try {
            let list = await this.conn.getClient().list();
            return list.map((item) => {return item.path});
        }
        catch(err) {
            console.log(err);
        }
    }

}

module.exports = MailIMAP;
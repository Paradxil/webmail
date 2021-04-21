class MailIMAP {
    constructor(conn) {
        this.conn = conn;
    }

    /**
     * Get received emails from the Imap server.
     * @param {Number} last How far back in days to retrieve emails. Defaults to the last 30 days.
     */
    async getMail(last = 30, folder = "INBOX", fromUID = null) {
        let client = this.conn.getClient();

        // Select and lock a mailbox. Throws if mailbox does not exist
        let lock = await client.getMailboxLock(folder);

        try {
            let sinceDate = new Date();
            sinceDate.setDate( sinceDate.getDate() - last );

            let search = {
                since: sinceDate,
                uid: fromUID===null?'1:*':fromUID + ':*'
            };

            // list subjects for all messages
            // uid value is always included in FETCH response, envelope strings are in unicode.
            let mail = [];
            for await (let msg of client.fetch(search, { envelope: true, uid:true, source: true, bodyStructure: true, flags: true})){
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
            let folders = [];
            
            for(let item of list) {
                let folder = {
                    path: item.path,
                    name: item.name,
                    use: item.specialUse||"",
                    nicename: item.name
                };
                folders.push(folder);
            }
            return folders;
        }
        catch(err) {
            console.log(err);
        }
    }

    async appendEmail(folder, emailBuffer) {
        await this.conn.getClient().append(folder, emailBuffer);
    }

    /** 
     * Permanently delete an email 
     */
    async deleteEmail(folder, uid) {
        let client = this.conn.getClient();

        // Select and lock a mailbox. Throws if mailbox does not exist
        let lock = await client.getMailboxLock(folder);

        try {
            let query = {
                uid: uid
            };

            await client.messageDelete(query);
        }
        finally {
            lock.release();
        }
    }

    async addEmailFlags(folder, uid, flags) {
        let client = this.conn.getClient();
        let error = null;

        let lock = await client.getMailboxLock(folder);

        try {
            let query = {
                uid: uid
            };

            await client.messageFlagsAdd(query, flags);
        }
        catch(err) {
            error = err;
        }
        finally {
            lock.release();
        }

        if(error !== null) {
            throw error;
        }
    }

    async removeEmailFlags(folder, uid, flags) {
        let client = this.conn.getClient();
        let error = null;

        let lock = await client.getMailboxLock(folder);

        try {
            let query = {
                uid: uid
            };

            await client.messageFlagsRemove(query, flags);
        }
        catch(err) {
            error = err;
        }
        finally {
            lock.release();
        }

        if(error !== null) {
            throw error;
        }
    }

    async getStatus(folder) {
        return await this.conn.getClient().status(folder, {unseen: true, recent: true, messages: true});
    }

}

module.exports = MailIMAP;
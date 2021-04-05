const { ImapFlow } = require('imapflow');

class IMAPConnection {
    constructor(account) {
        this.client = new ImapFlow({
            host: account.imap.host,
            port: account.imap.port,
            secure: account.imap.secure,
            auth: {
                user: account.imap.user,
                pass: account.imap.password
            },
            logger: {debug(obj){}, info(obj){}, warn(obj){}, error(obj){console.log(obj)}}
        });
    }

    getClient() {
        return this.client;
    }

    async connect() {
        await this.client.connect();
    }

    async close() {
        // log out and close connection
        await this.client.logout();
    }
}

module.exports = IMAPConnection;
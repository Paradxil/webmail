const { ImapFlow } = require('imapflow');

class IMAPConnection {
    constructor(account) {
        this.client = new ImapFlow({
            host: account.host,
            port: account.port,
            secure: account.secure,
            auth: {
                user: account.user,
                pass: account.password
            }
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
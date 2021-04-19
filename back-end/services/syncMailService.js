const IMAPConnection = require("../data/imapConnection");
const MailIMAP = require("../data/mailIMAP");
const MailDAO = require("../data/mailDAO");
const simpleParser = require('mailparser').simpleParser;

class SyncMailService {
    async syncMail(account) {
        let conn = new IMAPConnection(account);
        let mailImap = new MailIMAP(conn);
        let mailDAO = new MailDAO();

        try {
            let parsedEmails = [];
            await conn.connect();
            let folders = account.folders;
            for(let folder of folders) {
                let emails = [];
                try {
                    emails = await mailImap.getMail(30, folder.path);
                }
                catch(err) {
                    console.log(err);
                }

                for(let mail of emails) {
                    try {
                        let messageParts = await this.parseMessage(mail);
                        let data = {
                            _id: mail.uid,
                            uid: mail.uid,
                            userid: account.userid,
                            accountid: account._id,
                            folder: folder.path,
                            subject: mail.envelope.subject,
                            message: messageParts.text,
                            html: messageParts.html,
                            from: {
                                name: mail.envelope.from?mail.envelope.from[0].name:"",
                                address: mail.envelope.from?mail.envelope.from[0].address:""
                            },
                            to: {
                                name: mail.envelope.to?mail.envelope.to[0].name:"",
                                address: mail.envelope.to?mail.envelope.to[0].address:""
                            },
                            date: mail.envelope.date.toString()
                        }
                        parsedEmails.push(data);
                    }
                    catch(err) {
                        console.log(err);
                    }
                }
            }
            await mailDAO.addMail(parsedEmails);
        }
        catch(err) {
            throw err;
        }
        finally {
            await conn.close();
        }
    }

    async parseMessage(email) {
        let parsed = await simpleParser(email.source);
        return {
            text: parsed.text,
            html: parsed.html||parsed.textAsHtml
        }
    }
}

module.exports = SyncMailService;
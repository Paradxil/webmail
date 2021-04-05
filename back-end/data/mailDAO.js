const mongoose = require('mongoose');
const Email = require('../model/email');

class MailDAO {
    constructor() {

    }

    async getMail(accountid, folder) {
        return await Email.find({accountid: accountid, folder: folder}).sort(
            { 
                "_id" : -1.0
            }
        );
    }

    /**
     * Add or update new mail items
     */
    async addMail(emails) {
        if(emails !== null&& emails.length > 0) { 
            for (let mail of emails) {
                const id = {
                    _id: mail._id
                }
                let mailItem = await Email.findOne(id);

                if(mailItem !== null) {
                    for(let key of Object.keys(mail)) {
                        mailItem[key] = mail[key];
                    }
                }
                else {
                    mailItem = new Email(mail);
                }

                await mailItem.save();
            }
        }
    }

    async deleteMail(accountid, folder, uid) {
        await Email.deleteOne({accountid: accountid, folder: folder, uid: uid});
    }
}
module.exports = MailDAO;
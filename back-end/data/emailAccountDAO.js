const EmailAccount = require('../model/emailAccount');

class EmailAccountDAO {
    async getAllAccounts(userid) {
        return await EmailAccount.find({userid: userid});
    }

    async getAccount(accountid) {
        const id = {
            _id: accountid
        }
        return await EmailAccount.findOne(id);
    }

    async addAccount(account) {
        let emailAccount = new EmailAccount(account);
        await emailAccount.save();
    }

    async update(accountid, data) {
        const id = {
            _id: accountid
        }
        let account = await EmailAccount.findOne(id);

        if(account !== null) {
            for(let key of Object.keys(data)) {
                account[key] = data[key];
            }
            await account.save();
        }
    }
}

module.exports = EmailAccountDAO;
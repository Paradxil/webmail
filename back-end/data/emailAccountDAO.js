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
        try {
            let emailAccount = new EmailAccount(account);
            await emailAccount.save();
        }
        catch(err) {
            console.log(err);
            throw err;
        }
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

    async addUpdate(account) {
        let emailAccount = null;
        if(account._id !== null) {
            emailAccount = await this.getAccount(account._id);
        }

        if(emailAccount !== null) {
            await this.update(account._id, account);
        }
        else {
            await this.addAccount(account);
        }
    }

    async deleteAccount(accountid) {
        try {
            await EmailAccount.deleteOne({_id: accountid});
        }
        catch(err) {
            console.log(err);
            throw err;
        }
    }
}

module.exports = EmailAccountDAO;
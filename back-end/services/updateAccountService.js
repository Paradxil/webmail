const EmailAccountDAO = require("../data/emailAccountDAO");

class UpdateAccountService {
    async updateAccount(accountid, account) {
        let emailAccountDAO = new EmailAccountDAO();
        await emailAccountDAO.update(accountid, account);
    }
}

module.exports = UpdateAccountService;
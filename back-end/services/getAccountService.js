const EmailAccountDAO = require("../data/emailAccountDAO");

class GetAccountService {
    async getAccount(accountid) {
        let accountDAO = new EmailAccountDAO();

        try {
            return await accountDAO.getAccount(accountid);
        }
        catch(err) {
            throw err;
        }
    }
}

module.exports = GetAccountService;
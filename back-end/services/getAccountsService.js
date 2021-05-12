const EmailAccountDAO = require("../data/emailAccountDAO");

class GetAccountsService {
    async getAccounts(userid) {
        let accountDAO = new EmailAccountDAO();

        try {
            return await accountDAO.getAllAccounts(userid);
        }
        catch(err) {
            throw err;
        }
    }
}

module.exports = GetAccountsService;
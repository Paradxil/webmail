const EmailAccountDAO = require("../data/emailAccountDAO");

class AddAccountService {
    async addAccount(account) {
        let accountDAO = new EmailAccountDAO();

        try {
            return await accountDAO.addAccount(account);
        }
        catch(err) {
            throw err;
        }
    }
}

module.exports = AddAccountService;
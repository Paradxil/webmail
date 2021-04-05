const EmailAccountDAO = require('../data/emailAccountDAO');

class DeleteAccountService {
    async deleteAccount(id) {
        let accountDAO = new EmailAccountDAO();
        await accountDAO.deleteAccount(id);
    }
}

module.exports = DeleteAccountService;
const MailDAO = require('../data/mailDAO');

class GetMailService {
    async getMail(accountid, folder) {
        let dao = new MailDAO();
        try {
            if(accountid === null || folder === null) {
                return;
            }
            return await dao.getMail(accountid, folder);
        } catch (error) {
            console.log(error);
            throw(error);
        }
    }
}

module.exports = GetMailService;
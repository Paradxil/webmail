const MailDAO = require('../data/mailDAO');

class GetMailService {
    async getMail(accountid, folder) {
        let dao = new MailDAO();
        try {
            if(accountid === null || folder === null) {
                return;
            }

            let emailObject = {};

            let emails = await dao.getMail(accountid, folder); 

            emails.forEach((email) => {
                emailObject[email.uid] = email;
            });

            return emailObject;
        } catch (error) {
            console.log(error);
            throw(error);
        }
    }
}

module.exports = GetMailService;
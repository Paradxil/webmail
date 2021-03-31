const UserDAO = require('../data/userDAO');

class RegisterService {
    async register(username, password) {
        let userDAO = new UserDAO();

        if(await userDAO.getUser(username) === null) {
            await userDAO.add(username, password);
        }
        else {
            console.log(userDAO.getUser(username));
        }
    }
}

module.exports = RegisterService;
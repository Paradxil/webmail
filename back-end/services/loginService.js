const UserDAO = require('../data/userDAO');

class LoginService {
    async login(username, password) {
        let userDAO = new UserDAO();

        try {
            let user = await userDAO.getUser(username);
            if(user !== null && password === user.password) {
                return user;
            }
        }
        catch(err) {
            console.log(err);
            throw err;
        }

        return null;
    }
}

module.exports = LoginService;

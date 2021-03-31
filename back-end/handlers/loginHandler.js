const LoginService = require("../services/loginService");

class LoginHandler {
    async handle(username, password, done) {
        let service = new LoginService();
        
        try {
            let user = await service.login(username, password);
            if(user !== null) {
                return done(null, user);
            }
        }
        catch(err) {
            return done(err);
        }

        return done(null, false);
    }
}

module.exports = LoginHandler;
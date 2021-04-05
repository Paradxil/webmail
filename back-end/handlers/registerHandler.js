const RegisterService = require("../services/registerService");

class RegisterHandler {
    async handle(req, res) {
        let service = new RegisterService();

        try {
            let username = req.body.username;
            let password = req.body.password;
            let email = req.body.email;

            await service.register(username, password, email);
            res.sendStatus(200);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
}

module.exports = RegisterHandler;
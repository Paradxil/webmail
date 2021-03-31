const RegisterService = require("../services/registerService");

class RegisterHandler {
    async handle(req, res) {
        let service = new RegisterService();

        try {
            let username = req.body.username;
            let password = req.body.password;

            await service.register(username, password);
            res.sendStatus(200);
        }
        catch {
            console.log(err);
            res.sendStatus(500);
        }
    }
}

module.exports = RegisterHandler;
const RegisterService = require("../services/registerService");
const CaptchaService = require("../services/captchaService");

class RegisterHandler {
    async handle(req, res) {
        let service = new RegisterService();
        let captchaService = new CaptchaService();

        try {
            let username = req.body.username;
            let password = req.body.password;
            let email = req.body.email;

            let captchaid = req.body.captchaid;
            let verified = await captchaService.verifyCaptcha(captchaid);

            if(!verified) {
                console.log("Bad captcha.");
                throw new Error("Incorrect captcha.");
            }

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
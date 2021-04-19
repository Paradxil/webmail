
const CaptchaService = require("../services/captchaService");

class RegisterHandler {
    static async handle(req, res, next) {
        let captchaService = new CaptchaService();

        try {
            let captchaid = req.body.captchaid;
            let verified = await captchaService.verifyCaptcha(captchaid);

            if(!verified) {
                throw new Error("Incorrect captcha.");
            }
            else {
                next();
            }
        }
        catch(err) {
            res.sendStatus(403);
            console.log(err);
        }
    }
}

module.exports = RegisterHandler;
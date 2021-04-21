const FlagMailHandler = require("./flagMailHandler");

class AddFlagMailHandler extends FlagMailHandler {
    async editFlags(service, folder, uid, flags) {
        await service.addEmailFlags(folder, uid, flags);
    }
}

module.exports = AddFlagMailHandler;
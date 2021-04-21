const FlagMailHandler = require("./flagMailHandler");

class RemoveFlagMailHandler extends FlagMailHandler {
    async editFlags(service, folder, uid, flags) {
        await service.removeEmailFlags(folder, uid, flags);
    }
}

module.exports = RemoveFlagMailHandler;
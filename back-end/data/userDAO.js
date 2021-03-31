const User = require('../model/user');

class UserDAO {
    async getUser(username) {
        return await User.findOne({username: username});
    }
    
    async getUserById(id) {
        return await User.findOne({_id: id});
    }

    async add(username, password) {
        let user = new User({
            username: username,
            password: password
        });
        await user.save();
    }
}

module.exports = UserDAO;
const axios = require('axios');

module.exports.loggedIn = false;

module.exports.isLoggedIn = async function() {
    let response = await axios.get("/api/user");
    let user = response.data;

    if(user !== null && user !== undefined && user._id !== null && user._id !== undefined) {
        module.exports.loggedIn = true;
        return true;
    }
    module.exports.loggedIn = false;
    return false;
}
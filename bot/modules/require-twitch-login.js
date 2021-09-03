var modules = {
    mognodb: require("./mongodb")
}

var config = require("../config.json")

module.exports = function(req, res, next){
    if(!req.user.twitch_id){
        res.redirect(config.twitch.application.loginPage)
        return
    }
    next()
}
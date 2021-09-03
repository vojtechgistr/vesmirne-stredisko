var modules = {
    mognodb: require("./mongodb")
}

var config = require("../config.json")

module.exports = function(req, res, next){
    console.log("tady");
    if(!req.user){
        res.redirect(config.discord.application.loginPage)
        return
    }
    next()
}
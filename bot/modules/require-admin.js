var modules = {
    mognodb: require("./mongodb")
}

var config = require("../config.json")

module.exports = function(req, res, next){
    if(!req.user){
        res.redirect(config.discord.application.loginPage)
        return
    }
    if(!req.user.admin){
        res.redirect("/")
        return
    }
    next()
}
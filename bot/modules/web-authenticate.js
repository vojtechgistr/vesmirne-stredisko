var modules = {
    mongodb: require("./mongodb")
}

module.exports = async function(req, res, next){
    if(req.cookies.token){
        var userID = ((await modules.mongodb.collections.webTokens.findOne({token: req.cookies.token})) || {}).user_id
        var user = await modules.mongodb.collections.users.findOne({_id: userID})
        if(user){
            req.user = user
            next()
            return
        }
    }
    next()
    return
}
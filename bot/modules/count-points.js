var modules = {
    mongodb: require("./mongodb")
}

module.exports = async function(userID){
    var pointObjects = await modules.mongodb.collections.items.find({user_id: userID, item_id: 0}).toArray()

    var points = 0

    pointObjects.forEach(pointObject => {
        points += pointObject.count
    })

    return points
}
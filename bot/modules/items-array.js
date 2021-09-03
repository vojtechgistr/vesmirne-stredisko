var config = require("../config.json")

var itemsArray = []

Object.keys(config.items).forEach(key => {
    config.items[key].id = Number(key)
    itemsArray.push(config.items[key])
})

module.exports = itemsArray
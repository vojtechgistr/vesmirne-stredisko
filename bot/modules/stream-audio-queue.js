var modules = {
    generateToken: require("./generate-token")
}

var queue = []

module.exports = {
    first: function(){
        return queue[0]
    },
    queue: function(){
        return queue
    },
    removeFirst: function(){
        queue.shift()
    },
    insert: function(data){
        data.id = modules.generateToken(100)
        queue.push(data)
    },
    delete: function(id="0"){
        if(id == "0")
            queue.shift()
        else
            queue = queue.filter(item => item.id != id)
    }
}
var modules = {
    mongodb: require("./modules/mongodb")
}

const { MongoClient, ObjectID } = require("mongodb");
const uri = "mongodb://localhost/";
const client = new MongoClient(uri, { useUnifiedTopology: true });
client.connect()
const db = client.db('DarkStreams')

// db.collection("sources").find({}).toArray().then(data => {
//     var remaining = data.length
//     data.forEach(async element => {
//         var id
//         switch(element.source_id){
//             case 1:
//                 id = 1
//                 break
//             case 3:
//                 id = 2
//                 break
//             case 5:
//                 id = 3
//                 break
//             case 6:
//                 id = 4
//                 break
//             default:
//                 remaining--
//                 return
//         }
//         if(!element.discord_id || !await modules.getIDFromDiscordID(element.discord_id)){
//             remaining--
//             return
//         }
            
//         await modules.mongodb.collections.items.insertOne({item_id: id, user_id: await modules.getIDFromDiscordID(element.discord_id), count: element.count || 1})
//         remaining--
//         console.log("done " + element._id);
//         console.log(remaining)
//     })
// })

// db.collection("tickets").find({}).toArray().then(data => {
//     data.forEach(async element => {
//         if(element.station == 100)
//             return
//         if(!element.discord_id || !await modules.getIDFromDiscordID(element.discord_id))
//             return
//         await modules.mongodb.collections.items.insertOne({item_id: Number("10" + element.station), user_id: await modules.getIDFromDiscordID(element.discord_id), count: 1})
//         console.log("done " + element._id);
//     })
// })

// db.collection("items").find({}).toArray().then(data => {
//     var remaining = data.length
//     data.forEach(async element => {
//         if(element.object_id == 100){
//             remaining--
//             return
//         }
//         if(!element.object_id){
//             remaining--
//             return
//         }
//         if(!element.discord_id || !await modules.getIDFromDiscordID(element.discord_id)){
//             remaining--
//             return
//         }
            
//         await modules.mongodb.collections.items.insertOne({item_id: Number("20" + element.object_id), user_id: await modules.getIDFromDiscordID(element.discord_id), count: 1})
//         remaining--
//         console.log("done " + element._id);
//         console.log(remaining)
//     })
// })

// db.collection("points").find({}).toArray().then(data => {
//     var remaining = data.length
//     data.forEach(async element => {
//         if(!element.value){
//             remaining--
//             return
//         }
//         if(!element.discord_id || !await modules.getIDFromDiscordID(element.discord_id)){
//             remaining--
//             return
//         }
            
//         await modules.mongodb.collections.items.insertOne({item_id: 0, user_id: await modules.getIDFromDiscordID(element.discord_id), count: element.value})
//         remaining--
//         console.log("done " + element._id);
//         console.log(remaining)
//     })
// })

// modules.mongodb.collections.items.deleteMany({})

// db.collection("twitch-discord-connections").find({}).toArray().then(data => {
//     data.forEach(async element => {
//         if(!element.twitch_id || !element.discord_id)
//             return
//         await modules.mongodb.collections.users.updateOne({discord_id: element.discord_id}, {$set:{twitch_id: element.twitch_id}})
//         console.log("done " + element._id);
//     })
// })

// db.collection("points").find().toArray().then(data => {
    // data = data.filter(data => data.twitch_id != undefined)
    // data.forEach(async element => {
    //     if(!(await modules.mongodb.collections.users.findOne({twitch_id: element.twitch_id}) || {}).discord_id)
    //         return
    //     // await modules.mongodb.collections.items.insertOne({item_id: 0, user_id: await modules.getIDFromDiscordID((await modules.mongodb.collections.users.findOne({twitch_id: element.twitch_id})).discord_id), count: element.value})
    //     console.log({item_id: 0, user_id: await modules.getIDFromDiscordID((await modules.mongodb.collections.users.findOne({twitch_id: element.twitch_id})).discord_id), count: element.value})
    // })

    
    
// })

// modules.mongodb.collections.items.find({}).toArray().then(data => {
//     data.forEach(async element => {
//         console.log(element._id.toString().length);
//         if(!element._id.toString().length)
//             return
        // if(element._id.toString().length != 24)
        //     await modules.mongodb.collections.items.deleteOne({_id: element._id})
        // else
        //     return
        // console.log(element);
//     })
// })

// modules.mongodb.ObjectID.prototype.getTimestamp = function() {
//     return new Date(parseInt(this.toString().slice(0,8), 16)*1000);
// }

// modules.mongodb.collections.items.find({}).toArray().then(items => {
//     items.forEach(item => {
//         if(new Date("01-12-2021 8:12") < modules.mongodb.ObjectID(item._id).getTimestamp())
//             modules.mongodb.collections.items.deleteOne({_id: item._id}).then(() => {console.log(modules.mongodb.ObjectID(item._id).getTimestamp())})
//     })
    
// })

// modules.mongodb.collections.users.findOne({discord_id: "715610292477755527"}).then(data => {
//     modules.mongodb.collections.items.find({user_id: data._id}).toArray().then(console.log)
// })

// modules.mongodb.collections.items.deleteMany({})

// modules.mongodb.collections.items.find({user_id: undefined}).toArray().then(console.log)
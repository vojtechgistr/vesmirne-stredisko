var NPMModules = {
    mongodb: require("mongodb")
}

const { MongoClient, ObjectID } = require("mongodb");
const uri = "mongodb://localhost/";
const client = new MongoClient(uri, { useUnifiedTopology: true });
client.connect()
const db = client.db('vesmirne-stredisko')

module.exports = {
    client: MongoClient,
    ObjectID: ObjectID,
    database: db,
    collections: {
        users: db.collection("users"),
        frakce: db.collection("frakce"),
        fotbal: db.collection("fotbal"),
        counts: db.collection("counts"),
        trests: db.collection("trests"),
        items: db.collection("items"),
        warns: db.collection("warns"),
        mutes: db.collection("mutes"),
        activeVoiceTicks: db.collection("active-voice-ticks"),
        webTokens: db.collection("web-tokens"),
        events: db.collection("events"),
        streamSounds: db.collection("stream-sounds"),
        votes: db.collection("votes"),
        refreshTokens: db.collection("refresh-tokens")
    }
    
}
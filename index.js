const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

const cors = require('cors')
app.use(cors())
app.use(express.json())
require('dotenv').config();


const uri = "mongodb+srv://leptopdb_009:nPGSOXPZGTawdKQM@cluster0.xhtnt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try{
        await client.connect()
        const leptopsCollection = client.db("leptop-house").collection("leptop-db")

        //all item
        app.get('/inventory', async (req, res) => {
            const query = {}
            const cursor = leptopsCollection.find(query)
            const items = await cursor.toArray()
            res.send(items)
        })

        // Item Details
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const item = await leptopsCollection.findOne(query);
            res.send(item);
        });
        
    }
    finally{

    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Leptop DB WareHouse')
})

app.listen(port, () => {
    console.log(`server running on ${port}`)
})
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

const cors = require('cors')
app.use(cors())
app.use(express.json())
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xhtnt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try{
        await client.connect()
        const leptopsCollection = client.db("leptop-house").collection("leptop-db")
        const userCollection = client.db("leptop-house").collection("user-db")

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

        // Update stock quantity
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const updateFruits = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updated = {
                $set: {
                    quantity: updateFruits.quantity
                }
            };
            const result = await leptopsCollection.updateOne(filter, updated, options);
            res.send(result);
        })

        // Deliver items PUT
        app.put('/inventory/deliver/:id', async (req, res) => {
            const id = req.params.id
            const newQuantity = req.body
            const deliver = newQuantity.quantityUpdate - 1
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: deliver
                }
            }

            const result = await leptopsCollection.updateOne(query, updateDoc, options)
            res.send(result);
        });

        //Delete
        app.delete('/inventory/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result=await leptopsCollection.deleteOne(query);
            res.send(result)
        });

        // add new item
        app.post('/additem', async (req, res) => {
            const newItems = req.body;
            const result = await leptopsCollection.insertOne(newItems);
            res.send(result);
        });
        
        // user added items
        app.get('/additem', async (req, res) => {
            const email = req.query.email; 
            const query = { email: email }
            const cursor = leptopsCollection.find(query)
            const myItems = await cursor.toArray()
            res.send(myItems)       
        })
    }
    finally{

    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Leptop DB WareHouse')
})

app.get('/hero', (req, res) => {
    res.send('Hero DB WareHouse')
})

app.listen(port, () => {
    console.log(`server running on ${port}`)
})
const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const serviceCollection = client.db("carMechanic").collection("services");
    // perform actions on the collection object
    // get api
    app.get('/services', async (req, res) => {
        const cursor = await serviceCollection.find({}).toArray();
        res.send(cursor);
    })

    // get single service
    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const result = await serviceCollection.findOne({ _id: ObjectId(id) });
        res.json(result);
    })

    //delete api
    app.delete('/services/:id', async (req, res) => {
        const id = req.params.id;
        const result = await serviceCollection.deleteOne({ _id: ObjectId(id) });
        res.json(result);
    })


    // post api
    app.post('/services', async (req, res) => {
        console.log(req.body);
        const service = req.body;
        console.log('hit the post api', service);
        const result = await serviceCollection.insertOne(service);
        res.send(result);
        console.log(result);
    })
});
// async function run() {
//     try {
//         await client.connect();
//         const database = client.db("carMechanic");
//         const servicesCollection = database.collection("services");
//         //post api
//         app.post('/services', (req, res) => {
//             const service = req.body;
//             console.log('hit the post api', service);
//             const result = await servicesCollection.insertOne(service);
//             console.log(result);
//             res.send(result);
//         })
//     } finally {
//         // await client.close();
//     }
// }
// run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Genius Server');
})

app.listen(port, () => {
    console.log('Running server at port:', port);
})

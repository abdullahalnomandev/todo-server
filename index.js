const express = require('express')
const app = express()
const cors = require('cors')
const port = 5000
const objectId = require('mongodb').ObjectID

require('dotenv').config()
app.use(express.json())
app.use(cors())

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ez7qy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




client.connect(err => {
    const fruitsCollection = client.db("fruits").collection("fruitsItems");

    app.post("/addFruits", (req, res) => {
        fruitsCollection.insertOne(req.body)
            .then((result) => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/allFruits', (req, res) => {
        fruitsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get("/fruit/:id",(req,res)=>{

        fruitsCollection.find({_id:objectId(req.params.id)})
        .toArray((err,documents)=>{
            res.send(documents[0])
        })
        
    })


    app.delete("/delete/:_id", (req, res) => {
        const id = req.params._id
        fruitsCollection.deleteOne({_id:objectId(id)})
            .then((result) => {
                res.send(result> 0)
            })
    })


});

app.get('/', (req, res) => {

    res.send("This is todo list App")
})

app.listen(process.env.PORT || port)

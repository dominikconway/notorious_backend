require ('dotenv').config()
const { PORT = 3001, DATABASE_URL} = process.env
const express = require('express')
const app = express()

const mongoose = require('mongoose')

//  import Middelware
const cors = require('cors')
const morgan = require('morgan')

mongoose.connect(DATABASE_URL)

mongoose.connection
  .on("open", () => console.log("You are connected to MongoDB"))
  .on("close", () => console.log("You are disconnected from MongoDB"))
  .on("error", (error) => console.log(error))

const NotesSchema = new mongoose.Schema({
    title: String,
    memo: String,
    date: Date,
})

const Notes = mongoose.model('Notes', NotesSchema)

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())


// test route
app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/notes', async (req, res) => {
    try {
        res.json(await Notes.find({}))
    } catch(error) {
        res.status(400).json(error)
    }
})

app.post('/notes', async (req, res) => {
    try {
        res.json(await Notes.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.delete('/notes/:id', async (req, res) => {
    try {
        res.json(await Notes.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.put('/notes/:id', async (req, res) => {
    try {
        res.json(
            await Notes.findByIdAndUpdate(req.params.id, req.body, {new:true})
        )
    } catch (error) {
        res.status(400).json(error)
    }
})

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))
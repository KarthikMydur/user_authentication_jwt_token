const express = require('express')
const mongoose = require('mongoose')
const postRoute = require('./routes/post')

const app = express()
const port = 3050

//Import routes
const authRoute = require('./routes/auth')

//connect to DB
mongoose.connect('mongodb+srv://kamydur:secret123@cluster0-hkg7a.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('connected to the DB')
})

//Middleware
app.use(express.json())


//Route Middleware
app.use('/api/user', authRoute)
app.use('/api/post', postRoute)

app.listen(port, ()=>{
    console.log('listening to the port', port)
})


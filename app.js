if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const cors = require('cors')
const mongoose = require('mongoose')
const express = require('express')
const app = express()

const { errorHandler } = require('./middlewares/error-handlers')
const routeIndex = require('./routes')
const Port = process.env.PORT
const mongoDbUrl = process.env.DATABASE_CONNECTION

// connect mongodb
mongoose.connect(mongoDbUrl, { useNewUrlParser: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected");  
});

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use('/', routeIndex)
app.use(errorHandler)

app.listen(Port, () => {
  console.log(`Listening to port Port ${Port}`);
})


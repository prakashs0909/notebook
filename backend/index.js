const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors')

connectToMongo();

const app = express()
const port = process.env.PORT 

app.use(express.json());
app.use(cors())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Notebook backend listening on port ${port}`)
})
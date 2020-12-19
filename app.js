if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const express = require('express')
const port = process.env.PORT || 4000

const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(morgan('combined'))
app.use(helmet())
app.use(cors())
app.use(express.json())

// enable preflight requests
app.options('*', cors())

app.use('/', require('./routes'))

app.listen(port, () => console.log('API server listening on port: ', port))

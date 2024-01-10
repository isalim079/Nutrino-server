const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3005

// middleware
app.use(cors())
app.use(express.json())


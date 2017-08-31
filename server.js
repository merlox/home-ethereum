const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const port = 80
const ip = 'localhost'

app.use('/', express.static(path.join(__dirname, 'dist/')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use((req, res, next) => {
   console.log(`${req.method} Request to ${req.originalUrl}`)
   next()
})

app.get('*/build.js', (req, res) => {
   res.sendFile(path.join(__dirname, 'dist', 'build.js'))
})

app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port, ip, (req, res) => {
   console.log(`Server listening on ${ip}:${port}`)
})

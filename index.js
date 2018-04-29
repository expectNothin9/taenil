const express = require('express')
const line = require('@line/bot-sdk')
const lineBot = require('./lineBot')
const db = require('./db')

// Creating one user.
var xxx = new db.Users({
  lineId: 'xxx_lineId',
  lineName: 'xxx_lineName',
  points: 0
})
// Saving it to the database.
xxx.save((err) => { if (err) console.log('Error on save!', err) })

var YYY = new db.Users({
  lineId: 'YYY_lineId',
  lineName: 'YYY_lineName',
  points: 0
})
// Saving it to the database.
YYY.save((err) => { if (err) console.log('Error on save!', err) })

// LINE
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const app = express()
app.post('/webhook', line.middleware(config), lineBot.webhookHandler)

// heroku dev debug
app.get('*', (req, res) => {
  res.send('Hello lineBot!')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})

const express = require('express')
const line = require('@line/bot-sdk')
const lineBotWebhookHandler = require('./bot/core')

// LINE
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const app = express()
app.post('/webhook', line.middleware(config), lineBotWebhookHandler)

// heroku dev debug
app.get('*', (req, res) => {
  res.send('Hello lineBot!')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})

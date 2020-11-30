const express = require('express')
const line = require('@line/bot-sdk')
const Redis = require("ioredis")
const debug = require('debug')('R:index')

const weather = require('./lib/weather')

// setup line client
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const client = new line.Client(config)
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    debug(event)
    return Promise.resolve(null)
  }

  if (event.message.text === '/weather') {
    const weathers = await weather.getWeathers()
    const weatherTexts = weathers.map((weather) => {
      const { place, temperature, main } = weather
      return `${place} ${temperature}°C ${main}`
    })
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: weatherTexts.join('\n')
    })
  }

  return Promise.resolve(null)
  // return client.replyMessage(event.replyToken, {
  //   type: 'text',
  //   text: event.message.text
  // })
}

// setup redis
const REDIS_URL = process.env.REDIS_URL
const redis = new Redis(REDIS_URL)

// setup express server
const app = express()

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
})

app.get('/redis', async (req, res) => {
  const testRedisValue = await redis.get('TEST_REDIS_KEY')
  debug(`testRedisValue: ${testRedisValue}`)
  res.send(`testRedisValue: ${testRedisValue}`)
})

app.get('/weathers', async (req, res) => {
  const weathers = await weather.getWeathers()
  res.send(`weathers: ${JSON.stringify(weathers, null, 2)}`)
})

app.get('*', (req, res) => {
  res.send(`!taenil olleh`)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})

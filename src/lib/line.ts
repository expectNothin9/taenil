import * as line from '@line/bot-sdk'

import weather from './weather'

const debug = require('debug')('R:lib:line')

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const client = new line.Client(config)

export const lineMiddleware = line.middleware(config)

const WEATHER_PATTERN = /^(IFTTT: )?\/weather/

export const lineWebhookHandler = (req, res) => {
  Promise.all(req.body.events.map(async (event) => {
    if (event.type !== 'message' || event.message.type !== 'text') {
      debug(event)
      return Promise.resolve(null)
    }
  
    if (WEATHER_PATTERN.test(event.message.text)) {
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
  }))
  .then((result) => res.json(result))
}

export async function handleEvent(event) {
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
}

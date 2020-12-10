import {
  // main APIs
  Client,
  middleware,
  // types
  MessageAPIResponseBase,
  WebhookEvent,
} from '@line/bot-sdk'
import { Request, Response } from 'express'
import makeDebug from 'debug'

import weather from './weather'

const debug = makeDebug('R:lib:line')

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const client = new Client(config)

export const lineMiddleware = middleware(config)

const WEATHER_PATTERN = /^(IFTTT: )?\/weather/

export const lineWebhookHandler = (req: Request, res: Response): void => {
  Promise.all(req.body.events.map(async (event) => {
    debug(JSON.stringify(event, null, 2))
    if (event.type !== 'message' || event.message.type !== 'text') {
      // debug(event)
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

export async function handleEvent(event: WebhookEvent): Promise<MessageAPIResponseBase|null> {
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

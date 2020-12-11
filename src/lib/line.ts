import {
  // main APIs
  Client,
  middleware,
  // types
  MessageAPIResponseBase,
  TextMessage,
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

const GROUP_ID = process.env.LINE_GROUP_ID
export const lineCommandHandler = (req: Request, res: Response): void => {
  const { command } = req.params
  if (!GROUP_ID) {
    return
  }
  const message: TextMessage = {
    type: 'text',
    text: `command: ${command}`
  }

  switch (command) {
    case 'test-quick-replay':
      message.quickReply = {
        items: [
          {
            type: 'action',
            action: {
              type: 'message',
              label: 'label A',
              text: 'quick replay text of label A'
            }
          },
          {
            type: 'action',
            action: {
              type: 'postback',
              label: 'label B',
              data: 'from=test-quick-replay&action=B',
              displayText: 'quick replay postback of label B'
            }
          }
        ]
      }
      break
  }

  client.pushMessage(GROUP_ID, message)
    .then(() => res.send('ok'))
    .catch((error) => {
      debug('client.pushMessage() failed', error)
      res.send('error')
    })
}

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

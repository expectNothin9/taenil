import {
  // main APIs
  Client,
  middleware,
  // types
  MessageAPIResponseBase,
  TextMessage,
  ImageMessage,
  QuickReply,
  WebhookEvent,
} from '@line/bot-sdk'
import { Request, Response } from 'express'
import makeDebug from 'debug'

import beautyPageant from './beautyPageant'
import weather from './weather'

const debug = makeDebug('R:lib:line')

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const client = new Client(config)

export const lineMiddleware = middleware(config)

const GROUP_ID = process.env.LINE_GROUP_ID

export const lineBeautyPageantHandler = (req: Request, res: Response): void => {
  if (!GROUP_ID) {
    return
  }
  const candidates = beautyPageant.randomCandidates()
  const candidateIds = candidates.map((candidate) => (candidate.id)).join(',')
  const quickReply: QuickReply = {
    items: []
  }
  const messages: ImageMessage[] = candidates.map((candidate) => {
    const label = `No.${candidate.id} 妹`
    quickReply.items.push({
      type: 'action',
      action: {
        type: 'postback',
        label,
        data: `action=beautyPageant&match=${candidateIds}&win=${candidate.id}`,
        displayText: label
      }
    })
    return {
      type: 'image',
      originalContentUrl: candidate.image,
      previewImageUrl: candidate.image
    }
  })
  
  // only the last message's quickReply will be processed by LINE
  messages[messages.length - 1].quickReply = quickReply

  client.pushMessage(GROUP_ID, messages)
    .then(() => res.send('ok'))
    .catch((error) => {
      debug('client.pushMessage() failed', error)
      res.send('error')
    })
}

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
    case 'test-quick-reply':
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
  debug(message)
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

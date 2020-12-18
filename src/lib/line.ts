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
import * as querystring from 'querystring'
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

// FIXME: use template message instead
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
        data: `action=beauty-pageant&match=${candidateIds}&win=${candidate.id}`,
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

const WEATHER_PATTERN = /^(IFTTT: )?\/weather/

export const lineWebhookHandler = (req: Request, res: Response): void => {
  Promise.all(req.body.events.map(async (event) => {
    debug(JSON.stringify(event, null, 2))
    if (event.type === 'postback') {
      const { data } = event.postback
      const parsedData = querystring.parse(data)
      debug('parsedData', parsedData)
      if (parsedData.action === 'beauty-pageant') {
        const { match, win } = parsedData
        const stats = await beautyPageant.recordMatch(<string>match, <string>win)
        debug('stats', stats)
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: stats
        })
      } else {
        return Promise.resolve(null)
      }
    }

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
    } else if (event.message.text === '/test') {
      const candidates = beautyPageant.randomCandidates()
      const candidateIds = candidates.map((candidate) => (candidate.id)).join(',')
      return client.replyMessage(event.replyToken, {
        type: 'template',
        altText: 'beauty-pageant',
        template: {
          type: 'image_carousel',
          columns: candidates.map((candidate) => {
            return {
              imageUrl: candidate.image,
              action: {
                type: 'postback',
                label: `No.${candidate.id} 妹`,
                data: `action=beauty-pageant&match=${candidateIds}&win=${candidate.id}`
              }
            }
          })
        }
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

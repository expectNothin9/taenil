import * as express from 'express'
import * as path from 'path'
import { instagram } from 'instagram-scraper-api'

import { lineMiddleware, lineWebhookHandler } from './lib/line'
import redis from './lib/redis'
import { scrapIgHandler } from './lib/scraper'
import weather from './lib/weather'
import { whistlingHandler } from './lib/whistling'

const debug = require('debug')('R:index')

// setup express server
const app = express()

app.get('/redis', async (req, res) => {
  const testRedisValue = await redis.get('TEST_REDIS_KEY')
  debug(`testRedisValue: ${testRedisValue}`)
  res.send(`testRedisValue: ${testRedisValue}`)
})

app.get('/weathers', async (req, res) => {
  const weathers = await weather.getWeathers()
  res.send(`weathers: ${JSON.stringify(weathers, null, 2)}`)
})

app.get('/whistling', whistlingHandler)

app.get('/scrap/ig/:id', scrapIgHandler)

app.use('/public', express.static(path.join(__dirname, '..', 'public')))

app.get('*', (req, res) => {
  res.send('!st. ni taenil olleh')
})

app.post('/webhook', lineMiddleware, lineWebhookHandler)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on ${port} 🎉`)
})

import * as express from 'express'

import {
  lineMiddleware,
  lineCommandHandler,
  lineWebhookHandler
} from './lib/line'
import redis from './lib/redis'
import { scrapIgHandler, SNAPSHOT_PATH } from './lib/scraper'
import weather from './lib/weather'
import { whistlingHandler } from './lib/whistling'

// setup express server
const app = express()

app.use('/snapshot', express.static(SNAPSHOT_PATH))

app.get('/redis', async (req, res) => {
  const testRedisValue = await redis.get('TEST_REDIS_KEY')
  res.send(`testRedisValue: ${testRedisValue}`)
})

app.get('/weathers', async (req, res) => {
  const weathers = await weather.getWeathers()
  res.send(`weathers: ${JSON.stringify(weathers, null, 2)}`)
})

app.get('/whistling', whistlingHandler)

app.get('/scrap/ig/:id', scrapIgHandler)

app.get('/line/command/:command', lineCommandHandler)

app.get('*', (req, res) => {
  res.send('!st. ni taenil olleh')
})

app.post('/webhook', lineMiddleware, lineWebhookHandler)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on ${port} 🎉`)
})

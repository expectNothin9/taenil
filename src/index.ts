import * as express from 'express'

import weather from './lib/weather'

// setup express server
const app = express()

app.get('/weathers', async (req, res) => {
  const weathers = await weather.getWeathers()
  res.send(`weathers: ${JSON.stringify(weathers, null, 2)}`)
})

app.get('*', (req, res) => {
  res.send('!st. ni taenil olleh')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on ${port} 🎉`)
})

const express = require('express')

const app = express()

const envReady = process.env.CHANNEL_ACCESS_TOKEN !== undefined

app.get('*', (req, res) => {
  res.send(`!taenil olleh, env: ${envReady}`)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})

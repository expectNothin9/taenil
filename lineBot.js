const line = require('@line/bot-sdk')

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const bot = new line.Client(config)
function handleEvent (event) {
  // console.log('event', event)
  // event {
  //   type: 'message',
  //   replyToken: 'xxx',
  //   source: { userId: 'xxx', type: 'user' },
  //   timestamp: 1524824621289,
  //   message: { type: 'text', id: '7863626468882', text: '我是誰' }
  // }
  const { type, message } = event
  if (type !== 'message' || message.type !== 'text') {
    return Promise.resolve(null)
  }

  switch (message.text) {
    default:
      return botEcho({ bot, event })
  }
}

const botEcho = ({ bot, event }) => {
  const { source, replyToken, message } = event
  return bot.getProfile(source.userId)
    .then((profile) => profile.displayName)
    .then((userName) => bot.replyMessage(replyToken, {
      type: 'text',
      text: `${userName}: ${message.text}`
    }))
    .catch((exception) => { console.log(exception) })
}

const webhookHandler = (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((exception) => {
      console.log(exception)
      res.json({})
    })
}

const lineBot = {
  webhookHandler
}

module.exports = lineBot

const line = require('@line/bot-sdk')
const db = require('./db')
const log = require('./log')

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
    case 'ALL_USERS':
      return botShowAllUsers({ bot, event, db })
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
    .catch(log.handleException('botEcho'))
}

const botShowAllUsers = ({ bot, event, db }) => {
  return db.Users.find({})
    .then(users => {
      console.log('botShowAllUsers', users)
      const userPointTexts = users.map(user => `${user.lineName}: ${user.points}點`)
      return bot.replyMessage(event.replyToken, {
        type: 'text',
        text: userPointTexts.join('\n')
      })
    })
    .catch(log.handleException('botShowAllUsers'))
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

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
    case 'ADD_ME':
      return botUtil.addUser({ bot, event, db })
    case 'ALL_USERS':
      return botUtil.showAllUsers({ bot, event, db })
    default:
      return botUtil.echo({ bot, event })
  }
}

const botUtil = {
  addUser: ({ bot, event, db }) => {
    const { source, replyToken } = event
    return db.Users.find({ lineId: source.userId })
      .then((users) => {
        if (users.length === 0) {
          return bot.getProfile(source.userId)
            .then((profile) => {
              const newUser = new db.Users({
                lineId: profile.userId,
                lineName: profile.displayName,
                points: 0
              })
              return newUser.save()
            })
            .then((resp) => {
              console.log('newUser.save', resp)
              return bot.replyMessage(replyToken, { type: 'text', text: 'ADDED' })
            })
        } else if (users.length === 1) {
          return bot.replyMessage(replyToken, { type: 'text', text: 'ALREADY EXIST' })
        } else {
          throw new Error('db has multiple records with same line id')
        }
      })
      .catch(log.handleException('botUtil.addUser'))
  },

  echo: ({ bot, event }) => {
    const { source, replyToken, message } = event
    return bot.getProfile(source.userId)
      .then((profile) => profile.displayName)
      .then((userName) => bot.replyMessage(replyToken, {
        type: 'text',
        text: `${userName}: ${message.text}`
      }))
      .catch(log.handleException('botUtil.echo'))
  },

  showAllUsers: ({ bot, event, db }) => {
    return db.Users.find({})
      .then((users) => {
        console.log('botShowAllUsers', users)
        const userPointTexts = users.map(user => `${user.lineName}: ${user.points}點`)
        return bot.replyMessage(event.replyToken, {
          type: 'text',
          text: userPointTexts.join('\n')
        })
      })
      .catch(log.handleException('botUtil.showAllUsers'))
  }
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

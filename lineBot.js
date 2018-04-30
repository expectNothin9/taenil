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

  // command router
  const matched = message.text.match(/^\[([A-Z_]*)\]/)
  console.log('matched', matched)
  if (matched) {
    const command = matched[1]
    switch (command) {
      case 'ADD_ME':
        return botUtil.addUser({ bot, event, db })
      case 'ADD_POINTS_TO_USER':
        return botUtil.addPointsToUser({ bot, event, db })
      case 'SHOPPING':
        return botUtil.showShoppingList({ bot, event })
      case 'SHOW_ALL_USERS':
        return botUtil.showAllUsers({ bot, event, db })

      default:
        return botUtil.echo({ bot, event })
    }
  } else {
    return botUtil.echo({ bot, event })
  }
}

const botUtil = {
  addUser: ({ bot, event, db }) => {
    const { source, replyToken } = event
    return db.getUsers({ lineId: source.userId })
      .then((users) => {
        if (users.length === 0) {
          return bot.getProfile(source.userId)
            .then((profile) => db.addUser({
              lineId: profile.userId,
              lineName: profile.displayName
            }))
            .then((user) => bot.replyMessage(replyToken, {
              type: 'text',
              text: `ADDED\n${user.lineName}: ${user.points}pts`
            }))
        } else if (users.length === 1) {
          return bot.replyMessage(replyToken, {
            type: 'text',
            text: `ALREADY EXIST\n${users[0].lineName}: ${users[0].points}pts`
          })
        } else {
          throw new Error('db has multiple records with same line id')
        }
      })
      .catch(log.handleException('botUtil.addUser'))
  },

  addPointsToUser: ({ bot, event, db }) => {
    const { replyToken, message } = event
    const messageTexts = message.text.split(' ')
    const userLineName = messageTexts[1]
    const points = parseInt(messageTexts[2])
    if (!userLineName) { throw new Error(`addPointsToUser, userLineName: ${userLineName}`) }
    if (!points || points <= 0) { throw new Error(`addPointsToUser, points: ${points}`) }

    return db.getUsers({ lineName: userLineName })
      .then((users) => {
        if (users.length === 0) {
          return bot.replyMessage(replyToken, {
            type: 'text',
            text: `USER NOT FOUND\n${userLineName} not found`
          })
        } else if (users.length === 1) {
          const toPoints = users[0].points + points
          return db.updateUserPoints({ lineName: users[0].lineName, points: toPoints })
            .then((user) => bot.replyMessage(replyToken, {
              type: 'text',
              text: `UPDATED\n${user.lineName}: ${toPoints}pts`
            }))
        } else {
          throw new Error('db has multiple records with same line name')
        }
      })
      .catch(log.handleException('botUtil.addPointsToUser'))
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
    return db.getUsers()
      .then((users) => {
        console.log('botShowAllUsers', users)
        const userPointTexts = users.map(user => `${user.lineName}: ${user.points}pts`)
        return bot.replyMessage(event.replyToken, {
          type: 'text',
          text: userPointTexts.join('\n')
        })
      })
      .catch(log.handleException('botUtil.showAllUsers'))
  },

  showShoppingList: ({ bot, event }) => {
    const altText = 'Shopping List'
    return bot.replyMessage(event.replyToken, makeCarouselTemplateMessage({ altText }))
      .catch(log.handleException('botUtil.showShoppingList'))
  }
}

const makeCarouselTemplateMessage = ({ altText }) => {
  return {
    type: 'template',
    altText,
    template: {
      type: 'carousel',
      columns: makeCarouselColumns()
    }
  }
}

const makeCarouselColumns = () => {
  const items = [
    { name: 'Apple', price: 2 },
    { name: 'Banana', price: 3 }
  ]
  return items.map((item) => {
    return {
      thumbnailImageUrl: `https://dummyimage.com/600x600/333333/ffffff.jpg&text=${item.name}`,
      imageBackgroundColor: '#ff5555',
      imageAspectRatio: 'square',
      title: `${item.name.toUpperCase()}`,
      text: `${item.name}`,
      actions: [
        {
          type: 'postpack',
          label: `Buy ${item.name}`,
          data: `[BUY] Apple`
        }
      ]
    }
  })
}

const webhookHandler = (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((exception) => {
      console.log(log.handleException('webhookHandler'))
      res.json({})
    })
}

const lineBot = {
  webhookHandler
}

module.exports = lineBot

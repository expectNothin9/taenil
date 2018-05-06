const line = require('@line/bot-sdk')
const db = require('./db/util')
const log = require('./log')

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const bot = new line.Client(config)
function handleEvent (event) {
  switch (event.type) {
    case 'follow':
      return handleFollowEvent(event)
    case 'message':
      return handleMessageEvent(event)
    case 'postback':
      return handlePostbackEvent(event)
    default:
      return Promise.resolve(null)
  }
}

// event {
//   "replyToken": "xxx",
//   "type": "follow",
//   "timestamp": 1462629479859,
//   "source": { "type": "user", "userId": "xxx" }
// }
function handleFollowEvent (event) {
  return botUtil.addUser({ bot, event, db })
}

// event {
//   type: 'message',
//   replyToken: 'xxx',
//   source: { userId: 'xxx', type: 'user' },
//   timestamp: 1524824621289,
//   message: { type: 'text', id: '7863626468882', text: 'blablabla' }
// }
function handleMessageEvent (event) {
  const { message } = event
  if (message.type !== 'text') {
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
      case 'DEPOSIT':
        return botUtil.addPointsToUser({ bot, event, db })
      case 'SHOPPING':
        return botUtil.showShoppingList({ bot, event, db })
      case 'ALL_USERS':
        return botUtil.showAllUsers({ bot, event, db })
      case 'DELETE_ALL_USERS':
        return botUtil.deleteAllUsers({ bot, event, db })

      default:
        return botUtil.echo({ bot, event })
    }
  } else {
    return botUtil.echo({ bot, event })
  }
}

// event { type: 'postback',
//   replyToken: 'xxx',
//   source: { userId: 'xxx', type: 'user' },
//   timestamp: 1525077181637,
//   postback: { data: 'cmd=BUY&mid=003' }
// }
function handlePostbackEvent (event) {
  const kvs = event.postback.data.split('&')
  const info = {}
  kvs.forEach((kv) => {
    const splitKV = kv.split('=')
    info[splitKV[0]] = splitKV[1]
  })
  switch (info.cmd) {
    case 'BUY':
      return db.getMerchandises({ id: info.mid })
        .then((merchandises) => {
          if (merchandises.length === 0) {
            throw new Error('Merchandise not found')
          } else if (merchandises.length === 1) {
            return botUtil.echo({ bot, event, forceEchoText: `BUY ${merchandises[0].name}?` })
          } else {
            throw new Error('multiple merchandise records found with same id')
          }
        })
        .catch(log.handleException('handlePostbackEvent, BUY'))
    default:
      return Promise.resolve(null)
  }
}

const botUtil = {
  addUser: ({ bot, event, db }) => {
    const { source, replyToken } = event
    return db.getUsers({ id: source.userId })
      .then((users) => {
        if (users.length === 0) {
          return bot.getProfile(source.userId)
            .then((profile) => db.addUser({
              id: profile.userId,
              name: profile.displayName
            }))
            .then((user) => bot.replyMessage(replyToken, {
              type: 'text',
              text: `ADDED\n${user.name}: ${user.points}pts`
            }))
        } else if (users.length === 1) {
          return bot.replyMessage(replyToken, {
            type: 'text',
            text: `ALREADY EXIST\n${users[0].name}: ${users[0].points}pts`
          })
        } else {
          throw new Error('db has multiple records with same LINE id')
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

    return db.getUsers({ name: userLineName })
      .then((users) => {
        if (users.length === 0) {
          return bot.replyMessage(replyToken, {
            type: 'text',
            text: `USER NOT FOUND\n${userLineName} not found`
          })
        } else if (users.length === 1) {
          const toPoints = users[0].points + points
          return db.updateUserPoints({ lineName: users[0].name, points: toPoints })
            .then((user) => bot.replyMessage(replyToken, {
              type: 'text',
              text: `UPDATED\n${user.name}: ${toPoints}pts`
            }))
        } else {
          throw new Error('db has multiple records with same line name')
        }
      })
      .catch(log.handleException('botUtil.addPointsToUser'))
  },

  deleteAllUsers: ({ bot, event, db }) => {
    const { replyToken } = event
    return db.deleteUsers()
      .then((result) => {
        console.log(result)
        return bot.replyMessage(replyToken, {
          type: 'text',
          text: 'DELETE ALL USERS executed'
        })
      })
      .catch(log.handleException('botUtil.deleteAllUsers'))
  },

  echo: ({ bot, event, forceEchoText }) => {
    const { source, replyToken, message } = event
    const echoText = forceEchoText || message.text
    return bot.getProfile(source.userId)
      .then((profile) => profile.displayName)
      .then((userName) => bot.replyMessage(replyToken, {
        type: 'text',
        text: `${userName}: ${echoText}`
      }))
      .catch(log.handleException('botUtil.echo'))
  },

  showAllUsers: ({ bot, event, db }) => {
    return db.getUsers()
      .then((users) => {
        console.log('botShowAllUsers', users)
        const userPointTexts = users.map(user => `${user.name}: ${user.points}pts`)
        return bot.replyMessage(event.replyToken, {
          type: 'text',
          text: userPointTexts.join('\n')
        })
      })
      .catch(log.handleException('botUtil.showAllUsers'))
  },

  showShoppingList: ({ bot, event, db }) => {
    const altText = 'Shopping List'
    return db.getMerchandises()
      .then((merchandises) => bot.replyMessage(event.replyToken, makeCarouselTemplateMessage({ altText, merchandises })))
      .catch(log.handleException('botUtil.showShoppingList'))
  }
}

const makeCarouselTemplateMessage = ({ altText, merchandises }) => {
  return {
    type: 'template',
    altText,
    template: {
      type: 'carousel',
      columns: makeCarouselColumns({ merchandises }),
      imageAspectRatio: 'square'
    }
  }
}

const makeCarouselColumns = ({ merchandises }) => {
  return merchandises.map((merchandise) => {
    return {
      thumbnailImageUrl: `https://dummyimage.com/600x600/333333/ffffff.jpg&text=${merchandise.name}`,
      imageBackgroundColor: '#ff5555',
      title: `${merchandise.name.toUpperCase()}`,
      text: `${merchandise.name}, ${merchandise.price}pts/unit`,
      actions: [
        {
          type: 'postback',
          label: `Buy ${merchandise.name} with ${merchandise.price}pts`,
          data: `cmd=BUY&mid=${merchandise.id}`
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

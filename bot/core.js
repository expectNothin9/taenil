const line = require('@line/bot-sdk')
const db = require('../db/util')
const botLib = require('./lib')
const botUtil = require('./util')
const botAdminUtil = require('./utilAdmin')
const botDevUtil = require('./utilDev')
const log = require('../log')

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
  if (!matched) {
    return handleOperationCheck(event)
  }

  const command = matched[1]
  switch (command) {
    case 'MY_INFO':
      return botUtil.showUserInfo({ bot, event, db })
    case 'SHOPPING':
      return botUtil.showShoppingList({ bot, event, db })

    // ADMIN_ONLY
    case 'DEPOSIT':
      return botAdminUtil.addPointsToUser({ bot, event, db })
    case 'ALL_USERS':
      return botAdminUtil.showAllUsers({ bot, event, db })

    // DEV_ONLY
    case 'ADD_ME':
      return botUtil.addUser({ bot, event, db })
    case 'DELETE_ALL_USERS':
      return botDevUtil.deleteAllUsers({ bot, event, db })

    default:
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
  const info = botLib.getPostbackInfo(event)
  switch (info.cmd) {
    case 'BUY':
      return botUtil.buyMerchandisePrompt({ bot, event, db })

    case 'SET_MOBILE':
      return botUtil.setUserMobilePrompt({ bot, event, db })

    default:
      return Promise.resolve(null)
  }
}

function handleOperationCheck (event) {
  return botUtil.getUserOperation({ bot, event, db })
    .then((operation) => {
      switch (operation) {
        case 'SETTING_MOBILE':
          return botUtil.setUserMobile({ bot, event, db })

        default:
          return botUtil.echo({ bot, event })
      }
    })
    .catch(log.handleException('handleOperationCheck'))
}

const lineBotWebhookHandler = (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((exception) => {
      console.log(log.handleException('webhookHandler'))
      res.json({})
    })
}

module.exports = lineBotWebhookHandler

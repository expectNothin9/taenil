const log = require('../log')

const botDevUtil = {
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
  }
}

module.exports = botDevUtil

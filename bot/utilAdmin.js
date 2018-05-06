const log = require('../log')

const botAdminUtil = {
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
          return db.updateUserPoints({ name: users[0].name, points: toPoints })
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
  }
}

module.exports = botAdminUtil

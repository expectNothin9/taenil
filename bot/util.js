const log = require('../log')

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

  showShoppingList: ({ bot, event, db }) => {
    const altText = 'Shopping List'
    return db.getMerchandises()
      .then((merchandises) => bot.replyMessage(event.replyToken, makeCarouselTemplateMessage({ altText, merchandises })))
      .catch(log.handleException('botUtil.showShoppingList'))
  },

  showUserInfo: ({ bot, event, db }) => {
    const { source, replyToken } = event
    return db.getUsers({ id: source.userId })
      .then((users) => {
        if (users.length === 0) {
          // strange, user should already added when follow bot account
          throw new Error('db user record not found')
        } else if (users.length === 1) {
          return bot.replyMessage(replyToken, makeUserInfoTemplateMessage({ user: users[0] }))
        } else {
          throw new Error('db has multiple records with same LINE id')
        }
      })
      .catch(log.handleException('botUtil.addUser'))
  }
}

const makeUserInfoTemplateMessage = ({ user }) => {
  return {
    type: 'template',
    altText: 'UserInfo',
    template: {
      type: 'buttons',
      thumbnailImageUrl: `https://dummyimage.com/600x600/6cd36c/ffffff.jpg&text=${user.name}`,
      imageAspectRatio: 'square',
      imageSize: 'cover',
      imageBackgroundColor: '#ff5555',
      title: `${user.name}`,
      text: `mobile: ${user.mobile}\npoint: ${user.points}pts`,
      actions: [
        {
          type: 'postback',
          label: user.mobile ? 'Modify mobile' : 'Set mobile (MUST)',
          data: `cmd=SET_MOBILE&id=${user.id}`
        }
      ]
    }
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

module.exports = botUtil

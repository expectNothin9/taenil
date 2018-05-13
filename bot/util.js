const botLib = require('./lib')
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
          throw new Error('DB has multiple records with same LINE id')
        }
      })
      .catch(log.handleException('botUtil.addUser'))
  },

  buyConfirmPrompt: ({ bot, event, db }) => {
    const { replyToken } = event
    const info = botLib.getPostbackInfo(event)
    return db.getMerchandise({ id: info.mid })
      .then((merchandise) =>
        bot.replyMessage(replyToken, makeBuyConfirmTemplateMessage({ merchandise }))
      )
      .catch(log.handleException('botUtil.buyConfirmPrompt'))
  },

  echo: ({ bot, event, forceEchoText }) => {
    const { source, replyToken, message } = event
    const echoText = forceEchoText || message.text
    return bot.getProfile(source.userId)
      .then((profile) => profile.displayName)
      .then((userName) => bot.replyMessage(replyToken, {
        type: 'text',
        text: `${userName}, ${echoText}`
      }))
      .catch(log.handleException('botUtil.echo'))
  },

  getUserOperation: ({ bot, event, db }) => {
    const { source } = event
    return db.getUser({ id: source.userId })
      .then((user) => user.operation)
      .catch(log.handleException('botUtil.getUserOperation'))
  },

  setUserMobile: ({ bot, event, db }) => {
    const { source, message } = event
    return db.getUser({ id: source.userId })
      .then((user) => {
        if (/^\d{10}$/.test(message.text)) {
          return db.updateUserMobile({ id: user.id, mobile: message.text })
            .then((user) => botUtil.echo({
              bot, event, forceEchoText: `Mobile updated to ${message.text}.`
            }))
        } else {
          return db.updateUserOperation({ id: user.id, operation: 'NONE' })
            .then((user) => botUtil.echo({
              bot, event, forceEchoText: `${message.text}, invalid mobile format.`
            }))
        }
      })
      .catch(log.handleException('botUtil.setUserMobile'))
  },

  setUserMobilePrompt: ({ bot, event, db }) => {
    const { source } = event
    return db.getUser({ id: source.userId })
      .then((user) => {
        return db.updateUserOperation({ id: user.id, operation: 'SETTING_MOBILE' })
          .then((user) =>
            botUtil.echo({ bot, event, forceEchoText: 'Input mobile please.' })
          )
      })
      .catch(log.handleException('botUtil.setUserMobilePrompt'))
  },

  showShoppingList: ({ bot, event, db }) => {
    const altText = 'Shopping List'
    return db.getMerchandises()
      .then((merchandises) => bot.replyMessage(
        event.replyToken,
        makeCarouselTemplateMessage({ altText, merchandises })
      ))
      .catch(log.handleException('botUtil.showShoppingList'))
  },

  showUserInfo: ({ bot, event, db }) => {
    const { source, replyToken } = event
    return db.getUser({ id: source.userId })
      .then((user) => bot.replyMessage(replyToken, makeUserInfoTemplateMessage({ user })))
      .catch(log.handleException('botUtil.showUserInfo'))
  }
}

const makeUserInfoTemplateMessage = ({ user }) => {
  const dummyImageUrl = 'https://dummyimage.com/600x600/6cd36c/ffffff.jpg'
  return {
    type: 'template',
    altText: 'UserInfo',
    template: {
      type: 'buttons',
      thumbnailImageUrl: `${dummyImageUrl}&text=${user.name}`,
      imageAspectRatio: 'square',
      imageSize: 'cover',
      imageBackgroundColor: '#ff5555',
      title: `${user.name}`,
      text: `mobile: ${user.mobile}\npoint: ${user.points}pts`,
      actions: [
        {
          type: 'postback',
          label: user.mobile ? 'Modify mobile' : 'Set mobile (MUST)',
          data: 'cmd=SET_MOBILE'
        }
      ]
    }
  }
}

const makeBuyConfirmTemplateMessage = ({ merchandise }) => {
  const { name, price } = merchandise
  return {
    type: 'template',
    altText: 'BuyingConfirm',
    template: {
      type: 'confirm',
      text: `Are you sure to buy ${name}?\n It will cost ${price}pts.`,
      actions: [
        {
          type: 'postback',
          label: 'Yes',
          data: 'cmd=BUY_CONFIRMED'
        },
        {
          type: 'message',
          label: 'No',
          text: 'No'
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
  const dummyImageUrl = 'https://dummyimage.com/600x600/333333/ffffff.jpg'
  return merchandises.map((merchandise) => {
    return {
      thumbnailImageUrl: `${dummyImageUrl}&text=${merchandise.name}`,
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

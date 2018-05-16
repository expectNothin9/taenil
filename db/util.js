const models = require('./core')
// const log = require('./log')

const { Users, Merchandises, Orders } = models

// const initMerchandise = () => {
//   const candidates = [
//     { id: '001', name: 'A', price: 5 },
//     { id: '002', name: 'B', price: 4 },
//     { id: '003', name: 'C', price: 3 },
//     { id: '004', name: 'D', price: 12 }
//   ]
//   candidates.forEach((candidate) => {
//     const merchandise = new Merchandises(candidate)
//     merchandise.save()
//       .catch(log.handleException('initMerchandise'))
//   })
// }

// initMerchandise()

const db = {
  addUser: ({ id, name, mobile, points = 0, operation = 'NONE' }) => {
    const user = new Users({ id, name, mobile, points, operation })
    return user.save()
  },

  deleteUsers: ({ ...conditions } = {}) => {
    return conditions
      ? Users.remove({ ...conditions })
      : Users.remove({})
  },

  getUser: ({ ...conditions } = {}) => {
    if (!conditions) {
      throw new Error('Cannot getUser without conditions')
    }
    return Users.find({ ...conditions })
      .then((users) => {
        if (users.length === 0) {
          throw new Error('DB user record not found')
        } else if (users.length === 1) {
          return users[0]
        } else {
          throw new Error('DB has multiple user records with same conditions')
        }
      })
  },

  getUsers: ({ ...conditions } = {}) => {
    return conditions
      ? Users.find({ ...conditions })
      : Users.find({})
  },

  updateUserMobile: ({ mobile, ...conditions }) => {
    // will return FOUND record BEFORE value UPDATED
    return Users.findOneAndUpdate({ ...conditions }, { mobile, operation: 'NONE' })
  },

  updateUserOperation: ({ operation, ...conditions }) => {
    // will return FOUND record BEFORE value UPDATED
    return Users.findOneAndUpdate({ ...conditions }, { operation })
  },

  updateUserPoints: ({ points, ...conditions }) => {
    // will return FOUND record BEFORE value UPDATED
    return Users.findOneAndUpdate({ ...conditions }, { points })
  },

  getMerchandise: ({ ...conditions }) => {
    if (!conditions) {
      throw new Error('Cannot getMerchandise without conditions')
    }
    return Merchandises.find({ ...conditions })
      .then((merchandises) => {
        if (merchandises.length === 0) {
          throw new Error('DB merchandise record not found')
        } else if (merchandises.length === 1) {
          return merchandises[0]
        } else {
          throw new Error('DB has multiple merchandise records with same conditions')
        }
      })
  },

  getMerchandises: ({ ...conditions } = {}) => {
    return conditions
      ? Merchandises.find({ ...conditions })
      : Merchandises.find({})
  },

  createOrder: ({ userId, mid, qty = 1, price, shippingAddress = '' }) => {
    const createTs = Date.now()
    const status = 'NOT_SHIPPED'
    const order = new Orders({ userId, mid, qty, price, createTs, shippingAddress, status })
    return order.save()
  },

  getUserLatestOrder: ({ userId, ...conditions }) => {
    if (!userId) {
      throw new Error('Cannot getLatestOrder without userId')
    }
    // TOFIX: https://stackoverflow.com/questions/12467102/how-to-get-the-latest-and-oldest-record-in-mongoose-js-or-just-the-timespan-bet
    return Orders.find({ userId, ...conditions })
      .then((orders) => {
        if (orders.length === 0) {
          throw new Error('DB user latest order record not found')
        } else if (orders.length === 1) {
          return orders[0]
        } else {
          throw new Error('DB has multiple order records with same conditions')
        }
      })
  },

  getOrders: ({ ...conditions } = {}) => {
    return conditions
      ? Orders.find({ ...conditions })
      : Orders.find({})
  }
}

module.exports = db

const models = require('./core')
// const log = require('./log')

const { Users, Merchandises } = models

const addUser = ({ id, name, mobile, points = 0 }) => {
  const user = new Users({ id, name, mobile, points })
  return user.save()
}

const deleteUsers = ({ ...conditions } = {}) => {
  return conditions
    ? Users.remove({ ...conditions })
    : Users.remove({})
}

const getUsers = ({ ...conditions } = {}) => {
  return conditions
    ? Users.find({ ...conditions })
    : Users.find({})
}

const updateUserPoints = ({ points, ...conditions }) => {
  // will return FOUND record BEFORE value UPDATED
  return Users.findOneAndUpdate({ ...conditions }, { points })
}

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

const getMerchandises = ({ ...conditions } = {}) => {
  return conditions
    ? Merchandises.find({ ...conditions })
    : Merchandises.find({})
}

// initMerchandise()

const db = {
  addUser,
  deleteUsers,
  getUsers,
  updateUserPoints,
  getMerchandises
}

module.exports = db

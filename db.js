const mongoose = require('mongoose')
// const log = require('./log')

// DB
mongoose.connect(process.env.MONGODB_URI)
const DB = mongoose.connection
DB.on('error', (err) => { console.log('DB', err) })
DB.once('open', () => { console.log('DB opened') })

const UserDBSchema = new mongoose.Schema({
  lineId: String,
  lineName: String,
  points: { type: Number, min: 0 }
})
const Users = mongoose.model('DBUsers', UserDBSchema)
// Clear out old data
// Users.remove({}, function (err) {
//   if (err) {
//     console.log('error deleting old data.')
//   }
// })

const addUser = ({ lineId, lineName, points = 0 }) => {
  const user = new Users({ lineId, lineName, points })
  return user.save()
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

const MerchandiseDBSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: { type: Number, min: 0 }
})
const Merchandises = mongoose.model('DBMerchandises', MerchandiseDBSchema)
// Clear out old data
// Merchandises.remove({}, function (err) {
//   if (err) {
//     console.log('error deleting old data.')
//   }
// })

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
  Users,
  addUser,
  getUsers,
  updateUserPoints,
  Merchandises,
  getMerchandises
}

module.exports = db

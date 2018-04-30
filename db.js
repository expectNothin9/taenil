const mongoose = require('mongoose')

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

const db = {
  Users,
  addUser,
  getUsers,
  updateUserPoints
}

module.exports = db

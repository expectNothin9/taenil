const mongoose = require('mongoose')

// DB
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
db.on('error', (err) => { console.log('db', err) })
db.once('open', () => { console.log('db opened') })

const UserDBSchema = new mongoose.Schema({
  lineId: String,
  lineName: String,
  points: { type: Number, min: 0 }
})
const Users = mongoose.model('DBUsers', UserDBSchema)
// Clear out old data
Users.remove({}, function (err) {
  if (err) {
    console.log('error deleting old data.')
  }
})

const addUser = ({ lineId, lineName, points = 0 }) => {
  const user = new db.Users({ lineId, lineName, points })
  return user.save()
}

const DB = {
  Users,
  addUser
}

module.exports = DB

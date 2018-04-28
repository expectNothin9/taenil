const mongoose = require('mongoose')

// DB
mongoose.connect('mongodb://localhost/HelloMongoose')
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
// DBUsers.remove({}, function(err) {
//   if (err) {
//     console.log ('error deleting old data.');
//   }
// })

const DB = {
  Users
}

module.exports = DB

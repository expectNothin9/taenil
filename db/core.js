const mongoose = require('mongoose')

// DB connection
mongoose.connect(process.env.MONGODB_URI)
const DB = mongoose.connection
DB.on('error', (err) => { console.log('DB', err) })
DB.once('open', () => { console.log('DB opened') })

// Users
const UserDBSchema = new mongoose.Schema({
  id: String,
  name: String,
  mobile: String,
  points: { type: Number, min: 0 },
  operation: { type: String, enum: ['NONE', 'SETTING_MOBILE'] }
})
const Users = mongoose.model('DBUsers', UserDBSchema)

// Merchandises
const MerchandiseDBSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: { type: Number, min: 0 }
})
const Merchandises = mongoose.model('DBMerchandises', MerchandiseDBSchema)

// Orders
// const OrderDBSchema = new mongoose.Schema({
//   id: String,
//   mid: String,
//   price: { type: Number, min: 0 }
// })

const models = {
  Users,
  Merchandises
}

module.exports = models

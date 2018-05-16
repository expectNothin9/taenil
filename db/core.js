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
const OrderDBSchema = new mongoose.Schema({
  userId: String,
  mid: String,
  qty: { type: Number, min: 1 },
  price: { type: Number, min: 0 },
  createTs: Number,
  shippingAddress: String,
  status: { type: String, enum: ['NOT_SHIPPED', 'SHIPPED'] }
})
const Orders = mongoose.model('DBOrders', OrderDBSchema)

const models = {
  Users,
  Merchandises,
  Orders
}

module.exports = models

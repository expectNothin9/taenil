import * as Redis from 'ioredis'
import * as dotenv from 'dotenv'

dotenv.config()
const REDIS_URL = process.env.REDIS_URL
const redis = new Redis(REDIS_URL)

const images = [
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/123263191_769506973607994_2359149955771110188_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=wPxcSjSznBQAX9yCW-b&tp=1&oh=7ecaacb9619e6f5d0528c8e11dc09555&oe=5FF6CCA5",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.180.1440.1440a/s640x640/122449946_356304902139231_3808260020124454688_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=9yHmrY3we1kAX8hJ4mF&tp=1&oh=967626ff3009d63d7b8c253233a80c91&oe=5FF6FBB5",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/122764337_2968770816691123_2278714474160768516_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=107&_nc_ohc=DCeqgL9eqgQAX87KiDV&tp=1&oh=53a4d71bbfc01c5aa2578c3a0ccc9dd9&oe=5FF88195",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.180.1440.1440a/s640x640/122807458_361845205065127_837583111793177519_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=107&_nc_ohc=WeiBB37gQXUAX-jEnnR&tp=1&oh=1af1c3d5074238506f466b7638899d68&oe=5FF5AA07",
]
images.reverse()

const key = '_BPM_20201218_'
const value = {
  id: '_BPM_20201218_',
  candidates: images.map((image, idx) => ({
    id: idx,
    image,
    compete: 0,
    win: 0
  }))
}

const run = async() => {
  // await redis.del('foo')
  await redis.set(key, JSON.stringify(value))
  const redisValue = await redis.get(key)
  console.log('redisValue', redisValue)
}

run()

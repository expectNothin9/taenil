import fetch from 'node-fetch'

// const debug = require('debug')('R:whistling')

let IMAGES = ['https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/129060059_215457286655216_6062865869436442074_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=Iat2_GsVGy8AX8OruLy&tp=1&oh=622990499e73a3b39382d7aebc853f21&oe=5FF4BD93']

const IG_URL = 'https://www.instagram.com/timliaoig.beauty/'
const IMAGE_DISPLAY_URL_PATTERN = /"display_url":"https:\/\/instagram[^"]*"/g
const IMAGE_PATTERN = /https:\/\/instagram[^"]*/
async function prepareImages () {
  const igHtml = await fetch(IG_URL).then((resp) => resp.text())
  const matchedList = igHtml.match(IMAGE_DISPLAY_URL_PATTERN)
  IMAGES = matchedList.map((rawUrl) => {
    const imageUrl = rawUrl.match(IMAGE_PATTERN)
    return imageUrl[0].replace(/\\u0026/g, '&')
  })
}

// 1st images preparation
prepareImages()

export const whistlingHandler = async (req, res) => {
  const randIdx = Math.floor(Math.random() * IMAGES.length)
  const imageUrl = IMAGES[randIdx]
  const fetchResp = await fetch(imageUrl)
  const buffer = await fetchResp.buffer()
  res.set('Content-Type', 'image/jpeg')
  res.send(buffer)
}

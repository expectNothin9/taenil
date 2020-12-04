import fetch from 'node-fetch'

const debug = require('debug')('R:whistling')

let IMAGES = ['https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/fr/e15/s1080x1080/125424284_196841928624306_4631520509297317428_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=CxVQFWbeKRMAX-g1EnW&tp=1&oh=0d09e8a73dd2acabd149f00077caf88f&oe=5FF3E03C']

const IG_URL = 'https://www.instagram.com/timliaoig.beauty/'
const IMAGE_DISPLAY_URL_PATTERN = /"display_url":"https:\/\/instagram[^"]*"/g
const IMAGE_PATTERN = /https:\/\/instagram[^"]*/
async function prepareImages (): Promise<string[]> {
  debug('--> prepareImages')
  const igHtml = await fetch(IG_URL).then((resp) => resp.text())
  debug(igHtml)
  const matchedList = igHtml.match(IMAGE_DISPLAY_URL_PATTERN)
  debug(matchedList)
  return matchedList.map((rawUrl) => {
    const imageUrl = rawUrl.match(IMAGE_PATTERN)
    return imageUrl[0].replace(/\\u0026/g, '&')
  })
}

export const whistlingHandler = async (req, res) => {
  if (IMAGES.length === 1) {
    try {
      IMAGES = await prepareImages()
      debug('--> prepareImages success')
    } catch (error) {
      debug('--> prepareImages exception', error)
    }
  }
  const randIdx = Math.floor(Math.random() * IMAGES.length)
  const imageUrl = IMAGES[randIdx]
  const fetchResp = await fetch(imageUrl)
  const buffer = await fetchResp.buffer()
  res.set('Content-Type', 'image/jpeg')
  res.send(buffer)
}

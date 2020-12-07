import * as puppeteer from 'puppeteer'
import * as path from 'path'

const debug = require('debug')('R:scraper')

const IG_URL = 'https://www.instagram.com/timliaoig.beauty/'

export const scrapIgHandler = async (req, res) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })
  await page.goto(IG_URL, {
    waitUntil: ['load', 'networkidle0', 'domcontentloaded']
  })
  const IMAGES = await page.evaluate(() => {
    const images = []
    const imgElements = document.querySelectorAll('article div > img')
    imgElements.forEach((img) => {
      images.push(img.getAttribute('src'))
    })
    return images
  })
  // await page.screenshot({path: path.join(__dirname, '../..', 'example.png')})
  res.send(JSON.stringify(IMAGES, null, 2))
}

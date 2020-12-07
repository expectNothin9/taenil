import * as puppeteer from 'puppeteer'
import * as path from 'path'

const debug = require('debug')('R:scraper')

const PUBLIC_PATH = path.join(__dirname, '../..', 'public')

const IG_LOGIN_URL = 'https://www.instagram.com/accounts/login/'
const IG_URL = 'https://www.instagram.com/timliaoig.beauty/'
const IG = {
  acc: process.env.IG_ACC,
  pwd: process.env.IG_PWD
}


export const scrapIgHandler = async (req, res) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })

  // login
  await page.goto(IG_LOGIN_URL, {
    waitUntil: ['load', 'networkidle0', 'domcontentloaded']
  })
  await page.focus('input[name=username]')
  await page.keyboard.type(IG.acc)
  await page.focus('input[name=password]')
  await page.keyboard.type(IG.pwd)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(3000)

  // scrap images
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
  debug('AFTER await page.evaluate')
  await page.screenshot({ path: path.join(PUBLIC_PATH, 'example.png') })
  res.send(JSON.stringify(IMAGES, null, 2))
}

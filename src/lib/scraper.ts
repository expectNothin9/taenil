import * as puppeteer from 'puppeteer'
import * as path from 'path'
import { Request, Response } from 'express'
import makeDebug from 'debug'

const debug = makeDebug('R:scraper')

export const SNAPSHOT_PATH = path.join(__dirname, '../..', 'snapshot')

const IG_LOGIN_URL = 'https://www.instagram.com/accounts/login/'
const IG_URL = 'https://www.instagram.com/'
const IG = {
  acc: process.env.IG_ACC,
  pwd: process.env.IG_PWD
}

export const scrapIgHandler = async (req: Request, res: Response): Promise<void> => {
  const { id = 'timliaoig.beauty' } = req.params
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
  let IMAGES = []
  const targetUrl = `${IG_URL}${id}`
  try {
    await page.goto(targetUrl, {
      waitUntil: ['load', 'networkidle0', 'domcontentloaded']
    })
  } catch (error) {
    debug(`page.goto ${targetUrl} failed`, error)
    res.status(500).json({ error })
    return
  }

  IMAGES = await page.evaluate(() => {
    const images = []
    const imgElements = document.querySelectorAll('article div > img')
    imgElements.forEach((img) => {
      images.push(img.getAttribute('src'))
    })
    return images
  })

  await page.screenshot({ path: path.join(SNAPSHOT_PATH, 'log.png') })
  res.json({ images: IMAGES })
}

import fetch from 'node-fetch'

const debug = require('debug')('R:whistling')

let initialized = false
let IMAGES = [
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/129060059_215457286655216_6062865869436442074_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=Iat2_GsVGy8AX8OruLy&tp=1&oh=622990499e73a3b39382d7aebc853f21&oe=5FF4BD93',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/129060059_215457286655216_6062865869436442074_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=Iat2_GsVGy8AX8OruLy&tp=1&oh=622990499e73a3b39382d7aebc853f21&oe=5FF4BD93',
  'https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/e35/s1080x1080/129610437_147409870050983_7968674528460593709_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=111&_nc_ohc=zjGcsuaL6okAX_74yN1&tp=1&oh=cf441cbf99324dd6505d907e3781c7eb&oe=5FF26A65',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/128640322_391991862115575_1359175558711997182_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=BYZKa9uJFPoAX8VwQOs&tp=1&oh=6e5bb60c741b9da9a017022fcab12e46&oe=5FF32D5E',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/128640322_391991862115575_1359175558711997182_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=BYZKa9uJFPoAX8VwQOs&tp=1&oh=6e5bb60c741b9da9a017022fcab12e46&oe=5FF32D5E',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/128705483_886617318744617_5527222558638033270_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=105&_nc_ohc=Icz-8qDGawAAX8I5-ea&tp=1&oh=b5f4a018cd084f50b633e69e10248a72&oe=5FF2EA9F',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e15/128537637_388779309107021_84447186478213937_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=105&_nc_ohc=7clWtsznCxMAX-AO7KP&tp=1&oh=0469d5ee1f47e3d8562f4dd80aa9785f&oe=5FF349C0',
  'https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/127604017_372338830693653_2207798435492586644_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=109&_nc_ohc=DtYPM_5sk0wAX8zxM58&tp=1&oh=748711186e880dd89ae77dc51cb98f13&oe=5FF29254',
  'https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/127604017_372338830693653_2207798435492586644_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=109&_nc_ohc=DtYPM_5sk0wAX8zxM58&tp=1&oh=748711186e880dd89ae77dc51cb98f13&oe=5FF29254',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/128157275_682955635740895_5951271873139283897_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=107&_nc_ohc=hE1VVpc7VacAX94qhnB&tp=1&oh=40a415de6d648f5dca86dbed408b2ce6&oe=5FF36BD4',
  'https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/126901233_762829984576837_4966476486821014927_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=101&_nc_ohc=Ulp0qEKGIh4AX_NrDbs&tp=1&oh=bb82f1617dc93621555a46fbcde7cb55&oe=5FF36754',
  'https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/126901233_762829984576837_4966476486821014927_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=101&_nc_ohc=Ulp0qEKGIh4AX_NrDbs&tp=1&oh=bb82f1617dc93621555a46fbcde7cb55&oe=5FF36754',
  'https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/127185824_374966933767692_8700050114737925098_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=100&_nc_ohc=AUpZJpJT_MYAX8Oc6ia&tp=1&oh=4d9f0249a9af1917d94c07c7aa63a62e&oe=5FF3361D',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/126856210_1355949664755451_735404090630817605_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=107&_nc_ohc=NYtZ_p19jdQAX-CIZzu&tp=1&oh=bff5ac77b5ac740b0e21ed6cadec6e46&oe=5FF4D45E',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/126872164_444975186900642_2575065639717451534_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=v9H8XGQ0dqsAX-eN8DV&tp=1&oh=287bbfb35dba4e0796f2c6c2d4291de4&oe=5FF37977',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/126872164_444975186900642_2575065639717451534_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=v9H8XGQ0dqsAX-eN8DV&tp=1&oh=287bbfb35dba4e0796f2c6c2d4291de4&oe=5FF37977',
  'https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/e35/126907309_471341483830706_5505973112165390693_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=102&_nc_ohc=X2j9I0AQfmYAX99Zzgj&tp=1&oh=e9c346e1e8d23bbd40454d6ba90bb677&oe=5FF35A07',
  'https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/125948565_349583476394185_7071920181371036706_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=101&_nc_ohc=Usrc29mGllkAX_W0qQJ&tp=1&oh=5015e31f4b705cb7e41a9a8f4480083d&oe=5FF481BA',
  'https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/125948565_349583476394185_7071920181371036706_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=101&_nc_ohc=Usrc29mGllkAX_W0qQJ&tp=1&oh=5015e31f4b705cb7e41a9a8f4480083d&oe=5FF481BA',
  'https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/126857372_716588945627318_2961253738658315677_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=102&_nc_ohc=TZPlQI-DRMUAX_wqfM2&tp=1&oh=010e15cfd951a127fc8d42f63a1e430a&oe=5FF2F7D2',
  'https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/126380860_432875921209298_1808808599555118137_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=102&_nc_ohc=EdorlISaqv0AX-yzLzw&tp=1&oh=5628e8d331ac5f06459baf5bc5519e74&oe=5FF4FA02',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/126279550_377961313629955_5920492526849132257_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=107&_nc_ohc=mGz4F8eZ7-sAX-HvJQD&tp=1&oh=ec4a9008398bb8161476243b94854419&oe=5FF4EDC9',
  'https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/127084983_3568389566551510_8668190763907501457_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=110&_nc_ohc=JenQzdc6rr8AX9ieNtl&tp=1&oh=c3e9076d5b5c4732c0fb808c3276ca2a&oe=5FF51135',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/125828650_375611216847855_2765591406498732664_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=OQldfH6z7T0AX9_RcPm&tp=1&oh=51f612cea5caf7bb57f1f9d53cb2aba8&oe=5FF39F68',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/125828650_375611216847855_2765591406498732664_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=OQldfH6z7T0AX9_RcPm&tp=1&oh=51f612cea5caf7bb57f1f9d53cb2aba8&oe=5FF39F68',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/125883131_709521546341356_6094621987208282232_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=95f3XVlJPOkAX9WEPk5&tp=1&oh=d8051b9cdc2c1c92b0ea3fc4c454f810&oe=5FF51E4E',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/fr/e15/s1080x1080/125424284_196841928624306_4631520509297317428_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=CxVQFWbeKRMAX-g1EnW&tp=1&oh=0d09e8a73dd2acabd149f00077caf88f&oe=5FF3E03C',
  'https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/fr/e15/s1080x1080/125441041_131276851776322_61846920766688626_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=110&_nc_ohc=-TDLQfEbHbsAX-nkSpV&tp=1&oh=6386ff4ca51d0d9f525978cbd5312d24&oe=5FF45DFA',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/125184712_126197435699036_3230385583016309536_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=r9wRXzyr8f8AX-yjXa_&tp=1&oh=6bcc2687c9a8469e5474670ee98ac65d&oe=5FF4F1C3',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/125184712_126197435699036_3230385583016309536_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=r9wRXzyr8f8AX-yjXa_&tp=1&oh=6bcc2687c9a8469e5474670ee98ac65d&oe=5FF4F1C3',
  'https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/e35/s1080x1080/124999555_193298892276047_3129392142087476948_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=111&_nc_ohc=dHfti6DvItMAX-dVIX6&tp=1&oh=fff1f5266dba22cba572c91839f072ab&oe=5FF2DD6B',
  'https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/e35/s1080x1080/125190983_202757381226718_6097409375387164658_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=110&_nc_ohc=bQMR6zlB6iMAX_ZY-oK&tp=1&oh=2f3bca8e83b59a3ced522871ce4306b7&oe=5FF1AA6C',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/124884587_899860710857704_3355869962232623422_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=w8Bj7s3v3bcAX_kZUgm&tp=1&oh=cecc59d59fc5593d6f2a1c23ca357f19&oe=5FF38D72',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/124884587_899860710857704_3355869962232623422_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=w8Bj7s3v3bcAX_kZUgm&tp=1&oh=cecc59d59fc5593d6f2a1c23ca357f19&oe=5FF38D72',
  'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/124851256_439664200358019_2585051340671846520_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=Qry-4mXBuL8AX-PFiCk&tp=1&oh=7b3a1e27ea8b235aa60651a93cb908e8&oe=5FF3B86F'
]

const IG_URL = 'https://www.instagram.com/timliaoig.beauty/'
const IMAGE_DISPLAY_URL_PATTERN = /"display_url":"https:\/\/instagram[^"]*"/g
const IMAGE_PATTERN = /https:\/\/instagram[^"]*/
async function prepareImages (): Promise<string[]> {
  debug('--> prepareImages')
  const igHtml = await fetch(IG_URL).then((resp) => resp.text())
  const matchedList = igHtml.match(IMAGE_DISPLAY_URL_PATTERN)
  return matchedList.map((rawUrl) => {
    const imageUrl = rawUrl.match(IMAGE_PATTERN)
    return imageUrl[0].replace(/\\u0026/g, '&')
  })
}

export const whistlingHandler = async (req, res) => {
  if (!initialized) {
    initialized = true
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

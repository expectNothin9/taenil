import fetch from 'node-fetch'
import { Request, Response } from 'express'
// import makeDebug from 'debug'

// const debug = makeDebug('R:whistling')

const IMAGES = [
  "https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/129767558_294891661922770_3300864178769475444_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=110&_nc_ohc=O_ecJMDzVjsAX8M9byr&tp=1&oh=74bb113f04aa21ba0cd727960113dad0&oe=5FF80F0D",
"https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e15/c0.90.720.720a/s640x640/129767560_679157409449315_4449038080473098712_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=lO0NGishr7MAX-pc6t3&tp=1&oh=158062760f836b8ae05d8989b66dbff4&oe=5FF6E274",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e15/c0.90.720.720a/s640x640/129728188_715335752425216_526392071383016307_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=eWeRbk1N55EAX_8IDgG&tp=1&oh=0840aa0b00bb7a6ca3f25b3a4cfddca2&oe=5FF73B25",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e15/c0.90.720.720a/s640x640/129641449_376624290233959_5124986133501222664_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=z6ZCBhOraQsAX8_2J71&tp=1&oh=09f5f53c830a4167444e2374d56438d5&oe=5FF9411E",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/129060059_215457286655216_6062865869436442074_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=iDuAAgKfRXUAX--BH-M&tp=1&oh=a9a92813afa6a838f3cbd4f7f43a5bd6&oe=5FF90FA9",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.180.1440.1440a/s640x640/128640322_391991862115575_1359175558711997182_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=i4wdymu5FAsAX8Z79aQ&tp=1&oh=d30cd1c3c0cd180424a6f5f2a92d3cbf&oe=5FF85CFA",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e15/c0.90.720.720a/s640x640/128537637_388779309107021_84447186478213937_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=105&_nc_ohc=9DrjjhWPp_IAX9w0tIW&tp=1&oh=f2cde2233fc73b5859f6398e2abc35d6&oe=5FF75F9C",
  "https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.180.1440.1440a/s640x640/127604017_372338830693653_2207798435492586644_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=109&_nc_ohc=mG7lV9RwDuwAX_ecSuP&tp=1&oh=857e7a6c65314362c5f5cc840a46f998&oe=5FF6D5F8",
  "https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.180.1440.1440a/s640x640/126901233_762829984576837_4966476486821014927_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=101&_nc_ohc=klvctBBXgEsAX-3MYZP&tp=1&oh=b24531c3e1068ca6aa8fb804d1fd03fb&oe=5FF8FAF8",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/126872164_444975186900642_2575065639717451534_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=0wbB7AG2LcoAX9zzBiG&tp=1&oh=4db4b0b25f6acb689e42fdddd2687a71&oe=5FF647CD",
  "https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.180.1440.1440a/s640x640/125948565_349583476394185_7071920181371036706_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=101&_nc_ohc=EWe-3dyZgpkAX-SnQg3&tp=1&oh=36a8ba3a74a81906fe8bf9396176a291&oe=5FF8241E",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.180.1440.1440a/s640x640/125828650_375611216847855_2765591406498732664_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=EHHaPz8rrMEAX-7WbrL&tp=1&oh=3e6dae12151c197b28dad4872b8cb696&oe=5FF871C4",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/125424284_196841928624306_4631520509297317428_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=cCW_A3MG93MAX-5kr1z&tp=1&oh=9dadc0bb01bc67733776667d9a9c28b2&oe=5FF77973",
  "https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/e15/c180.0.720.720a/s640x640/125441041_131276851776322_61846920766688626_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=110&_nc_ohc=KuVBiV1LV5IAX_sJWDq&tp=1&oh=5e1832901ac427b36b0399c33b48ba24&oe=5FF5C789",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/125184712_126197435699036_3230385583016309536_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=PxF4q9nGQf0AX9eH4Uj&tp=1&oh=58db4447d8880e2a9ee860d2df73c58b&oe=5FF609F9",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.180.1440.1440a/s640x640/124884587_899860710857704_3355869962232623422_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=ODWbDLKGRasAX9nimAJ&tp=1&oh=cc2742890d2844bc8723c7fa1943cded&oe=5FF898D6",
  "https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.180.1440.1440a/s640x640/124267533_364143271477586_303647286434977102_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=102&_nc_ohc=MKM6xS1FwV0AX9rYX5G&tp=1&oh=a541e8dda5bc97efdad4dfbf3021df2b&oe=5FF7E7F9",
  "https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.125.1440.1440a/s640x640/124185092_1414566285545002_7914913424158868878_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=110&_nc_ohc=zHlkPkB-DJUAX8yWnDO&tp=1&oh=237c3a242ae6dfa43e3b5b6c59d03540&oe=5FF955E8",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/123196422_2770292019877697_4559603521541557065_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=105&_nc_ohc=gqFHAjjp7FYAX83qLJQ&tp=1&oh=1913256cbb2535d1e950863cd4c53856&oe=5FF6EDD2",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e15/c0.90.720.720a/s640x640/123439244_372714677312216_5773464815646381894_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=-6YULKRGIb0AX9tCjjG&tp=1&oh=5eb97b4f8c1e32638daa9a193632729e&oe=5FF7E085",
  "https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/e15/c0.90.720.720a/s640x640/123265569_366754054750957_965066978699242568_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=101&_nc_ohc=iTtl2SZ__wQAX9Bk9RB&tp=1&oh=2f75b19e40088a694f006b1fff46ae23&oe=5FF64A35",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/123263191_769506973607994_2359149955771110188_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=wPxcSjSznBQAX9yCW-b&tp=1&oh=7ecaacb9619e6f5d0528c8e11dc09555&oe=5FF6CCA5",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.180.1440.1440a/s640x640/122449946_356304902139231_3808260020124454688_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=9yHmrY3we1kAX8hJ4mF&tp=1&oh=967626ff3009d63d7b8c253233a80c91&oe=5FF6FBB5",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/122764337_2968770816691123_2278714474160768516_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=107&_nc_ohc=DCeqgL9eqgQAX87KiDV&tp=1&oh=53a4d71bbfc01c5aa2578c3a0ccc9dd9&oe=5FF88195",
  "https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.180.1440.1440a/s640x640/122807458_361845205065127_837583111793177519_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=107&_nc_ohc=WeiBB37gQXUAX-jEnnR&tp=1&oh=1af1c3d5074238506f466b7638899d68&oe=5FF5AA07",
  "https://instagram.ftpe12-2.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.180.1440.1440a/s640x640/122786482_870097313731106_7580464501479510103_n.jpg?_nc_ht=instagram.ftpe12-2.fna.fbcdn.net&_nc_cat=102&_nc_ohc=LdS76cAWWOQAX_lUwo-&tp=1&oh=52bd0f14986f95aef13d4e7533ce41be&oe=5FF8F02B"
]

export const whistlingHandler = async (req: Request, res: Response): Promise<void> => {
  const randIdx = Math.floor(Math.random() * IMAGES.length)
  const imageUrl = IMAGES[randIdx]
  const fetchResp = await fetch(imageUrl)
  const buffer = await fetchResp.buffer()
  res.set('Content-Type', 'image/jpeg')
  res.send(buffer)
}

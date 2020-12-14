import makeDebug from 'debug'

import { shuffle } from '../util/array'

const debug = makeDebug('R:lib:beautyPageant')

const IMAGES = [
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.150.1200.1200a/s640x640/130453120_374293930539024_8636544064152452062_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=100&_nc_ohc=Q3KacUKhZqkAX82ddBW&tp=1&oh=eae4cb6f5ee793f8f1e54ad4aab44dff&oe=5FF93500",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.150.1200.1200a/s640x640/130423357_190767439377860_3785195638661499445_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=108&_nc_ohc=PWFtfjMpzpEAX_FRQIS&tp=1&oh=8789a979155e61ed0900ac04f8e0b363&oe=5FF88A90",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.150.1200.1200a/s640x640/129790846_384216276219771_6271027194454684085_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=103&_nc_ohc=7C4W6N8SRhQAX_haGiR&tp=1&oh=10ffd1555398522e75a18a88efa1c91d&oe=5FF9ECCA",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.150.1200.1200a/s640x640/130090865_1087469625028833_8599711034213846053_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=1&_nc_ohc=SIUtINdxuisAX_OPRGR&tp=1&oh=efc22d95eb800f0357fdc49990d8e85e&oe=5FF9923F",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.150.1200.1200a/s640x640/129048379_437476327245145_7645122037223957206_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=101&_nc_ohc=kBvjB9MOjA8AX8WgeVW&tp=1&oh=4601f0e137f1e1caddf8d4f42981e7e2&oe=5FF8EF7E",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.149.1198.1198a/s640x640/129086906_823661331764362_1245653512683751353_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=110&_nc_ohc=xCJNoDTy4h8AX_0E_ej&tp=1&oh=20f45094d073a68ffbd1226b106baca7&oe=5FFBBA99",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.149.1198.1198a/s640x640/128958185_3456311907757847_8362672217021368336_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=111&_nc_ohc=FZUtZ-PgpjsAX_vt8cV&tp=1&oh=3390c9156d245424056f1994da819a4c&oe=5FFB195E",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.150.1200.1200a/s640x640/128467014_131153028591841_6161495877222459235_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=1&_nc_ohc=sK6U8ajc92QAX9YVL1V&tp=1&oh=1aaab86d74a4eaead2a6dbed5ea9c937&oe=5FF8C538",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.148.1196.1196a/s640x640/128271478_2073509589452894_4713776431105007392_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=102&_nc_ohc=XaG5AqSXChYAX8NKnDT&tp=1&oh=eb4342ea972cf91ddcd927f99d07e4be&oe=5FF85C37",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.63.1074.1074a/s640x640/127764244_221069509429366_3330904439129549721_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=110&_nc_ohc=BBTXqU4NI0cAX9rPUAJ&tp=1&oh=c5b2dc2af08420e2cdb9c527facb2355&oe=5FF8E4FD",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.150.1200.1200a/s640x640/128049571_418339342523394_7631087936465821398_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=106&_nc_ohc=APmdrXHWCg0AX-5K262&tp=1&oh=e77b87d6198a0d81697860b4bc7b1966&oe=5FF8E061",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.150.1200.1200a/s640x640/127609929_293436198669844_649513454305910907_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=104&_nc_ohc=Pds19deFMPwAX-pI9Ht&tp=1&oh=3d9a3a373ae4722d2ab34992af33f9b1&oe=5FF88313",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.147.1197.1197a/s640x640/127822893_800826930648043_9001176962434505314_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=107&_nc_ohc=szaqRkUzDdAAX9s55y7&tp=1&oh=b20d70c4857a4ec70030ad814afffde4&oe=5FFB7284",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.150.1200.1200a/s640x640/127134056_817309589018664_8116980940655278215_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=100&_nc_ohc=n3G6OT16cgkAX-YIKwV&tp=1&oh=44bfe047ee9a93f8f4a1a165b1866b56&oe=5FFA8E6A",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.180.1440.1440a/s640x640/127153892_672744240278998_5210052207068794649_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=110&_nc_ohc=iZnS7E8jrekAX-vNQYT&tp=1&oh=7f134e273c78b63e15a00800a0ac574f&oe=5FF9C389",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.142.1189.1189a/s640x640/127018710_737618697109871_6312166895299158733_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=111&_nc_ohc=AgAveNBfvIMAX-OetjA&tp=1&oh=fc0e64ea2dc20836868831e26d484340&oe=5FFAD6F6",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.150.1200.1200a/s640x640/126858333_732909200671432_4288179092775728596_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=104&_nc_ohc=T1bgaOzTteYAX-gtAGU&tp=1&oh=4e5c5b20f7d765fb7cadeb038a0f2398&oe=5FF8C819",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.150.1200.1200a/s640x640/126817181_399233591499508_7393840702085501418_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=104&_nc_ohc=g1KLtIr4qlkAX_uTT4x&tp=1&oh=a1803b876e0c2a46bbef0e24dd24de1f&oe=5FF972AF",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c54.0.728.728a/s640x640/126597505_710706666226990_1020583486429456352_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=110&_nc_ohc=R1FNwDC41c4AX_j-07J&tp=1&oh=699214b26bffd03aa73ee214cc8916e6&oe=5FFA00B7",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.150.1200.1200a/s640x640/126056273_379524379930255_3630850582303804778_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=107&_nc_ohc=FR_v3nzx-r4AX97B4Jr&tp=1&oh=f3b5224b7fa18e655998f35ad425d5a3&oe=5FFA0A90",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/s640x640/126262186_849549492521009_3274474543883311883_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=105&_nc_ohc=92D5nCQNeM8AX-9O7dc&tp=1&oh=adfefff8c77669d4260ce5c93eb9b015&oe=5FF96523",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.150.1200.1200a/s640x640/125937221_408307656866986_209599750039119339_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=110&_nc_ohc=0qJMUnen9LYAX8Y9K7M&tp=1&oh=f4fb7090a2552f3caa85c0f66b01e189&oe=5FFB4ABB",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.180.1440.1440a/s640x640/126096992_843648699730979_4346843372372662909_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=111&_nc_ohc=uCKdq2eEa1sAX96ReFx&tp=1&oh=5490084f6ca964f5a771cb924857d19b&oe=5FFB1AFB",
  "https://scontent-iad3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c0.150.1200.1200a/s640x640/125491505_862373761240312_1588689190560450789_n.jpg?_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=104&_nc_ohc=wEjO5nBIkqIAX8lYBJJ&tp=1&oh=5bd7c28d2b3cb878237ec02ee9ef6a0d&oe=5FF94EA6",
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

interface Candidate {
  id: number
  image: string
  compete: number
  win: number
}

class BeautyPageant {
  candidates: Candidate[]
  constructor (images: string[]) {
    this.candidates = this.initializeCandidates(images)
  }

  initializeCandidates (images: string[]): Candidate[] {
    return images.map((image: string, idx: number) => ({
      id: idx,
      image,
      compete: 0,
      win: 0
    }))
  }

  randomCandidates (): Candidate[] {
    const shuffledCandidates = shuffle([ ...this.candidates ])
    return shuffledCandidates.slice(0, 2)
  }

  recordMatch (match: string , win: string): string {
    const candidateIdsInMatch = match.split(',').map((candidate) => parseInt(candidate))
    const parsedWin = parseInt(win)
    let stats = '💌'
    this.candidates = this.candidates.map((candidate) => {
      if (candidateIdsInMatch.includes(candidate.id)) {
        const accumulatedCompete = candidate.compete + 1
        const accumulatedWin = parsedWin === candidate.id
          ? candidate.win + 1
          : candidate.win
        stats += `\nNo.${candidate.id} 妹: ${accumulatedWin}/${accumulatedCompete}`
        return {
          ...candidate,
          compete: accumulatedCompete,
          win: accumulatedWin
        }
      }
      return candidate
    })
    return stats
  }
}

const beautyPageant = new BeautyPageant(IMAGES)

export default beautyPageant
import fetch from 'node-fetch'

const IMGS = [
  'https://scontent-tpe1-1.cdninstagram.com/v/t51.2885-15/e35/p1080x1080/87425772_2703110383268377_4684297388610703991_n.jpg?_nc_ht=scontent-tpe1-1.cdninstagram.com&_nc_cat=101&_nc_ohc=O9XRzUdyUrsAX-NUZC_&tp=1&oh=574c2b18ef4adcc10a36c891de9a662b&oe=5FF28E50',
  'https://scontent-tpe1-1.cdninstagram.com/v/t51.2885-15/e35/p1080x1080/128680433_106557717971760_5102409623079958239_n.jpg?_nc_ht=scontent-tpe1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=H4RQhxqEleAAX_pTn4R&tp=1&oh=f89b5dde36b4654ee6fdfe4dc3fef9d8&oe=5FF0D80D',
  'https://scontent-tpe1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/125828091_1030296284110333_8118001626913372552_n.jpg?_nc_ht=scontent-tpe1-1.cdninstagram.com&_nc_cat=101&_nc_ohc=JDMgdm_gB_MAX8cwtyp&tp=1&oh=feae6f4856fae310eab7bd6a794f563a&oe=5FF1B2B1',
  'https://scontent-tpe1-1.cdninstagram.com/v/t51.2885-15/e35/p1080x1080/126336208_833332427501372_2625622297771083672_n.jpg?_nc_ht=scontent-tpe1-1.cdninstagram.com&_nc_cat=108&_nc_ohc=FjZLmFLQ-MMAX-BOWUV&tp=1&oh=1736812dfaf194b391801e3a96a3dedb&oe=5FE5056A',
  'https://scontent-tpe1-1.cdninstagram.com/v/t51.2885-15/e35/p1080x1080/123358636_1497797943763281_3137876120437980785_n.jpg?_nc_ht=scontent-tpe1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=Q_M9r49jnXUAX9un6IM&tp=1&oh=dc191a6298ebf521af524faa8a66fa63&oe=5FE72464'
]

export const whistlingHandler = async (req, res) => {
  const randIdx = Math.floor(Math.random() * 5)
  const fetchResp = await fetch(IMGS[randIdx])
  const buffer = await fetchResp.buffer()
  res.set('Content-Type', 'image/jpeg')
  res.send(buffer)
}

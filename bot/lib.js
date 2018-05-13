const botLib = {
  getPostbackInfo: (event) => {
    const kvs = event.postback.data.split('&')
    const info = {}
    kvs.forEach((kv) => {
      const splitKV = kv.split('=')
      info[splitKV[0]] = splitKV[1]
    })
    return info
  }
}

module.exports = botLib

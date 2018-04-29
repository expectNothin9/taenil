const log = {
  handleException: (prefix) => (exception) => {
    console.log(prefix, exception)
  }
}

module.exports = log

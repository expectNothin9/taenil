const fetch = require('node-fetch')
const querystring = require('querystring')
// const debug = require('debug')('R:weather')

const API_KEY = process.env.WEATHER_API_KEY
const API_URL = 'http://api.openweathermap.org/data/2.5/weather'
const CANDIDATES = ['taipei', 'sunnyvale', 'bangkok']

class Weather {
  async getWeathers () {
    const tasks = CANDIDATES.map((candidate) => {
      const qs = querystring.stringify({
        q: candidate,
        APPID: API_KEY,
        units: 'metric'
      })
      return fetch(`${API_URL}?${qs}`).then((resp) => resp.json())
    })
    return Promise.all(tasks)
      .then((rawWeathers) => {
        return rawWeathers.map((rawWeather) => this.normalizeWeather(rawWeather))
      })
  }

  normalizeWeather (raw) {
    const normalized = {
      place: raw.name,
      temperature: Math.round(raw.main.temp)
    }
    return normalized
  }
}

const weather = new Weather()

module.exports = weather;

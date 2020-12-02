import fetch from 'node-fetch'
import * as querystring from 'querystring'

const API_KEY = process.env.WEATHER_API_KEY
const API_URL = 'http://api.openweathermap.org/data/2.5/weather'
const CANDIDATES = ['taipei', 'sunnyvale', 'bangkok']

interface NormalizedWeather {
  place: string
  temperature: number
  main: string
}

class Weather {
  async getWeathers (): Promise<NormalizedWeather[]> {
    const tasks = CANDIDATES.map((candidate) => {
      const qs = querystring.stringify({
        q: candidate,
        APPID: API_KEY,
        units: 'metric'
      })
      return fetch(`${API_URL}?${qs}`, undefined).then((resp) => resp.json())
    })
    return Promise.all(tasks)
      .then((rawWeathers) => {
        return rawWeathers.map((rawWeather) => this.normalizeWeather(rawWeather))
      })
  }

  normalizeWeather (raw): NormalizedWeather {
    const normalized = {
      place: raw.name,
      temperature: Math.round(raw.main.temp),
      main: raw.weather[0].main
    }
    return normalized
  }
}

const weather = new Weather()

export default weather

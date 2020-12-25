import makeDebug from 'debug'

import redis from './redis'
import { shuffle } from '../util/array'
import beautyImages from '../data/beauties'

const debug = makeDebug('R:lib:beautyPageant')

interface Candidate {
  id: number
  image: string
  compete: number
  win: number
}

interface Match {
  id: string
  candidates: Candidate[]
}

// NOTICE: candidates should in ASCENDING order
class BeautyPageant {
  isReady: boolean
  match: Match
  redisKey: string

  constructor (matchId: string) {
    this.isReady = false
    this.redisKey = `_BPM_${matchId}_`
    this.match = {
      id: matchId,
      candidates: this.initializeCandidates(beautyImages)
    }
  }

  async syncFromRedis () {
    const redisValue = await redis.get(this.redisKey)
    if (!redisValue) {
      debug(`target match (${this.redisKey}) not found, please initialize match into redis at first.`)
    } else {
      // process match data from redis
      try {
        this.match = JSON.parse(redisValue)
        debug('syncFromRedis match', this.match)
        this.isReady = true
      } catch (error) {
        debug(`parse match from redis failed`, error)
      }
    }
  }

  initializeCandidates (images: string[], startFrom = 0): Candidate[] {
    return images.map((image: string, idx: number) => ({
      id: startFrom + idx,
      image,
      compete: 0,
      win: 0
    }))
  }

  randomCandidates (): Candidate[]|null {
    // if (!this.isReady) {
    //   return null
    // }
    // debug(`this.match.candidates`, this.match.candidates)
    const shuffledCandidates = shuffle([ ...this.match.candidates ])
    return shuffledCandidates.slice(0, 2)
  }

  async recordMatch (match: string , win: string): Promise<string> {
    const candidateIdsInMatch = match.split(',').map((candidate) => parseInt(candidate))
    const parsedWin = parseInt(win)
    let stats = '💌'
    this.match.candidates = this.match.candidates.map((candidate) => {
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
    // await this.syncMatchToRedis()
    return stats
  }

  async syncMatchToRedis (): Promise<void> {
    await redis.set(this.redisKey, JSON.stringify({ match: this.match }))
  }

  async syncNewImagesToRedis (newImages: string[] = []): Promise<void> {
    if (!this.isReady) {
      debug('not ready to sync new images')
      return
    }
    if (newImages.length === 0) {
      debug('no new images to sync')
      return
    }

    // find latest synced image index
    const currentCandidates = this.match.candidates
    const lastestCandidate = currentCandidates[currentCandidates.length - 1]
    const lastestSyncedIndex = newImages.findIndex((image) => (image === lastestCandidate.image))
    debug('lastestSyncedIndex', lastestSyncedIndex)
    // sync necessary
    const needSyncImages = lastestSyncedIndex === -1 ? newImages : newImages.slice(lastestSyncedIndex + 1, newImages.length)
    debug('needSyncImages', needSyncImages)
    this.match.candidates = [
      ...currentCandidates,
      ...this.initializeCandidates(needSyncImages, currentCandidates.length)
    ]

    debug('length after sync', this.match.candidates.length)
    await this.syncMatchToRedis()
  }
}

// NOTICE: in beauty pageant, candidates should be in ASCENDING order
const ONGOING_MATCH_ID = '20201218'
const beautyPageant = new BeautyPageant(ONGOING_MATCH_ID)
// beautyPageant.syncFromRedis()

export default beautyPageant
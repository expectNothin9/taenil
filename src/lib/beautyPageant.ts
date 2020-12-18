import makeDebug from 'debug'

import redis from './redis'
import { shuffle } from '../util/array'

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
      candidates: []
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
    if (!this.isReady) {
      return null
    }
    const shuffledCandidates = shuffle([ ...this.match.candidates ])
    return shuffledCandidates.slice(0, 2)
  }

  recordMatch (match: string , win: string): string {
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
    return stats
  }

  // async syncNewImages (newImages: string[] = []): Promise<void> {
  //   const redisValue = await redis.get(this.redisKey)
  //   const redisState = redisValue ? JSON.parse(redisValue) : { candidates: [] }
  //   const lengthOnRedis = redisState.candidates.length
  //   debug('length before sync', lengthOnRedis)
  //   if (newImages.length !== 0) {
  //     // TODO: performance can be approved
  //     if (lengthOnRedis === 0) {
  //       // empty on redis
  //       debug('empty on redis')
  //       this.match.candidates = this.initializeCandidates(newImages)
  //     } else {
  //       // find latest synced image index
  //       const lastestCandidate = redisState.candidates[lengthOnRedis - 1]
  //       const lastestSyncedIndex = newImages.findIndex((image) => (image === lastestCandidate.image))
  //       debug('lastestSyncedIndex', lastestSyncedIndex)
  //       // sync necessary
  //       const needSyncImages = lastestSyncedIndex === -1 ? newImages : newImages.slice(lastestSyncedIndex + 1, newImages.length)
  //       debug('needSyncImages', needSyncImages)
  //       this.match.candidates = [
  //         ...redisState.candidates,
  //         ...this.initializeCandidates(needSyncImages, lengthOnRedis)
  //       ]
  //     }
  //   }
  //   debug('length after sync', this.match.candidates.length)
  //   const newState = { candidates: this.match.candidates }
  //   await redis.set(this.redisKey, JSON.stringify(newState))
  //   // debug('newState', newState)
  // }
}

// NOTICE: in beauty pageant, candidates should be in ASCENDING order
const ONGOING_MATCH_ID = '20201218'
const beautyPageant = new BeautyPageant(ONGOING_MATCH_ID)
beautyPageant.syncFromRedis()

export default beautyPageant
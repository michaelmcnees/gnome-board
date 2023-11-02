import type { Segment } from '@prisma/client'

import { set } from 'date-fns'
import { useEffect, useState } from 'react'

export function useSegments(segments?: Segment[]) {
  const [now, setNow] = useState(new Date())
  const [currentSegment, setCurrentSegment] = useState<Segment | null>(null)
  const [nextSegment, setNextSegment] = useState<Segment | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (segments && segments.length) {
      const current = segments?.find(segment => {
        const start = set(now, {
          hours: Number(segment.startsAt.split(':')[0]),
          minutes: Number(segment.startsAt.split(':')[1]),
          seconds: 0
        })
        const end = set(now, {
          hours: Number(segment.startsAt.split(':')[0]) + Number(segment.duration) / 2,
          minutes: Number(segment.startsAt.split(':')[1]) + (Number(segment.duration) % 2) * 30,
          seconds: 0
        })

        if (now > start && now < end) return true
      })

      const next = segments?.find(segment => {
        const start = set(now, {
          hours: Number(segment.startsAt.split(':')[0]),
          minutes: Number(segment.startsAt.split(':')[1]),
          seconds: 0
        })

        if (now < start) return true
      })

      setCurrentSegment(current ?? null)
      setNextSegment(next ?? null)
    }
  }, [now, segments])

  return { currentSegment, nextSegment }
}

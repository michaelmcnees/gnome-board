'use client'

import type { Goal } from '@prisma/client'

import { ChartBarIcon } from '@heroicons/react/24/outline'
import { CheckBadgeIcon, ClockIcon } from '@heroicons/react/24/solid'

import Card from './card'
import { StatsResult, fetchStats, formatter } from '@/utils/donor-drive'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/ui/table'
import { useQuery } from 'react-query'
import { USDollar } from '@/utils/currency'

interface GoalsProps {
  data: StatsResult
  goals: Goal[]
}

export const Goals = (props: GoalsProps) => {
  const { data: stats, goals } = props

  const id = String(process.env.NEXT_PUBLIC_DONORDRIVE_ID)
  const { data } = useQuery('stats', () => fetchStats(id), {
    initialData: stats,
    enabled: !!id,
    refetchInterval: 15000
  })
  const { data: liveGoals } = useQuery(
    'goals',
    () => fetch('/api/goals').then(res => res.json()) as unknown as Goal[],
    {
      initialData: goals,
      enabled: !!id,
      refetchInterval: 15000
    }
  )

  const nextGoalIndex =
    data && typeof data !== 'string' && data.sumDonations ? goals.findIndex(goal => goal.amount > data.sumDonations) : 0

  return (
    <Card title='Goals' icon={<ChartBarIcon />}>
      <div className='mt-4 -mx-6'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <span className='sr-only'>Status</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {typeof liveGoals !== 'string' &&
              liveGoals?.map((goal, index) => (
                <TableRow key={goal.id}>
                  <TableCell>
                    {nextGoalIndex > index ? (
                      <CheckBadgeIcon className='w-4 h-4 text-green-600' />
                    ) : (
                      <ClockIcon className='w-4 h-4 text-gray-400' />
                    )}
                  </TableCell>
                  <TableCell>
                    <p className='text-sm'>{goal.title}</p>
                    <p className='text-primary text-xs font-semibold'>{goal.endOfStream ? 'End Of Stream' : null}</p>
                  </TableCell>
                  <TableCell>{USDollar.format(goal.amount)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

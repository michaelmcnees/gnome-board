import type { NextPageWithLayout } from './_app'
import Head from 'next/head'
import { ReactElement } from 'react'
import { useSession, getSession } from 'next-auth/react'
import Layout from '../components/Layout'
import QuickResources from '../components/cards/QuickResources'
import TotalRaised from '../components/cards/TotalRaised'
import TopDonor from '../components/cards/TopDonor'
import { useRouter } from 'next/router'

const DashboardPage: NextPageWithLayout = () => {
  const { push } = useRouter()
  const { data: session, status } = useSession()
  if (status === 'loading') {
    return <p>Loading...</p>
  }
  if (status === 'unauthenticated') {
    push('/api/auth/signin')
  }

  return (
    <>
      <Head>
        <title>Dashboard | GnomeBoard</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col gap-y-4'>
          <TotalRaised />
          <QuickResources />
        </div>
        <div className='flex flex-col gap-y-4'>
          <TopDonor />
        </div>
      </div>
    </>
  )
}

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default DashboardPage

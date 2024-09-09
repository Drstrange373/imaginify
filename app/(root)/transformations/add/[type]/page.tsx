import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/TransformationForm'
import { transformationTypes } from '@/constants'
import { getUserById } from '@/lib/actions/user.action'
import { auth } from '@clerk/nextjs'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

export default async function AddTransformationTypePage({ params: { type } }: SearchParamProps) {
  const { userId } = auth()

  if(!(type in transformationTypes)) notFound()
    
  const transformations = transformationTypes[type]



  if (!userId) redirect('/sign-in')

  const user = await getUserById(userId)
  return (
    <>
      <Header title={transformations.title} subtitle={transformations.subTitle} />

      <section className='mt-10'>

        <TransformationForm
          action='Add'
          userId={user._id}
          type={transformations.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  )
}

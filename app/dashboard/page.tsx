import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import prisma from '../../lib/prisma';
import MaxWidthWrapper from "../../components/MaxWidthWrapper"
import Dashboard from '../../components/Dashboard'

const DashboardPage = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if(!user) {
        redirect('/');
    }

    const userData = await prisma.user.findFirst({
        where: {
            id: user?.id
        },
        select: {
            lessonPlans: true,
            stripe_customer_id: true
        }
    })

    if(!userData) {
        redirect('/');
    }

  return (
    <MaxWidthWrapper className='py-8 md:py-20'>
        <Dashboard 
            lessonPlans={userData?.lessonPlans}
        />
    </MaxWidthWrapper>
  )
}

export default DashboardPage
import React from 'react'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Plan from '@/components/Plan';
import { LessonPlan, Section } from '@prisma/client';

const PlanPage = async ({ params }: { params: { id: string }}) => {

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if(!user) {
        redirect('/')
    }

    const lessonPlan = await prisma.lessonPlan.findFirst({
        where: {
            id: params.id,
            userId: user?.id
        },
        include: {
            sections: true
        }
    });

    if(!lessonPlan) return notFound();

  return (
     <MaxWidthWrapper>
      <Plan lessonPlan={lessonPlan as LessonPlan & { sections: Section[] }} />
    </MaxWidthWrapper>
  )
}

export default PlanPage
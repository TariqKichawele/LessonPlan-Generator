import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import React from 'react'
import { redirect } from 'next/navigation';
import AnimatedTitle from '../../components/AnimatedTitle';
import FeatureCards from '../../components/FeatureCards';
import LessonPlanForm from '../../components/LessonPlanForm';

const Create = async () => {
    const { isAuthenticated } = getKindeServerSession();
    const authenticated = await isAuthenticated();

    if(!authenticated) {
        redirect('/')
    }

    const isEligible = true;
    const remainingGenerations = 5;
    const message = `You can create ${remainingGenerations} more lesson plans this month.`

    const isSubscribed = true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <AnimatedTitle title="Create Your" subtitle="Lesson Plan" />
        <LessonPlanForm isSubscribed={isSubscribed} />
        <FeatureCards />
        {!isEligible && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {message}
          </div>
        )}
        {remainingGenerations > 0 && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
            {message}
          </div>
        )}
        {isEligible && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default Create
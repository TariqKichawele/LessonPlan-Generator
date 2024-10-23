import React from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from './ui/card'
import { CheckIcon } from 'lucide-react'
import Link from 'next/link'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import prisma from '@/lib/prisma'
import CheckoutButton from './CheckoutButton'; // Import the new Client Component
import { createCustomerIfNull } from '@/utils/stripe'
import { redirect } from 'next/navigation'
import { buttonVariants } from './ui/button'

const PricingCard = async ({
    tier,
    index
}: {
    tier: {
      name: string;
      price: string;
      features: string[];
    };
    index: number;
}) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  await createCustomerIfNull();

  if (!user) {
    redirect("/");
  }

  const userData = await prisma.user.findFirst({
    where: {
      id: user?.id,
    },
    select: {
      stripe_customer_id: true,
    },
  });

  if (!userData) {
    redirect("/");
  }

  return (
    <Card key={index} className={index === 1 ? "border-primary" : ""}>
      <CardHeader>
        <CardTitle className="text-2xl">{tier.name}</CardTitle>
        <CardDescription className="text-3xl font-bold">
          {tier.price}
          <span className="text-base font-normal">/month</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tier.features.map((feature, fIndex) => (
            <li key={fIndex} className="flex items-center">
              <CheckIcon className="h-5 w-5 text-primary mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {index === 0 ? (
          <Link
            className={buttonVariants({
              variant: "outline",
            })}
            href={'/'}
          >
            Get started
          </Link>
        ) : (
          <CheckoutButton customerId={userData.stripe_customer_id!} /> 
        )}
      </CardFooter>
    </Card>
  )
}

export default PricingCard

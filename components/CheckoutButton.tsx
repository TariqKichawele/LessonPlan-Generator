"use client"; // This is a Client Component

import React from 'react';
import { Button, buttonVariants } from './ui/button';
import { createCheckoutLink } from '@/utils/stripe';

const CheckoutButton = ({ customerId }: { customerId: string }) => {

  const handleCheckout = async () => {
    const checkoutUrl = await createCheckoutLink(customerId);
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      console.error("Checkout URL is null");
    }
  };

  return (
    <Button
      className={buttonVariants({
        variant: "default",
      })}
      onClick={handleCheckout}
    >
      Upgrade to Pro
    </Button>
  );
};

export default CheckoutButton;

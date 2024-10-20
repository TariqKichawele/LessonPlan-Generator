'use client'

import React, { useState } from 'react'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MobileMenu = ({ user }: { user: any }) => {
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);
  return (
    <div className="md:hidden z-50">
      <Menu onClick={() => setIsMenuOpen(!isMenuOpen)} />
      {isMenuOpen && (
        <nav className="absolute left-0 right-0 top-16 border-b border-gray-200 shadow-lg bg-white">
          <div className="flex flex-col p-4 space-y-2">
            <Link
              className={buttonVariants({
                variant: "ghost",
              })}
              href="/pricing"
            >
              Pricing
            </Link>
            {!user ? (
              <>
                <Button
                  className={buttonVariants({
                    variant: "secondary",
                  })}
                >
                  Login
                </Button>
                <Button className={buttonVariants()}>
                  Sign up
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2 flex-col md:flex-row">
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: "secondary",
                  })}
                >
                  Dashboard
                </Link>
                <Link className={buttonVariants()} href={"/create"}>
                  Create
                </Link>
                <Button
                  className={buttonVariants({
                    variant: "ghost",
                  })}
                >
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </nav>
      )}
    </div>
  )
}

export default MobileMenu
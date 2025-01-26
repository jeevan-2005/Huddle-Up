import { Metadata } from 'next'
import Navbar from '../../../components/Navbar'
import Sidebar from '../../../components/Sidebar'
import React, { ReactNode } from 'react'

type LayoutProps = {
    children: ReactNode
}

export const metadata: Metadata = {
    title: "Huddle-Up",
    description: "A video conferencing platform",
    icons: {
      icon: "/icons/logo.svg",
    }
  };

// since we don't wanna show the navbar and footer in the meeting route we have to use this HomeLayout seperatly so that it doesn't impact the meeting route.
const HomeLayout = ({children}: LayoutProps) => {
  return (
    <main className='relative'>
        <Navbar />
        <div className='flex'>
            <Sidebar />
            <section className='flex flex-1 min-h-screen px-6 pb-6 pt-[100px] max-md:pb-14 sm:px-14'>
                <div className='w-full'>
                    {children}
                </div>
            </section>

        </div>
    </main>
  )
}

export default HomeLayout
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import StaticSEO from '../components/StaticSEO'

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-950 font-sans">
            <StaticSEO />
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <CartDrawer />
        </div>
    )
}

export default MainLayout
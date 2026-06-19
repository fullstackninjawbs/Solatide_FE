import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-950 font-sans">
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
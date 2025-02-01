"use client"

import Link from "next/link"
import { ShieldAlert, Home } from "lucide-react"
import Logo from "@/components/Logo"

export default function Unauthorized() {

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col">
            <header className="w-full bg-background border-b border-b-neutral-700">
                <nav className="relative flex items-center justify-between w-full h-14 z-10 px-4">
                    <Logo />
                </nav>
            </header>
            <div className="flex-grow flex items-center justify-center p-4 bg-[radial-gradient(circle,#73737350_1px,transparent_1px)] bg-[size:10px_10px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_80%,transparent_100%)]">
                <div className="relative text-center bg-neutral-900 p-8 rounded-xl shadow-2xl max-w-md w-full">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-500"></div>
                    <ShieldAlert className="mx-auto h-24 w-24 text-red-500 mb-6" />
                    <h1 className="text-4xl font-bold text-neutral-100 mb-4">401 - Unauthorized</h1>
                    <p className="text-xl text-neutral-400 mb-8">Oops! You don&apos;t have permission to access this page.</p>
                    <div className="flex justify-center space-x-4">
                        <Link href="/" className="inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-blue-800 transition-all duration-300">
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0 flex items-center">
                                <Home className="mr-2 h-4 w-4" />
                                Go back home
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}


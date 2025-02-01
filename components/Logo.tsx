"use client"
import { Tourney } from "next/font/google"
import Link from "next/link";

const tourney = Tourney({ weight: "600", subsets: ["latin"] })

export default function Logo() {
    return (
        <Link href="/" className="flex flex-row">
            <h1
                className={`${tourney.className} text-4xl font-bold tracking-tighter text-white`}
                style={{
                    textShadow: "2px 2px 4px rgba(139, 92, 246, 0.5), 4px 4px 4px rgba(59, 130, 246, 0.5)",
                }}
            >
                DocuPrompt
            </h1>
        </Link>
    );
}
import { Github, Linkedin } from "lucide-react"

export default function Footer() {
    return (
        <footer className="rounded-lg shadow-sm w-full mt-8 bg-neutral-900">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <p className="text-neutral-500 text-sm">
                    © {new Date().getFullYear()} DocuPrompt. All rights reserved.
                </p>
                <div className="flex justify-center space-x-6">
                    <a
                        href="https://github.com/syedshoaibahmed48"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-white transition-colors"
                    >
                        <Github size={24} />
                        <span className="sr-only">GitHub</span>
                    </a>
                    <a
                        href="https://www.linkedin.com/in/syed-shoaib-ahmed-b35a2323a/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-white transition-colors"
                    >
                        <Linkedin size={24} />
                        <span className="sr-only">LinkedIn</span>
                    </a>
                </div>
            </div>
        </footer>

    )
}
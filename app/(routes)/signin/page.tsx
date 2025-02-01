"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import Link from "next/link"
import { signin } from "@/lib/apiClient"
import Toast from "@/components/ui/toast"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/utils"
import Logo from "@/components/Logo"

export default function SignIn() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const authenticateResponse = await signin(usernameOrEmail, password)
      toast.success('Successfully signed in');
      if (authenticateResponse.success) router.push("/files")
    } catch (error) {
      if(error instanceof Error) toast.error(getErrorMessage(error.message));
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <Toast/>
      <header className="w-full bg-background border-b border-b-neutral-700">
        <nav className="relative flex items-center justify-between w-full h-14 z-10 px-4">
          <Logo />
        </nav>
      </header>
      <div className="flex-grow flex items-center justify-center p-4 bg-[radial-gradient(circle,#73737350_1px,transparent_1px)] bg-[size:10px_10px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_80%,transparent_100%)]">
        <Card className="w-full max-w-md bg-neutral-900 border-neutral-800 shadow-2xl overflow-hidden relative">
          <CardHeader className="relative space-y-1 pb-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-500"></div>
            <CardTitle className="text-4xl font-bold tracking-tight text-neutral-100">Welcome back</CardTitle>
            <CardDescription className="text-xl text-neutral-400">Sign in to access your account</CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-300">
                  Username or Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-5 w-5" />
                  <Input
                    id="usernameOrEmail"
                    type="text"
                    placeholder="Enter your username or email"
                    className="pl-10 bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-400 focus:border-neutral-600 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-5 w-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-400 focus:border-neutral-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="relative w-full text-center inline-flex items-center justify-center p-0.5 lg:mr-4 overflow-hidden text-md font-medium rounded-full group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-blue-800"
              >
                <span className="relative w-full py-2 transition-all ease-in duration-150 bg-gray-900 rounded-3xl group-hover:bg-opacity-0">
                  Sign In
                </span>
              </button>
            </form>
            <div className="mt-4 flex flex-row justify-center items-center text-sm">
                <p className="text-neutral-400">Don&apos;t have an account?</p>
                <Link href="/request-access" className="ml-2 text-purple-400 hover:text-purple-300 hover:underline">Request access here</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
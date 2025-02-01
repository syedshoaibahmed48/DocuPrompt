"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { User, Mail, MessageSquare } from "lucide-react"
import Logo from "@/components/Logo"
import { requestStandardAccess } from "@/lib/apiClient"
import { isValidEmail } from "@/lib/AuthUtils"
import Toast from "@/components/ui/toast"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function RequestAccess() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");
  const [emailError, setEmailError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) {
      toast("Name and Email are required");
      return;
    }
    try {
      const response = await requestStandardAccess(name, email, comments);
      if(response.success) {
        toast.success("Request submitted.");
        setTimeout(()=>{
          router.push("/");
        }, 2000)
      };
    } catch (error) {
      if(error instanceof Error) toast.error(getErrorMessage(error.message));
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <Toast />
      <header className="w-full bg-background border-b border-b-neutral-700">
        <nav className="relative flex items-center justify-between w-full h-14 z-10 ml-2">
          <Logo />
        </nav>
      </header>
      <div className="flex-grow flex items-center justify-center p-4 bg-[radial-gradient(circle,#73737350_1px,transparent_1px)] bg-[size:10px_10px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_80%,transparent_100%)]">
        <Card className="w-full max-w-md bg-neutral-900 border-neutral-800 shadow-2xl overflow-hidden relative">
          <CardHeader className="relative space-y-1 pb-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-500"></div>
            <CardTitle className="text-4xl font-bold tracking-tight text-neutral-100">Request Access</CardTitle>
            <CardDescription className="text-xl text-neutral-400">
              Submit your details for standard access
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-neutral-300">
                  Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-5 w-5" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    className="pl-10 bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-400 focus:border-neutral-600 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-400 focus:border-neutral-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    value={email}
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (e.target.value && !isValidEmail(e.target.value)) {
                        setEmailError("Please enter a valid email address")
                      } else {
                        setEmailError("")
                      }
                    }}
                    required
                  />
                  {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comments" className="text-neutral-300">
                  Comments (Optional)
                </Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-neutral-500 h-5 w-5" />
                  <Textarea
                    id="comments"
                    placeholder="Any additional comments"
                    className="pl-10 bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-400 focus:border-neutral-600 focus:ring-2 focus:ring-green-500 transition-all duration-300"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="relative w-full text-center inline-flex items-center justify-center p-0.5 lg:mr-4 overflow-hidden text-md font-medium rounded-full group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-blue-800"
              >
                <span className="relative w-full py-2 transition-all ease-in duration-150 bg-gray-900 rounded-3xl group-hover:bg-opacity-0">
                  Submit Request
                </span>
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


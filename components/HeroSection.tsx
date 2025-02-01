"use client"

import { demoUserLogin } from '@/lib/apiClient';
import { load } from '@fingerprintjs/fingerprintjs';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HeroSection() {

  const router = useRouter();

  async function handleTryItOut(){
    const fp = await load();
    const { visitorId: fingerprint } = await fp.get();
    const demoLoginResponse = await demoUserLogin(fingerprint);
    if(demoLoginResponse.success){
      router.push("/files");
    }
  }

    return (
      <div className="min-h-screen w-full bg-[radial-gradient(circle,#73737350_1px,transparent_1px)] bg-[size:10px_10px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_80%,transparent_100%)] relative overflow-hidden">
          

      {/* Hero Content */}
      <div className="relative w-2/3 mx-auto pt-20 pb-16 sm:pt-32 sm:pb-28">
        <div className="text-center space-y-8">
          {/* Animated Badge */}
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 border border-transparent text-sm rounded-full bg-gradient-to-r from-purple-600/10 to-blue-500/10 backdrop-blur-sm text-white shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-500/20 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            <span className="animate-text-shimmer font-medium">
              Empowering Insights: Chat with AI About Your Documents
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight leading-tight text-white md:text-5xl lg:text-6xl">
            Unlock <span className="text-gradient">Insights </span>
            from your <span className="underline underline-offset-3 decoration-8 decoration-blue-600">Documents</span> with <span className="text-gradient">AI</span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-xl sm:text-2xl text-gray-400">
            Interact with your text documents like never before.
            Ask questions, get summaries, and more.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-row mx-auto items-center w-1/2 lg:flex-row lg:items-start">
            <button onClick={handleTryItOut} className="relative w-2/5 text-center text-lg font-medium inline-flex items-center justify-center p-0.5 lg:mr-4 overflow-hidden rounded-full group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-blue-800">
              <span className="relative flex flex-row justify-center w-full py-3 transition-all ease-in duration-150 bg-gray-900 rounded-full group-hover:bg-opacity-0">
                Try It Out
                <ArrowRight className="ml-2 w-5 h-5 self-center group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <Link href="/request-access" className="btn-outline w-3/5 py-3 text-lg font-medium">
                Request Standard Access
            </Link>
          </div>
        </div>
      </div>
    </div>
    );
};
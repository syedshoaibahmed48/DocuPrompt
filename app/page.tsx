import HeroSection from "@/components/HeroSection";
import Link from "next/link";
import Logo from "@/components/Logo";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="h-screen">
      <header className="sticky border-b top-0 z-40 px-2 w-full border-b-neutral-700 bg-background">
        <nav className="relative flex items-center justify-between h-16 z-10">
          <Logo />
          <div className="gap-2">
            <a rel="noreferrer noopener" href="#features" className="inline-flex items-center justify-center whitespace-nowrap rounded-3xl text-[16px] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-neutral-800 h-10 px-4 py-2">
              Features
            </a>
            <a rel="noreferrer noopener" href="#testimonials" className="inline-flex items-center justify-center whitespace-nowrap rounded-3xl text-[16px] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-neutral-800 h-10 px-4 py-2">
              Testimonials
            </a>
            <a rel="noreferrer noopener" href="#faq" className="inline-flex items-center justify-center whitespace-nowrap rounded-3xl text-[16px] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-neutral-800 h-10 px-4 py-2">
              FAQ
            </a>
          </div>
          <div>
            <Link href="/signin" className="btn-outline px-4 py-2 me-2">Sign In</Link>
          </div>
        </nav>
      </header>
      <section className="max-w-full">
        <HeroSection />
      </section>
      <section id="features" className="flex flex-col">
        <FeaturesSection />
      </section>
      <section>
        <Footer />
      </section>
    </div>
  );
}

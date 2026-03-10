import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "@/app/components/Navbar";
import { Hero } from "@/app/components/Hero";
import { TrustBadges } from "@/app/components/TrustBadges";
import { FeaturedProducts } from "@/app/components/FeaturedProducts";
import { AllProducts } from "@/app/components/AllProducts";
import { Testimonials } from "@/app/components/Testimonials";
import { FAQ } from "@/app/components/FAQ";
import { AboutSection } from "@/app/components/AboutSection";
import { Newsletter } from "@/app/components/Newsletter";
import { Footer } from "@/app/components/Footer";
import { DecorativeEffects } from "@/app/components/DecorativeEffects";
import { CheckoutPage } from "@/app/pages/CheckoutPage";
import { ProfilePage } from "@/app/pages/ProfilePage";
import { AdminPage } from "@/app/pages/AdminPage";
import { GoldShowcase } from "@/app/components/GoldShowcase";
import { AIChat } from "@/app/components/AIChat";
import { ScrollToTop } from "@/app/components/ScrollToTop";
import { ToastContainer } from "@/app/components/Toast";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const HomePage = () => (
    <>
      <Hero />
      <GoldShowcase />
      {/* Smooth transition into products */}
      <div className="relative h-16" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950 to-stone-950" />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
      </div>
      <AllProducts />
      {/* Transition into testimonials */}
      <div className="relative h-8" aria-hidden="true">
        <div className="absolute inset-0 bg-stone-950" />
      </div>
      <Testimonials />
      {/* Transition into about */}
      <div className="relative h-8" aria-hidden="true">
        <div className="absolute inset-0 bg-stone-950" />
      </div>
      <AboutSection />
    </>
  );

  return (
    <div className="min-h-screen bg-stone-950 text-white selection:bg-sky-800/40 selection:text-white">
      <style>{`
        body, h1, h2, h3, h4, h5, h6, .font-serif { font-family: 'Cormorant Garamond', serif; }
      `}</style>
      
      <ScrollToTop />
      <ToastContainer />
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<main className="overflow-hidden"><HomePage /></main>} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      {!isAdmin && <Footer />}
      {!isAdmin && <AIChat />}
      {!isAdmin && <DecorativeEffects />}
    </div>
  );
}

import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "@/app/components/Navbar";
import { Hero } from "@/app/components/Hero";
import { TrustBadges } from "@/app/components/TrustBadges";
import { AllProducts } from "@/app/components/AllProducts";
import { Testimonials } from "@/app/components/Testimonials";
import { AboutSection } from "@/app/components/AboutSection";
import { Footer } from "@/app/components/Footer";
import { DecorativeEffects } from "@/app/components/DecorativeEffects";
import { CheckoutPage } from "@/app/pages/CheckoutPage";
import { ProfilePage } from "@/app/pages/ProfilePage";
import { AdminPage } from "@/app/pages/AdminPage";
import { GoldShowcase } from "@/app/components/GoldShowcase";
import { ScrollToTop } from "@/app/components/ScrollToTop";
import { ToastContainer } from "@/app/components/Toast";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const HomePage = () => (
    <>
      <Hero />
      <TrustBadges />
      <GoldShowcase />
      {/* Geometric divider */}
      <div className="relative h-20 flex items-center justify-center" aria-hidden="true">
        <div className="absolute inset-0 bg-stone-950" />
        <div className="relative flex items-center gap-4">
          <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent to-white/10" />
          <div className="w-1 h-1 bg-white/15 rotate-45" />
          <div className="w-16 md:w-24 h-px bg-gradient-to-l from-transparent to-white/10" />
        </div>
      </div>
      <AllProducts />
      {/* Geometric divider */}
      <div className="relative h-16 flex items-center justify-center" aria-hidden="true">
        <div className="absolute inset-0 bg-stone-950" />
        <div className="relative flex items-center gap-4">
          <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent to-white/[0.08]" />
          <div className="w-1 h-1 bg-white/10 rotate-45" />
          <div className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent to-white/[0.08]" />
        </div>
      </div>
      <Testimonials />
      {/* Geometric divider */}
      <div className="relative h-16 flex items-center justify-center" aria-hidden="true">
        <div className="absolute inset-0 bg-stone-950" />
        <div className="relative flex items-center gap-4">
          <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent to-white/[0.08]" />
          <div className="w-1 h-1 bg-white/10 rotate-45" />
          <div className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent to-white/[0.08]" />
        </div>
      </div>
      <AboutSection />
    </>
  );

  return (
    <div className="min-h-screen bg-stone-950 text-white selection:bg-cyan-800/40 selection:text-white">
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
      {!isAdmin && <DecorativeEffects />}
    </div>
  );
}

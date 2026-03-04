import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/app/components/Navbar";
import { Hero } from "@/app/components/Hero";
import { TrustBadges } from "@/app/components/TrustBadges";
import { CategorySection } from "@/app/components/CategorySection";
import { FeaturedProducts } from "@/app/components/FeaturedProducts";
import { AllProducts } from "@/app/components/AllProducts";
import { Benefits } from "@/app/components/Benefits";
import { Testimonials } from "@/app/components/Testimonials";
import { AboutSection } from "@/app/components/AboutSection";
import { Footer } from "@/app/components/Footer";
import { CheckoutPage } from "@/app/pages/CheckoutPage";
import { AIChat } from "@/app/components/AIChat";
import { ScrollToTop } from "@/app/components/ScrollToTop";
import { ToastContainer } from "@/app/components/Toast";
import { DecorativeEffects } from "@/app/components/DecorativeEffects";

export default function App() {
  const HomePage = () => (
    <>
      <Hero />
      <TrustBadges />
      <CategorySection />
      <FeaturedProducts />
      <AllProducts />
      <Benefits />
      <Testimonials />
      <AboutSection />
    </>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-[#D4AF37] selection:text-white transition-colors duration-500">
      <style>{`
        body { font-family: 'Lato', sans-serif; }
        h1, h2, h3, h4, h5, h6, .font-serif { font-family: 'Playfair Display', serif; }
      `}</style>
      
      <ScrollToTop />
      <ToastContainer />
      <DecorativeEffects />
      <Navbar />
      <Routes>
        <Route path="/" element={<main><HomePage /></main>} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
      <Footer />
      <AIChat />
    </div>
  );
}

import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "@/app/components/Navbar";
import { Hero } from "@/app/components/Hero";
import { CategorySection } from "@/app/components/CategorySection";
import { FeaturedProducts } from "@/app/components/FeaturedProducts";
import { AllProducts } from "@/app/components/AllProducts";
import { Benefits } from "@/app/components/Benefits";
import { Testimonials } from "@/app/components/Testimonials";
import { AboutSection } from "@/app/components/AboutSection";
import { Footer } from "@/app/components/Footer";
import { CheckoutPage } from "@/app/pages/CheckoutPage";
import { ProfilePage } from "@/app/pages/ProfilePage";
import { AdminPage } from "@/app/pages/AdminPage";
import { AIChat } from "@/app/components/AIChat";
import { ScrollToTop } from "@/app/components/ScrollToTop";
import { ToastContainer } from "@/app/components/Toast";
export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const HomePage = () => (
    <>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <AllProducts />
      <Benefits />
      <Testimonials />
      <AboutSection />
    </>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 text-stone-900 dark:text-white selection:bg-sky-200 selection:text-stone-900 dark:selection:bg-sky-800 dark:selection:text-white transition-colors duration-500">
      <style>{`
        body, h1, h2, h3, h4, h5, h6, .font-serif { font-family: 'Cormorant Garamond', serif; }
      `}</style>
      
      <ScrollToTop />
      <ToastContainer />
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<main><HomePage /></main>} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      {!isAdmin && <Footer />}
      {!isAdmin && <AIChat />}
    </div>
  );
}

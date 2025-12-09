import Header from "@/components/landingpage/header";
import HeroSection from "@/components/landingpage/hero-section";
import FarcasterIndicator from "@/components/FarcasterIndicator";

import HowItWorks from "@/components/landingpage/how-it-works";
import FeaturesModern from "@/components/landingpage/features-modern";
import Stats from "@/components/landingpage/stats";
import FAQ from "@/components/landingpage/faq";
import Footer from "@/components/landingpage/footer";

export default function Home() {
  return (
    <div className="">
      <FarcasterIndicator />
      <Header />
      <HeroSection />
      <FeaturesModern />
      <HowItWorks />
      <Stats />
      <FAQ />
      <Footer />
    </div>
  );
}

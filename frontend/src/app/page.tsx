// import HeroSection from "@/components/landingpage/Hero";
import Header from "@/components/landingpage/header";
import HeroSection from "@/components/landingpage/hero-section";
import FarcasterIndicator from "@/components/FarcasterIndicator";
import KeyFeatures from "@/components/landingpage/key-features";
import HowItWorks from "@/components/landingpage/how-it-works";

export default function Home() {
  return (
    <div className="">
      <FarcasterIndicator />
      <Header />
      <HeroSection />
      <KeyFeatures />
      <HowItWorks />
    </div>
  );
}

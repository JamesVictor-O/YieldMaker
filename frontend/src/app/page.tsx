// import HeroSection from "@/components/landingpage/Hero";
import Header from "@/components/landingpage/header";
import HeroSection from "@/components/landingpage/hero-section";
import FarcasterIndicator from "@/components/FarcasterIndicator";

export default function Home() {
  return (
    <div className="">
      <FarcasterIndicator />
      <Header />
      <HeroSection />
    </div>
  );
}

// src/app/page.tsx
import Hero from "@/components/sections/home/Hero";
import Features from "@/components/sections/home/Features";
import Benefits from "@/components/sections/home/Benefits";
import HomeBanksPreview from "@/components/sections/home/HomeBanksPreview";
import HomeHowItWorks from "@/components/sections/home/HomeHowItWorks";
import HomeFaqPreview from "@/components/sections/home/HomeFaqPreview";
import HomeVlogsPreview from "@/components/sections/home/HomeVlogsPreview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HomeBanksPreview />
      <Benefits />
      <HomeHowItWorks />

      {/* 👉 AÑADE ESTA LINEA */}
      <HomeVlogsPreview />

      <HomeFaqPreview />
    </>
  );
}

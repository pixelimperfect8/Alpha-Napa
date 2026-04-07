import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Hero";
import StickyScroll from "@/components/StickyScroll";
import WhyNapa from "@/components/WhyNapa";
import WhoThisIsFor from "@/components/WhoThisIsFor";
import BentoGrid from "@/components/BentoGrid";
import SplitScreen from "@/components/SplitScreen";
import AlphaCampuses from "@/components/AlphaCampuses";
import FooterParallax from "@/components/FooterParallax";
import Analytics from "@/components/Analytics";

export default function Option1() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[#1c1b19]">
        <Hero />
        <StickyScroll />
        <WhyNapa />
        <AlphaCampuses />
        <WhoThisIsFor />
        <BentoGrid />
        <SplitScreen />
        <FooterParallax />
      </main>
      <Analytics />
    </SmoothScroll>
  );
}

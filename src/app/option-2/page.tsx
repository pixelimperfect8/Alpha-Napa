import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/v2/Hero";
import StickyScroll from "@/components/v2/StickyScroll";
import WhyNapa from "@/components/WhyNapa";
import WhoThisIsFor from "@/components/v2/WhoThisIsFor";
import BentoGrid from "@/components/v2/BentoGrid";
import SplitScreen from "@/components/v2/SplitScreen";
import AlphaCampuses from "@/components/v2/AlphaCampuses";
import ProofPoints from "@/components/v2/ProofPoints";
import FooterParallax from "@/components/v2/FooterParallax";
import Analytics from "@/components/Analytics";

export default function Option2() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[#1c1b19]">
        <Hero />
        <StickyScroll />
        <WhyNapa />
        <AlphaCampuses />
        <ProofPoints />
        <WhoThisIsFor />
        <BentoGrid />
        <SplitScreen />
        <FooterParallax />
      </main>
      <Analytics />
    </SmoothScroll>
  );
}

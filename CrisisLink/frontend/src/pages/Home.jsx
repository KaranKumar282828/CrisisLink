import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Contact from "../components/Contact";

function Home() {
  return (
    <div>
      <main className="pt-20"> {/* space because navbar is fixed */}
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
        <Contact />
      </main>
    </div>
  );
}

export default Home;

import Header from "./header";
import Hero from "./hero";
import Features from "./features";
import Footer from "./footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col w-full">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

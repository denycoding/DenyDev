import FAQ from "./FAQ";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import Services from "./Services";
import Testimonials from "./Testimonials";
import TopDevelopers from "./TopDevelopers";

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <TopDevelopers />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
  );
}

export default Home;

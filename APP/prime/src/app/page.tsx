

import Container from "./components/Container";
import GradientBackground from "./components/landingPage/GradientBackground";
import LandingPageBody from "./components/landingPage/LandingPageBody";
import LandingPageNavbar from "./components/landingPage/LandingPageNavbar";

export default function Home() {
  return (
   
   <div className=''>
    <section className="min-h-screen bg-gradient-animated bg-gradient-400 animate-gradient shadow-neon"> 
       <Container>
     <LandingPageNavbar/> 
    <LandingPageBody/>
    </Container>
    </section>
     <GradientBackground/>
     
    </div>
    
  );
}

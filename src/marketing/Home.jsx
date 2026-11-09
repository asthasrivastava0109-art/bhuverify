import Nav from './Nav.jsx';
import Hero from './Hero.jsx';
import Fragmented from './Fragmented.jsx';
import Workflow from './Workflow.jsx';
import { Checks, InsideReport, Audiences, Sources, About, FinalCta, Footer } from './Sections.jsx';

export default function Home() {
  return (
    <div className="mk">
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Fragmented />
        <Workflow />
        <Checks />
        <InsideReport />
        <Audiences />
        <Sources />
        <About />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

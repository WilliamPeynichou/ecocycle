import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import BikeAdvisor from './components/BikeAdvisor';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [isAgentOpen, setIsAgentOpen] = useState(true);

  const handleAgentToggle = (isOpen) => {
    setIsAgentOpen(isOpen);
  };

  return (
    <div className="App">
      <Header />
      <main className={`main-content ${isAgentOpen ? 'agent-open' : 'agent-closed'}`}>
        <Hero />
        <Services />
      </main>
      <Footer />
      <BikeAdvisor onToggle={handleAgentToggle} />
    </div>
  );
}

export default App;
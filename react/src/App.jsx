import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import BikeAdvisor from './components/BikeAdvisor';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Services />
        <BikeAdvisor />
      </main>
      <Footer />
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Hero from './components/common/Hero';
import ProductList from './components/product/ProductList';
import BikeAdvisor from './components/agent/BikeAdvisor';
import Footer from './components/layout/Footer';
import AuthModal from './components/auth/AuthModal';
import { authService } from './service/authService';
import './App.css';

function App() {
  const [isAgentOpen, setIsAgentOpen] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'authentification au chargement de l'app
  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleAgentToggle = (isOpen) => {
    setIsAgentOpen(isOpen);
  };

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Header 
        user={user} 
        onLoginClick={handleLoginClick} 
        onLogout={handleLogout} 
      />
      <main className={`main-content ${isAgentOpen ? 'agent-open' : 'agent-closed'}`}>
        <Hero />
        <ProductList />
      </main>
      <Footer />
      <BikeAdvisor onToggle={handleAgentToggle} />
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}

export default App;

import React, { useEffect } from 'react';
import { Language } from './types';
import RegistrationForm from './components/RegistrationForm';

const App: React.FC = () => {
  useEffect(() => {
    document.body.className = 'bg-slate-100';
    const style = document.createElement('style');
    style.innerHTML = `
      body { 
        font-family: 'Sarabun', sans-serif;
        background-color: #f1f5f9;
        background-image: 
          radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0),
          radial-gradient(circle at 15px 15px, #e2e8f0 1px, transparent 0);
        background-size: 30px 30px;
      }
      .form-soft-shadow { 
        box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.15);
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="container mx-auto max-w-4xl min-h-screen flex items-center justify-center py-12 px-4">
      <RegistrationForm initialLanguage={Language.TH} />
    </div>
  );
};

export default App;

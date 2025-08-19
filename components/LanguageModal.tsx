
import React from 'react';
import { Language } from '../types';

interface LanguageModalProps {
  onSelect: (lang: Language) => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center form-shadow animate-fade-in-up">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">เลือกภาษา / Select Language</h2>
          <p className="text-gray-600">กรุณาเลือกภาษาที่ต้องการใช้งาน<br/>Please select your preferred language</p>
        </div>
        <div className="space-y-4">
          <button 
            onClick={() => onSelect(Language.TH)} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
            ภาษาไทย
          </button>
          <button 
            onClick={() => onSelect(Language.EN)} 
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300">
            English
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;

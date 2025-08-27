import React from 'react';
import { motion } from 'framer-motion';

const RegistrationClosedModal: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white rounded-2xl p-8 max-w-lg mx-auto text-center form-soft-shadow w-full">
        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto text-sky-500 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">หมดเวลาลงทะเบียนแล้ว</h2>
          <h3 className="text-xl font-semibold text-slate-700">Registration has closed</h3>
          <p className="text-gray-600 mt-4">
            ขอขอบคุณสำหรับความสนใจในการเข้าร่วมกิจกรรมตลาดนัดโรงเรียน<br/>
            Thank you for your interest in the School Market Fair event.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationClosedModal;

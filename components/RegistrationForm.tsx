import React, { useState, useMemo, useEffect } from 'react';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import { Language, RegistrantType, ProductItem } from '../types';
import RegistrationClosedModal from './RegistrationClosedModal';

declare const Swal: any;

const GOOGLE_SCRIPT_URL: string = 'https://script.google.com/macros/s/AKfycbyjLrlFzHL-9sHPSMI7aeX12qt_jFEXW69QOhN1mnfUT_IbBoyWQZQZVkDOIG2B77-2mQ/exec';

// --- REGISTRATION DEADLINE ---
// To re-open registration, set this to a date in the future.
// Example: new Date('2025-08-26T23:59:59')
const REGISTRATION_DEADLINE = new Date('2024-01-01T00:00:00Z');

const translations = {
  th: {
    header: 'แบบฟอร์มลงทะเบียนตลาดนัดโรงเรียน',
    subHeader: 'กรุณากรอกข้อมูลให้ครบถ้วนเพื่อลงทะเบียนเข้าจำหน่ายสินค้า',
    eventTitle: 'วันตลาดนัดโรงเรียน 27 สิงหาคม 2568',
    langBtn: 'EN',
    personalInfo: 'ข้อมูลส่วนตัว',
    title: 'คำนำหน้า',
    select: 'เลือก...',
    titles: ['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง'],
    firstName: 'ชื่อ',
    middleName: 'ชื่อกลาง (ถ้ามี)',
    lastName: 'นามสกุล',
    phone: 'เบอร์โทรศัพท์',
    phonePlaceholder: 'กรอกเฉพาะตัวเลข',
    email: 'อีเมล',
    relatedStudent: 'ชื่อนักเรียนที่เกี่ยวข้อง',
    class: 'ชั้นเรียน',
    classPlaceholder: 'เช่น ม.1A',
    productList: 'รายการสินค้าที่จะนำมาจำหน่าย',
    productName: 'ชื่อสินค้า',
    remove: 'ลบ',
    addProduct: '+ เพิ่มรายการ',
    atLeastOneProduct: 'ต้องมีสินค้าอย่างน้อย 1 รายการ',
    terms: 'ข้อกำหนดและเงื่อนไข',
    termsNotice: 'ประกาศข้อกำหนดสำคัญ',
    termPoints: [
      'โรงเรียนไม่มีไฟฟ้า ไม่มีโต๊ะ และไม่มีอุปกรณ์ใด ๆ ให้บริการ',
      'ผู้เข้าร่วมต้องเตรียมอุปกรณ์ที่จำเป็นมาเองทั้งหมด (เช่น โต๊ะ, เก้าอี้, ร่ม)',
      'ผู้เข้าร่วมต้องรับผิดชอบความสะอาดในพื้นที่ของตนเอง',
      'การลงทะเบียนไม่ได้รับประกันการได้พื้นที่ขาย',
      'ผู้ที่ลงทะเบียนสามารถเข้าพื้นที่เพื่อตั้งร้านได้ตั้งแต่เวลา 13.40 น. เป็นต้นไป',
      'ไม่อนุญาตให้ผู้ที่ไม่ลงทะเบียนเข้ามาขายสินค้าในวันงาน',
    ],
    agreeTh: 'ข้าพเจ้าได้อ่านและยอมรับเงื่อนไขการเข้าร่วมตลาดนัดโรงเรียน',
    agreeEn: 'I have read and agree to the market fair participation terms.',
    timestampLabel: 'วันที่-เวลาลงทะเบียน:',
    register: 'ส่งข้อมูลลงทะเบียน',
    thankYou: 'ขอบคุณสำหรับความสนใจในงานตลาดนัดโรงเรียน',
    submitting: 'กำลังส่งข้อมูล...',
    submitSuccess: 'การลงทะเบียนเสร็จสมบูรณ์',
    submitSuccessMessage: 'ข้อมูลของท่านถูกบันทึกเรียบร้อยแล้ว ขอบคุณที่ให้ความสนใจเข้าร่วมกิจกรรมของเรา',
    submitError: 'เกิดข้อผิดพลาด',
    submitErrorMessage: 'ไม่สามารถส่งข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่อและลองใหม่อีกครั้ง',
    validationErrorTitle: 'ข้อมูลไม่ครบถ้วน',
    validationErrorMessage: 'กรุณากรอกข้อมูลที่จำเป็น (*) ให้ครบถ้วน:',
    validationAgreement: 'คุณต้องยอมรับเงื่อนไขทั้ง 2 ข้อ',
    validationProducts: 'กรุณาระบุชื่อสินค้าอย่างน้อย 1 รายการ',
    configError: 'ตั้งค่าไม่ถูกต้อง',
    configErrorMessage: 'กรุณาตั้งค่า Google Apps Script URL ในไฟล์ components/RegistrationForm.tsx',
  },
  en: {
    header: 'School Market Fair Registration Form',
    subHeader: 'Please fill out the form completely to register to sell products.',
    eventTitle: 'School Market Fair - August 27, 2025',
    langBtn: 'TH',
    personalInfo: 'Personal Information',
    title: 'Title',
    select: 'Select...',
    titles: ['Mr.', 'Mrs.', 'Miss', 'Master'],
    firstName: 'First Name',
    middleName: 'Middle Name (Optional)',
    lastName: 'Last Name',
    phone: 'Phone Number',
    phonePlaceholder: 'Numbers only',
    email: 'Email',
    relatedStudent: 'Related Student Name',
    class: 'Class',
    classPlaceholder: 'e.g., Primary 1A',
    productList: 'Products to be Sold',
    productName: 'Product Name',
    remove: 'Remove',
    addProduct: '+ Add Item',
    atLeastOneProduct: 'At least 1 product item is required',
    terms: 'Terms and Conditions',
    termsNotice: 'Important Notice',
    termPoints: [
      'The school does not provide electricity, tables, or any equipment',
      'Participants must bring their own necessary equipment (e.g., tables, chairs, umbrellas)',
      'Participants are responsible for cleaning their assigned area',
      'Registration does not guarantee booth allocation',
      'Registered participants may enter to set up their booths from 1:40 PM onwards',
      'Unregistered individuals are not permitted to sell products on the event day',
    ],
    agreeTh: 'ข้าพเจ้าได้อ่านและยอมรับเงื่อนไขการเข้าร่วมตลาดนัดโรงเรียน',
    agreeEn: 'I have read and agree to the market fair participation terms.',
    timestampLabel: 'Registration Date-Time:',
    register: 'Submit Registration',
    thankYou: 'Thank you for your interest in our school market fair.',
    submitting: 'Submitting...',
    submitSuccess: 'Registration Complete',
    submitSuccessMessage: 'Your information has been successfully recorded. Thank you for your interest in our event.',
    submitError: 'An Error Occurred',
    submitErrorMessage: 'Could not submit the form. Please check your connection and try again.',
    validationErrorTitle: 'Incomplete Information',
    validationErrorMessage: 'Please fill in all required fields (*):',
    validationAgreement: 'You must agree to both terms.',
    validationProducts: 'Please list at least one product.',
    configError: 'Configuration Error',
    configErrorMessage: 'Please set your Google Apps Script URL in components/RegistrationForm.tsx',
  }
};

// --- Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

// --- Helper Components ---
const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <motion.div variants={itemVariants}>
    <h4 className="text-xl font-semibold text-slate-700 mb-6 border-b border-slate-200 pb-3">{title}</h4>
    {children}
  </motion.div>
);

const InputField = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label: string; isRequired?: boolean }>((props, ref) => {
    const { label, isRequired, ...rest } = props;
    return (
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
                ref={ref}
                {...rest}
                className="w-full p-3 bg-slate-50 text-slate-800 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-sm"
            />
        </div>
    );
});

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; isRequired?: boolean; options: string[]; lang: Language }> = ({ label, isRequired, options, lang, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-2">
      {label} {isRequired && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select {...props} className="w-full p-3 bg-slate-50 text-slate-800 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all appearance-none shadow-sm pr-10">
        <option value="">{translations[lang].select}</option>
        {options.map(opt => <option key={opt} value={opt} className="bg-white text-slate-800">{opt}</option>)}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  </div>
);


const MotionButton = (props: HTMLMotionProps<'button'>) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
    />
);


interface RegistrationFormProps {
  initialLanguage: Language;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ initialLanguage }) => {
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);
  const [lang, setLang] = useState<Language>(initialLanguage);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (new Date() > REGISTRATION_DEADLINE) {
      setIsRegistrationClosed(true);
    }
  }, []);

  const t = useMemo(() => translations[lang], [lang]);

  const initialFormData = {
    title: '', firstName: '', middleName: '', lastName: '', phone: '', email: '',
    relatedStudentName: '', studentClass: '',
    agreeTh: false, agreeEn: false,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [products, setProducts] = useState<ProductItem[]>([{ id: Date.now(), name: '' }]);
  
  const resetForm = () => {
    setFormData(initialFormData);
    setProducts([{ id: Date.now(), name: '' }]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addProduct = () => setProducts(prev => [...prev, { id: Date.now(), name: '' }]);
  const removeProduct = (id: number) => {
    if (products.length > 1) {
      setProducts(prev => prev.filter(p => p.id !== id));
    } else {
      Swal.fire({ icon: 'warning', title: t.atLeastOneProduct });
    }
  };
  const handleProductChange = (id: number, value: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, name: value } : p));
  };
  
  const toggleLanguage = () => setLang(prev => prev === Language.TH ? Language.EN : Language.TH);
  
  const validateForm = (): boolean => {
    const requiredFields: (keyof typeof formData)[] = ['title', 'firstName', 'lastName', 'phone', 'email', 'relatedStudentName', 'studentClass'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if(missingFields.length > 0) {
      const fieldNames = missingFields.map(f => t[f as keyof typeof t]).join(', ');
      Swal.fire({ icon: 'error', title: t.validationErrorTitle, text: `${t.validationErrorMessage} ${fieldNames}` });
      return false;
    }

    if (products.some(p => p.name.trim() === '')) {
       Swal.fire({ icon: 'error', title: t.validationErrorTitle, text: t.validationProducts });
       return false;
    }

    if (!formData.agreeTh || !formData.agreeEn) {
       Swal.fire({ icon: 'error', title: t.validationErrorTitle, text: t.validationAgreement });
       return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(submitting) return;
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        Swal.fire({ icon: 'error', title: t.configError, text: t.configErrorMessage });
        return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    Swal.fire({ title: t.submitting, allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    
    const submissionData = {
        language: lang,
        registrationTimestamp: new Date().toISOString(),
        registrantType: RegistrantType.Parent, // Hardcoded to Parent
        ...formData,
        products: products.map(p => p.name).join(', '),
    };

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST', mode: 'no-cors', cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionData)
        });
        
        Swal.fire({ icon: 'success', title: t.submitSuccess, text: t.submitSuccessMessage });
        resetForm();

    } catch(error) {
        console.error('Submission Error:', error);
        Swal.fire({ icon: 'error', title: t.submitError, text: t.submitErrorMessage });
    } finally {
        setSubmitting(false);
    }
  };
  
  if (isRegistrationClosed) {
    return <RegistrationClosedModal />;
  }
  
  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
          <MotionButton
              onClick={toggleLanguage}
              className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-4 py-2 rounded-full transition-colors text-sm font-semibold flex items-center shadow-sm gap-2"
              aria-label={`Switch to ${lang === 'th' ? 'English' : 'Thai'}`}
          >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
              </svg>
              <span>{t.langBtn}</span>
          </MotionButton>
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white border border-slate-200 rounded-2xl form-soft-shadow overflow-hidden w-full">
          
          <div className="p-8 text-center bg-sky-600">
              <h1 className="text-3xl font-bold text-white">{t.header}</h1>
              <p className="text-lg text-sky-100 mt-1">{t.subHeader}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
              <FormSection title={t.personalInfo}>
                <div className="grid md:grid-cols-4 gap-6 mb-6">
                    <SelectField label={t.title} name="title" lang={lang} isRequired value={formData.title} onChange={handleInputChange} options={t.titles} />
                    <InputField label={t.firstName} name="firstName" isRequired value={formData.firstName} onChange={handleInputChange} />
                    <InputField label={t.middleName} name="middleName" value={formData.middleName} onChange={handleInputChange} />
                    <InputField label={t.lastName} name="lastName" isRequired value={formData.lastName} onChange={handleInputChange} />
                </div>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <InputField label={t.phone} name="phone" isRequired type="tel" value={formData.phone} onChange={handleInputChange} pattern="[0-9]*" placeholder={t.phonePlaceholder} />
                    <InputField label={t.email} name="email" isRequired type="email" value={formData.email} onChange={handleInputChange} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <InputField label={t.relatedStudent} name="relatedStudentName" isRequired value={formData.relatedStudentName} onChange={handleInputChange} />
                    <InputField label={t.class} name="studentClass" isRequired value={formData.studentClass} onChange={handleInputChange} placeholder={t.classPlaceholder} />
                </div>
              </FormSection>

              <FormSection title={t.productList}>
                {products.map((p, index) => (
                    <motion.div key={p.id} variants={itemVariants} className="grid md:grid-cols-[1fr_auto] gap-4 mb-4 items-end">
                        <InputField label={`${t.productName} ${index + 1}`} isRequired value={p.name} onChange={(e) => handleProductChange(p.id, e.target.value)} />
                        <MotionButton type="button" onClick={() => removeProduct(p.id)} className="w-full md:w-auto bg-red-100 hover:bg-red-200 text-red-600 px-4 py-3 rounded-lg transition-colors disabled:bg-slate-200 disabled:text-slate-500 disabled:opacity-50 font-semibold" disabled={products.length <= 1}>
                            {t.remove}
                        </MotionButton>
                    </motion.div>
                ))}
                <MotionButton type="button" onClick={addProduct} className="bg-sky-100 hover:bg-sky-200 text-sky-700 px-6 py-3 rounded-lg transition-colors font-semibold">{t.addProduct}</MotionButton>
              </FormSection>

              <FormSection title={t.terms}>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6 rounded-r-md">
                    <h5 className="font-semibold text-yellow-800 mb-3">{t.termsNotice}</h5>
                    <ul className="text-yellow-700 space-y-2 text-sm">
                        {t.termPoints.map((point, i) => <li key={i}>• {point}</li>)}
                    </ul>
                </div>
                <div className="space-y-4">
                    <label className="flex items-start p-4 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                        <input type="checkbox" name="agreeTh" required checked={formData.agreeTh} onChange={handleInputChange} className="mt-1 mr-4 h-5 w-5 bg-slate-100 text-sky-600 border-slate-300 rounded focus:ring-sky-500 focus:ring-offset-white" />
                        <span className="text-slate-700">{t.agreeTh}</span>
                    </label>
                    <label className="flex items-start p-4 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                        <input type="checkbox" name="agreeEn" required checked={formData.agreeEn} onChange={handleInputChange} className="mt-1 mr-4 h-5 w-5 bg-slate-100 text-sky-600 border-slate-300 rounded focus:ring-sky-500 focus:ring-offset-white" />
                        <span className="text-slate-700">{t.agreeEn}</span>
                    </label>
                </div>
              </FormSection>

              <motion.div variants={itemVariants} className="flex justify-end items-center mt-10 border-t border-slate-200 pt-8">
                  <MotionButton type="submit" disabled={submitting} className="w-full md:w-auto bg-sky-600 hover:bg-sky-700 text-white px-12 py-4 rounded-2xl text-lg font-semibold transition-all shadow-lg hover:shadow-sky-500/30 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none">
                      {submitting ? t.submitting : t.register}
                  </MotionButton>
              </motion.div>
          </form>
      </motion.div>
    </div>
  );
};

export default RegistrationForm;
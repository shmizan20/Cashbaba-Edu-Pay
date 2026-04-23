import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Grid, Clock, User, ChevronRight, Plus,
  Shield, CreditCard, Smartphone, ShoppingBag,
  BookOpen, Lock, Unlock, ArrowRight, ArrowLeft,
  Coffee, Calendar, CheckCircle2, ChevronLeft,
  Settings, Bell, QrCode, Sliders, Banknote,
  GraduationCap, FileText, ArrowDown, Camera, ScanFace,
  IdCard
} from 'lucide-react';

// --- THEME & STYLES ---
const theme = {
  primary: '#0B6FE8',
  primaryDark: '#0852b0',
  accent: '#EA6C00',
  navy: '#1A2440',
  surface: '#FFFFFF',
  background: '#F7F9FC',
  textSecondary: '#64748B',
  shadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  radius: '16px'
};

// --- MOCK DATA ---
const INITIAL_PARENT_BALANCE = 54500;
const INITIAL_CHILDREN = [
  {
    id: 1,
    name: 'Ayaan Rahman',
    school: 'Dhaka Residential Model College',
    class: 'Class 8, Sec B',
    balance: 1250,
    photo: 'https://i.pravatar.cc/150?img=11',
    cardLocked: false,
    settings: {
      canteen: true,
      shop: true,
      library: true,
      online: false,
      offlineTap: true,
      atm: false
    },
    limits: {
      daily: 500,
      single: 200,
      atm: 0
    }
  },
  {
    id: 2,
    name: 'Zara Rahman',
    school: 'Viqarunnisa Noon School',
    class: 'Class 5, Sec A',
    balance: 800,
    photo: 'https://i.pravatar.cc/150?img=5',
    cardLocked: false,
    settings: {
      canteen: true,
      shop: false,
      library: true,
      online: false,
      offlineTap: true,
      atm: false
    },
    limits: {
      daily: 300,
      single: 150,
      atm: 0
    }
  }
];

const TRANSACTIONS = [
  { id: 1, title: 'School Canteen', date: 'Today, 1:15 PM', amount: -120, type: 'canteen', child: 'Ayaan' },
  { id: 2, title: 'Parent Transfer', date: 'Yesterday, 9:00 AM', amount: 1000, type: 'transfer', child: 'Ayaan' },
  { id: 3, title: 'Library Fine', date: 'Mon, 10:30 AM', amount: -50, type: 'library', child: 'Zara' },
  { id: 4, title: 'Tuition Fee - April', date: 'Sun, 8:00 AM', amount: -4500, type: 'fee', child: 'Ayaan' },
];

const NOTICES = [
  { id: 1, title: 'Annual Sports Day', date: '12 May, 2024', desc: 'The Annual Sports Day will be held next week. Parents are invited to attend.' },
  { id: 2, title: 'Tuition Fee Reminder', date: '01 May, 2024', desc: 'Please clear the tuition fees for the month of May by the 10th.' }
];

const FEES_DATA = [
  { id: 1, title: 'Tuition Fee - May', amount: 4500, status: 'unpaid', child: 'Ayaan' },
  { id: 2, title: 'Exam Fee - Term 1', amount: 1200, status: 'unpaid', child: 'Zara' },
];

const MEALS = [
  { id: 1, name: 'Chicken Tehari', price: 120, image: '🍛' },
  { id: 2, name: 'Egg Sandwich', price: 60, image: '🥪' },
  { id: 3, name: 'Apple Juice', price: 40, image: '🧃' },
];

// --- UI COMPONENTS ---
const Toggle = ({ enabled, onChange, disabled = false }) => (
  <div
    onClick={() => !disabled && onChange(!enabled)}
    className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${enabled ? 'bg-[#0B6FE8]' : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <motion.div
      layout
      className="bg-white w-5 h-5 rounded-full shadow-sm"
      animate={{ x: enabled ? 20 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  </div>
);

const Slider = ({ value, min, max, onChange, step = 50 }) => (
  <div className="w-full mt-2">
    <div className="flex justify-between text-xs font-medium text-[#1A2440] mb-2">
      <span>৳{min}</span>
      <span className="text-[#0B6FE8] font-bold">৳{value}</span>
      <span>৳{max}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-[#0B6FE8]"
    />
  </div>
);

// --- MAIN APP ---
export default function CashBabaApp() {
  const [view, setView] = useState('splash');
  const [parentBalance, setParentBalance] = useState(INITIAL_PARENT_BALANCE);
  const [children, setChildren] = useState(INITIAL_CHILDREN);
  const [activeChildId, setActiveChildId] = useState(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [cart, setCart] = useState([]);

  // Auto-fremgang for splash-skjerm
  useEffect(() => {
    if (view === 'splash') {
      const timer = setTimeout(() => setView('onboarding'), 2500);
      return () => clearTimeout(timer);
    }
  }, [view]);

  // Visningsovergang animasjoner
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const activeChild = children.find(c => c.id === activeChildId);

  const updateChildSettings = (childId, settingType, key, value) => {
    setChildren(prev => prev.map(child => {
      if (child.id === childId) {
        return {
          ...child,
          [settingType]: { ...child[settingType], [key]: value }
        };
      }
      return child;
    }));
  };

  const handleTransfer = () => {
    const amt = Number(transferAmount);
    if (amt > 0 && amt <= parentBalance) {
      setParentBalance(prev => prev - amt);
      setChildren(prev => prev.map(c =>
        c.id === activeChildId ? { ...c, balance: c.balance + amt } : c
      ));
      setTransferAmount('');
      setView('dashboard');
    }
  };

  // --- SCREENS ---

  const Splash = () => (
    <motion.div className="flex flex-col items-center justify-center h-full bg-[#0B6FE8] text-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-3"
      >
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#0B6FE8]">
          <Shield size={32} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">CashBaba<span className="text-[#EA6C00]">.</span></h1>
      </motion.div>
      <p className="mt-4 text-blue-100 font-medium tracking-wide">EduPay Family Platform</p>
    </motion.div>
  );

  const Onboarding = () => (
    <motion.div className="flex flex-col h-full bg-white p-6" variants={pageVariants} initial="initial" animate="in" exit="out">
      <div className="flex-1 flex flex-col items-center justify-center text-center mt-10">
        <div className="w-64 h-64 bg-blue-50 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
          <Smartphone size={80} className="text-[#0B6FE8]" />
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            className="absolute -right-4 top-10 bg-white p-3 rounded-xl shadow-lg"
          >
            <Coffee size={24} className="text-[#EA6C00]" />
          </motion.div>
        </div>
        <h2 className="text-2xl font-bold text-[#1A2440] mb-4">Cashless Schooling</h2>
        <p className="text-[#64748B] mb-8 leading-relaxed">
          Manage your child's daily expenses, pre-book meals, and set smart spending limits instantly.
        </p>
      </div>
      <button
        onClick={() => setView('dashboard')}
        className="w-full py-4 bg-[#0B6FE8] text-white rounded-2xl font-semibold text-lg shadow-[0_8px_20px_rgba(11,111,232,0.3)] active:scale-95 transition-all"
      >
        Get Started
      </button>
    </motion.div>
  );

  const AuthPhone = () => {
    const [phone, setPhone] = useState('');
    return (
      <motion.div className="flex flex-col h-full bg-white p-6" variants={pageVariants} initial="initial" animate="in" exit="out">
        <div className="pt-12 mb-8">
          <button onClick={() => setView('onboarding')} className="p-2 -ml-2 bg-gray-50 rounded-full mb-6">
            <ChevronLeft size={24} className="text-[#1A2440]" />
          </button>
          <h2 className="text-2xl font-bold text-[#1A2440] mb-2">Enter your mobile number</h2>
          <p className="text-[#64748B] text-sm">We'll send you an OTP to verify your identity.</p>
        </div>

        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-4 focus-within:border-[#0B6FE8] focus-within:bg-white transition-all mb-6">
          <span className="text-[#1A2440] font-bold text-lg mr-3 border-r border-gray-300 pr-3">+880</span>
          <input
            type="tel"
            placeholder="1X XX XXX XXX"
            className="w-full bg-transparent outline-none text-[#1A2440] font-medium text-lg"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            maxLength={10}
            autoFocus
          />
        </div>

        <div className="mt-auto">
          <button
            onClick={() => setView('auth_otp')}
            disabled={phone.length < 10}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${phone.length >= 10
                ? 'bg-[#0B6FE8] text-white shadow-[0_8px_20px_rgba(11,111,232,0.3)] active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            Send OTP
          </button>
        </div>
      </motion.div>
    );
  };

  const AuthOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(45);

    useEffect(() => {
      const interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    const handleChange = (element, index) => {
      if (isNaN(element.value)) return false;
      setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
      if (element.nextSibling && element.value !== '') {
        element.nextSibling.focus();
      }
    };

    return (
      <motion.div className="flex flex-col h-full bg-white p-6" variants={pageVariants} initial="initial" animate="in" exit="out">
        <div className="pt-12 mb-8">
          <button onClick={() => setView('auth_phone')} className="p-2 -ml-2 bg-gray-50 rounded-full mb-6">
            <ChevronLeft size={24} className="text-[#1A2440]" />
          </button>
          <h2 className="text-2xl font-bold text-[#1A2440] mb-2">Verify OTP</h2>
          <p className="text-[#64748B] text-sm">Code sent to +880 1711-XXXXXX</p>
        </div>

        <div className="flex justify-between gap-2 mb-8">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
              className="w-12 h-14 bg-gray-50 border border-gray-200 rounded-xl text-center text-xl font-bold text-[#1A2440] focus:border-[#0B6FE8] focus:bg-white outline-none transition"
            />
          ))}
        </div>

        <div className="text-center">
          <p className="text-[#64748B] text-sm mb-2">Didn't receive the code?</p>
          {timer > 0 ? (
            <p className="text-[#1A2440] font-bold text-sm">Resend in 00:{timer < 10 ? `0${timer}` : timer}</p>
          ) : (
            <button className="text-[#0B6FE8] font-bold text-sm">Resend OTP</button>
          )}
        </div>

        <div className="mt-auto">
          <button
            onClick={() => setView('kyc_nid')}
            disabled={otp.join('').length < 6}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${otp.join('').length === 6
                ? 'bg-[#0B6FE8] text-white shadow-[0_8px_20px_rgba(11,111,232,0.3)] active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            Verify & Continue
          </button>
        </div>
      </motion.div>
    );
  };

  const KYCNid = () => {
    return (
      <motion.div className="flex flex-col h-full bg-[#F7F9FC] p-6" variants={pageVariants} initial="initial" animate="in" exit="out">
        <div className="pt-12 mb-6">
          <button onClick={() => setView('auth_otp')} className="p-2 -ml-2 bg-gray-50 rounded-full mb-6 shadow-sm">
            <ChevronLeft size={24} className="text-[#1A2440]" />
          </button>
          <div className="flex items-center text-[#0B6FE8] mb-2">
            <IdCard size={20} className="mr-2" />
            <span className="font-bold text-sm tracking-wider uppercase">Step 1 of 2</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A2440] mb-2">Scan your NID</h2>
          <p className="text-[#64748B] text-sm">Please provide clear photos of your National ID card for verification.</p>
        </div>

        <div className="space-y-4">
          <div className="w-full bg-white border-2 border-dashed border-blue-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition shadow-sm relative overflow-hidden">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#0B6FE8] mb-3">
              <Camera size={28} />
            </div>
            <h3 className="font-bold text-[#1A2440]">NID Front Side</h3>
            <p className="text-xs text-[#64748B] mt-1">Tap to scan front</p>
          </div>

          <div className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition shadow-sm relative overflow-hidden">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-3">
              <Camera size={28} />
            </div>
            <h3 className="font-bold text-[#1A2440]">NID Back Side</h3>
            <p className="text-xs text-[#64748B] mt-1">Tap to scan back</p>
          </div>
        </div>

        <div className="mt-auto">
          <button
            onClick={() => setView('kyc_selfie')}
            className="w-full py-4 rounded-2xl font-bold text-lg bg-[#0B6FE8] text-white shadow-[0_8px_20px_rgba(11,111,232,0.3)] active:scale-95 transition-all"
          >
            Continue to Selfie
          </button>
        </div>
      </motion.div>
    );
  };

  const KYCSelfie = () => {
    return (
      <motion.div className="flex flex-col h-full bg-[#F7F9FC] p-6" variants={pageVariants} initial="initial" animate="in" exit="out">
        <div className="pt-12 mb-6">
          <button onClick={() => setView('kyc_nid')} className="p-2 -ml-2 bg-gray-50 rounded-full mb-6 shadow-sm">
            <ChevronLeft size={24} className="text-[#1A2440]" />
          </button>
          <div className="flex items-center text-[#0B6FE8] mb-2">
            <ScanFace size={20} className="mr-2" />
            <span className="font-bold text-sm tracking-wider uppercase">Step 2 of 2</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A2440] mb-2">Liveness Check</h2>
          <p className="text-[#64748B] text-sm">Position your face inside the frame and blink when instructed.</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Animated Scanning Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-dashed border-[#0B6FE8] opacity-60"
            />
            {/* Outer Ring */}
            <div className="absolute inset-2 rounded-full border-4 border-blue-100" />

            {/* Face Placeholder */}
            <div className="w-56 h-56 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center relative shadow-inner">
              <User size={100} className="text-gray-400 opacity-50" />
              <div className="absolute bottom-4 bg-[#1A2440] text-white text-xs px-3 py-1 rounded-full font-bold opacity-80 shadow-md">
                Look straight
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <button
            onClick={() => setView('dashboard')}
            className="w-full py-4 rounded-2xl font-bold text-lg bg-[#EA6C00] text-white shadow-[0_8px_20px_rgba(234,108,0,0.3)] active:scale-95 transition-all flex items-center justify-center"
          >
            <CheckCircle2 size={20} className="mr-2" /> Complete Registration
          </button>
        </div>
      </motion.div>
    );
  };

  const Dashboard = () => (
    <motion.div className="flex flex-col h-full bg-[#F7F9FC] pb-24 overflow-y-auto hide-scrollbar" variants={pageVariants} initial="initial" animate="in" exit="out">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-white rounded-b-[32px] shadow-sm relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[#64748B] font-medium text-sm">Good Morning,</p>
            <h2 className="text-xl font-bold text-[#1A2440]">Mr. Rahman</h2>
          </div>
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#0B6FE8] relative cursor-pointer">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#EA6C00] rounded-full"></span>
          </div>
        </div>

        {/* Parent Wallet */}
        <div className="bg-gradient-to-br from-[#0B6FE8] to-[#0852b0] rounded-[24px] p-6 text-white shadow-[0_12px_24px_rgba(11,111,232,0.25)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
          <p className="text-blue-100 text-sm font-medium mb-1">Parent Wallet Balance</p>
          <div className="flex items-end space-x-2">
            <h1 className="text-4xl font-bold">৳{parentBalance.toLocaleString()}</h1>
          </div>
          <div className="mt-6 flex">
            <button
              onClick={() => setView('add_money')}
              className="w-full bg-white/20 hover:bg-white/30 transition backdrop-blur-sm py-3 rounded-xl font-bold text-sm flex items-center justify-center shadow-sm"
            >
              <ArrowDown size={18} className="mr-2" /> Add Money
            </button>
          </div>
        </div>
      </div>

      {/* Children Section */}
      <div className="mt-6 px-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#1A2440]">My Children</h3>
          <button onClick={() => setView('add_child')} className="text-[#0B6FE8] text-sm font-semibold flex items-center">
            <Plus size={16} className="mr-1" /> Add
          </button>
        </div>

        <div className="flex overflow-x-auto space-x-4 pb-4 snap-x hide-scrollbar">
          {children.map(child => (
            <div key={child.id} className="min-w-[260px] bg-white rounded-[20px] p-4 shadow-sm snap-center border border-gray-100">
              <div
                className="flex items-center mb-4 cursor-pointer hover:bg-gray-50 p-1 -m-1 rounded-xl transition"
                onClick={() => { setActiveChildId(child.id); setView('child_profile'); }}
              >
                <img src={child.photo} alt={child.name} className="w-12 h-12 rounded-full border-2 border-blue-50 shadow-sm" />
                <div className="ml-3 flex-1">
                  <h4 className="font-bold text-[#1A2440] text-sm flex items-center">
                    {child.name}
                  </h4>
                  <p className="text-xs text-[#64748B] truncate w-32">{child.school}</p>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </div>
              <div className="bg-[#F7F9FC] rounded-xl p-3 mb-4">
                <p className="text-xs text-[#64748B] mb-1">Spending Balance</p>
                <p className="text-lg font-bold text-[#1A2440]">৳{child.balance.toLocaleString()}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => { setActiveChildId(child.id); setView('transfer'); }}
                  className="flex-1 bg-[#0B6FE8] text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center active:scale-95 transition"
                >
                  <ArrowRight size={14} className="mr-1" /> Transfer
                </button>
                <button
                  onClick={() => { setActiveChildId(child.id); setView('controls'); }}
                  className="flex-1 bg-blue-50 text-[#0B6FE8] py-2 rounded-xl text-xs font-semibold flex items-center justify-center active:scale-95 transition"
                >
                  <Settings size={14} className="mr-1" /> Controls
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-2 px-6 pb-6">
        <h3 className="text-lg font-bold text-[#1A2440] mb-4">Quick Services</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: <Coffee size={24} />, label: 'Meals', action: () => setView('meal'), color: 'text-[#EA6C00] bg-orange-50 border-orange-100' },
            { icon: <GraduationCap size={24} />, label: 'Fees', action: () => setView('fees'), color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            { icon: <FileText size={24} />, label: 'Notices', action: () => setView('notices'), color: 'text-purple-600 bg-purple-50 border-purple-100' },
            { icon: <CreditCard size={24} />, label: 'Cards', action: () => { if (children.length > 0) { setActiveChildId(children[0].id); setView('controls'); } }, color: 'text-[#0B6FE8] bg-blue-50 border-blue-100' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center cursor-pointer active:scale-95 transition" onClick={item.action}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-2 border ${item.color}`}>
                {item.icon}
              </div>
              <span className="text-xs font-medium text-[#1A2440]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const CardControls = () => {
    if (!activeChild) return null;
    return (
      <motion.div className="flex flex-col h-full bg-[#F7F9FC] pb-24 overflow-y-auto hide-scrollbar" variants={pageVariants} initial="initial" animate="in" exit="out">
        {/* Header */}
        <div className="px-6 pt-12 pb-4 bg-white sticky top-0 z-20 shadow-sm flex items-center">
          <button onClick={() => setView('dashboard')} className="p-2 -ml-2 bg-gray-50 rounded-full mr-4 active:scale-95">
            <ChevronLeft size={24} className="text-[#1A2440]" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-[#1A2440]">Card & Limits</h2>
            <p className="text-xs text-[#64748B]">{activeChild.name}'s NFC Card</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Card Visual */}
          <div className="relative w-full h-48 bg-gradient-to-tr from-[#1A2440] to-[#2d3748] rounded-[20px] shadow-xl p-5 text-white overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
            <div className="flex justify-between items-start z-10">
              <span className="font-bold text-lg tracking-wider">CashBaba<span className="text-[#EA6C00]">.</span></span>
              <QrCode size={24} className="opacity-80" />
            </div>
            <div className="z-10">
              <p className="font-mono text-lg tracking-[0.15em] mb-1 opacity-90">**** **** **** 4092</p>
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium">{activeChild.name}</span>
                <span className="text-xs opacity-70">STUDENT</span>
              </div>
            </div>
            {activeChild.cardLocked && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="bg-white text-red-500 px-4 py-2 rounded-full font-bold flex items-center text-sm shadow-lg">
                  <Lock size={16} className="mr-2" /> Card Locked
                </div>
              </div>
            )}
          </div>

          {/* Master Switch */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${activeChild.cardLocked ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                {activeChild.cardLocked ? <Lock size={20} /> : <Unlock size={20} />}
              </div>
              <div>
                <h4 className="font-bold text-[#1A2440] text-sm">Master Switch</h4>
                <p className="text-xs text-[#64748B]">{activeChild.cardLocked ? 'Card is frozen' : 'Card is active'}</p>
              </div>
            </div>
            <Toggle
              enabled={!activeChild.cardLocked}
              onChange={(val) => setChildren(prev => prev.map(c => c.id === activeChild.id ? { ...c, cardLocked: !val } : c))}
            />
          </div>

          {/* Spending Categories */}
          <div className={`space-y-4 ${activeChild.cardLocked ? 'opacity-50 pointer-events-none' : ''} transition-opacity`}>
            <h3 className="text-sm font-bold text-[#1A2440] uppercase tracking-wider pl-2">Spending Categories</h3>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Coffee size={20} className="text-[#0B6FE8] mr-3" />
                  <span className="font-medium text-[#1A2440] text-sm">School Canteen</span>
                </div>
                <Toggle enabled={activeChild.settings.canteen} onChange={(v) => updateChildSettings(activeChild.id, 'settings', 'canteen', v)} />
              </div>
              <div className="h-px bg-gray-50 w-full" />
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <ShoppingBag size={20} className="text-[#EA6C00] mr-3" />
                  <span className="font-medium text-[#1A2440] text-sm">Campus Shop</span>
                </div>
                <Toggle enabled={activeChild.settings.shop} onChange={(v) => updateChildSettings(activeChild.id, 'settings', 'shop', v)} />
              </div>
              <div className="h-px bg-gray-50 w-full" />
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <BookOpen size={20} className="text-green-500 mr-3" />
                  <span className="font-medium text-[#1A2440] text-sm">Library Fines</span>
                </div>
                <Toggle enabled={activeChild.settings.library} onChange={(v) => updateChildSettings(activeChild.id, 'settings', 'library', v)} />
              </div>
            </div>
          </div>

          {/* Channel Control */}
          <div className={`space-y-4 ${activeChild.cardLocked ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-sm font-bold text-[#1A2440] uppercase tracking-wider pl-2">Payment Channels</h3>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-[#1A2440] text-sm block">Offline POS Tap</span>
                  <span className="text-xs text-[#64748B]">Tap card at school terminals</span>
                </div>
                <Toggle enabled={activeChild.settings.offlineTap} onChange={(v) => updateChildSettings(activeChild.id, 'settings', 'offlineTap', v)} />
              </div>
              <div className="h-px bg-gray-50 w-full" />
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-[#1A2440] text-sm block">Online Payments</span>
                  <span className="text-xs text-[#64748B]">In-app purchases by child</span>
                </div>
                <Toggle enabled={activeChild.settings.online} onChange={(v) => updateChildSettings(activeChild.id, 'settings', 'online', v)} />
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className={`space-y-4 ${activeChild.cardLocked ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-sm font-bold text-[#1A2440] uppercase tracking-wider pl-2">Limits (BDT)</h3>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-[#1A2440] text-sm flex items-center">
                    <Clock size={16} className="text-[#0B6FE8] mr-2" /> Daily Spending Limit
                  </span>
                </div>
                <Slider
                  min={0} max={2000} step={50}
                  value={activeChild.limits.daily}
                  onChange={(v) => updateChildSettings(activeChild.id, 'limits', 'daily', v)}
                />
              </div>
              <div className="h-px bg-gray-50 w-full" />
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-[#1A2440] text-sm flex items-center">
                    <Shield size={16} className="text-[#EA6C00] mr-2" /> Single Purchase Limit
                  </span>
                </div>
                <Slider
                  min={0} max={1000} step={50}
                  value={activeChild.limits.single}
                  onChange={(v) => updateChildSettings(activeChild.id, 'limits', 'single', v)}
                />
              </div>
            </div>
          </div>

          {/* ATM Access */}
          <div className={`space-y-4 ${activeChild.cardLocked ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-sm font-bold text-[#1A2440] uppercase tracking-wider pl-2">Cash Access</h3>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Banknote size={20} className="text-[#1A2440] mr-3" />
                  <span className="font-medium text-[#1A2440] text-sm">ATM Withdrawals</span>
                </div>
                <Toggle enabled={activeChild.settings.atm} onChange={(v) => updateChildSettings(activeChild.id, 'settings', 'atm', v)} />
              </div>
              {activeChild.settings.atm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-gray-50">
                  <span className="text-xs text-[#64748B] block mb-2">Max ATM Withdrawal Limit (Monthly)</span>
                  <Slider
                    min={0} max={5000} step={500}
                    value={activeChild.limits.atm}
                    onChange={(v) => updateChildSettings(activeChild.id, 'limits', 'atm', v)}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const Transfer = () => {
    if (!activeChild) return null;
    return (
      <motion.div className="flex flex-col h-full bg-white pb-24 overflow-y-auto hide-scrollbar" variants={pageVariants} initial="initial" animate="in" exit="out">
        <div className="px-6 pt-12 pb-4 flex items-center shadow-sm">
          <button onClick={() => setView('dashboard')} className="p-2 -ml-2 bg-gray-50 rounded-full mr-4">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-[#1A2440]">Send Money</h2>
        </div>

        <div className="p-6 flex flex-col items-center">
          <img src={activeChild.photo} alt="Child" className="w-20 h-20 rounded-full shadow-md mb-4 border-4 border-white ring-2 ring-blue-50" />
          <h3 className="text-lg font-bold text-[#1A2440]">To {activeChild.name}</h3>
          <p className="text-sm text-[#64748B] mb-8">Current Balance: ৳{activeChild.balance}</p>

          <div className="w-full bg-[#F7F9FC] rounded-3xl p-6 text-center mb-8 border border-gray-100">
            <span className="text-[#64748B] text-sm font-medium">Enter Amount</span>
            <div className="flex items-center justify-center mt-2">
              <span className="text-2xl font-bold text-[#1A2440] mr-1">৳</span>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="0"
                className="w-32 bg-transparent text-5xl font-bold text-[#0B6FE8] outline-none text-center placeholder-gray-300"
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full mb-8">
            {[200, 500, 1000].map(amt => (
              <button
                key={amt}
                onClick={() => setTransferAmount(amt.toString())}
                className="bg-blue-50 text-[#0B6FE8] py-3 rounded-xl font-bold text-sm hover:bg-[#0B6FE8] hover:text-white transition-colors border border-blue-100"
              >
                +৳{amt}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-6">
          <button
            onClick={handleTransfer}
            disabled={!transferAmount || Number(transferAmount) <= 0 || Number(transferAmount) > parentBalance}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center transition-all ${transferAmount && Number(transferAmount) > 0 && Number(transferAmount) <= parentBalance
                ? 'bg-[#0B6FE8] text-white shadow-[0_8px_20px_rgba(11,111,232,0.3)] active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            Confirm Transfer
          </button>
        </div>
      </motion.div>
    );
  };

  const MealBooking = () => (
    <motion.div className="flex flex-col h-full bg-[#F7F9FC] relative overflow-hidden" variants={pageVariants} initial="initial" animate="in" exit="out">
      <div className="px-6 pt-12 pb-4 bg-white shadow-sm z-20 shrink-0">
        <div className="flex items-center mb-4">
          <button onClick={() => setView('dashboard')} className="p-2 -ml-2 bg-gray-50 rounded-full mr-4">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-[#1A2440]">Meal Booking</h2>
        </div>

        {/* Date Picker */}
        <div className="flex justify-between overflow-x-auto pb-2 hide-scrollbar">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => (
            <div key={day} className={`min-w-[60px] p-3 rounded-2xl flex flex-col items-center justify-center mx-1 cursor-pointer transition ${idx === 0 ? 'bg-[#0B6FE8] text-white shadow-md' : 'bg-gray-50 text-[#64748B] hover:bg-gray-100'
              }`}>
              <span className="text-xs font-medium mb-1">{day}</span>
              <span className={`text-lg font-bold ${idx === 0 ? 'text-white' : 'text-[#1A2440]'}`}>{12 + idx}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-32 hide-scrollbar">
        <h3 className="text-sm font-bold text-[#1A2440] uppercase tracking-wider pl-1 mb-2">Today's Menu</h3>
        {MEALS.map(meal => (
          <div key={meal.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center">
            <div className="w-16 h-16 bg-[#F7F9FC] rounded-xl flex items-center justify-center text-3xl mr-4">
              {meal.image}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[#1A2440] text-sm">{meal.name}</h4>
              <p className="text-[#0B6FE8] font-bold mt-1">৳{meal.price}</p>
            </div>
            <button
              onClick={() => setCart([...cart, meal])}
              className="w-10 h-10 bg-blue-50 text-[#0B6FE8] rounded-full flex items-center justify-center hover:bg-[#0B6FE8] hover:text-white transition active:scale-95"
            >
              <Plus size={20} />
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-28 left-6 right-6 bg-[#1A2440] rounded-2xl p-4 flex justify-between items-center text-white shadow-2xl z-30"
        >
          <div>
            <p className="text-xs text-gray-300">{cart.length} items</p>
            <p className="font-bold">Total: ৳{cart.reduce((a, b) => a + b.price, 0)}</p>
          </div>
          <button
            onClick={() => setView('qr_token')}
            className="bg-[#EA6C00] px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition"
          >
            Checkout
          </button>
        </motion.div>
      )}
    </motion.div>
  );

  const QRToken = () => (
    <motion.div className="flex flex-col h-full bg-[#0B6FE8] text-white p-6 pb-24 overflow-y-auto hide-scrollbar" variants={pageVariants} initial="initial" animate="in" exit="out">
      <div className="pt-8 mb-8 flex justify-between items-center">
        <button onClick={() => { setCart([]); setView('dashboard'); }} className="p-2 bg-white/20 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Digital Token</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white rounded-[32px] p-8 w-full max-w-sm text-center shadow-2xl text-[#1A2440] relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-500 w-12 h-12 rounded-full flex items-center justify-center border-4 border-[#0B6FE8]">
            <CheckCircle2 size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-xl mt-4 mb-1">Order Confirmed</h3>
          <p className="text-[#64748B] text-sm mb-6">Show this QR at the canteen counter</p>

          <div className="border-4 border-gray-100 rounded-2xl p-4 mb-6 inline-block">
            <QrCode size={160} className="text-[#1A2440]" />
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-[#64748B] uppercase tracking-wider mb-1">Token Number</p>
            <p className="text-3xl font-extrabold tracking-widest text-[#0B6FE8]">#A1257</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const HistoryView = () => (
    <motion.div className="flex flex-col h-full bg-[#F7F9FC] pb-24 overflow-y-auto hide-scrollbar" variants={pageVariants} initial="initial" animate="in" exit="out">
      <div className="px-6 pt-12 pb-4 bg-white sticky top-0 shadow-sm z-20">
        <div className="flex items-center mb-4">
          <button onClick={() => setView('dashboard')} className="p-2 -ml-2 bg-gray-50 rounded-full mr-4">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-[#1A2440]">Transaction History</h2>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {TRANSACTIONS.map(tx => (
          <div key={tx.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${tx.amount > 0 ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                {tx.amount > 0 ? <ArrowDown size={20} /> : <ArrowRight size={20} />}
              </div>
              <div>
                <h4 className="font-bold text-[#1A2440] text-sm">{tx.title}</h4>
                <p className="text-xs text-[#64748B]">{tx.date} • {tx.child}</p>
              </div>
            </div>
            <span className={`font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-[#1A2440]'}`}>
              {tx.amount > 0 ? '+' : ''}৳{Math.abs(tx.amount)}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const FeesView = () => (
    <motion.div className="flex flex-col h-full bg-[#F7F9FC] pb-24 overflow-y-auto hide-scrollbar" variants={pageVariants} initial="initial" animate="in" exit="out">
      <div className="px-6 pt-12 pb-4 bg-white sticky top-0 shadow-sm z-20">
        <div className="flex items-center mb-4">
          <button onClick={() => setView('dashboard')} className="p-2 -ml-2 bg-gray-50 rounded-full mr-4">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-[#1A2440]">School Fees</h2>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {FEES_DATA.map(fee => (
          <div key={fee.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-[#1A2440] text-base">{fee.title}</h4>
                <p className="text-sm text-[#64748B]">For {fee.child}</p>
              </div>
              <span className="text-[#0B6FE8] font-bold text-lg">৳{fee.amount}</span>
            </div>
            <button className="w-full bg-[#0B6FE8] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#0852b0] transition active:scale-95">
              Pay Now
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const NoticesView = () => (
    <motion.div className="flex flex-col h-full bg-[#F7F9FC] pb-24 overflow-y-auto hide-scrollbar" variants={pageVariants} initial="initial" animate="in" exit="out">
      <div className="px-6 pt-12 pb-4 bg-white sticky top-0 shadow-sm z-20">
        <div className="flex items-center mb-4">
          <button onClick={() => setView('dashboard')} className="p-2 -ml-2 bg-gray-50 rounded-full mr-4">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-[#1A2440]">School Notices</h2>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {NOTICES.map(notice => (
          <div key={notice.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <Bell size={16} className="text-[#EA6C00] mr-2" />
              <span className="text-xs text-[#64748B] font-medium">{notice.date}</span>
            </div>
            <h4 className="font-bold text-[#1A2440] text-base mb-2">{notice.title}</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">{notice.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const ProfileView = () => (
    <motion.div className="flex flex-col h-full bg-[#F7F9FC] pb-24 overflow-y-auto hide-scrollbar" variants={pageVariants} initial="initial" animate="in" exit="out">
      <div className="px-6 pt-12 pb-6 bg-[#0B6FE8] text-white rounded-b-[32px] shadow-sm z-10">
        <h2 className="text-xl font-bold mb-6 text-center">My Profile</h2>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#0B6FE8] mb-4 shadow-lg border-4 border-blue-300">
            <User size={40} />
          </div>
          <h3 className="text-xl font-bold">Mr. Rahman</h3>
          <p className="text-blue-100 text-sm mt-1">+880 1711-000000</p>
        </div>
      </div>
      <div className="p-6 space-y-3">
        {['Account Settings', 'Linked Bank Accounts', 'Security & PIN', 'Help & Support', 'Log Out'].map((item, idx) => (
          <div key={idx} className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer active:scale-95 transition ${item === 'Log Out' ? 'text-red-500' : 'text-[#1A2440]'}`}>
            <span className="font-medium text-sm">{item}</span>
            <ChevronRight size={20} className={item === 'Log Out' ? 'text-red-500' : 'text-gray-400'} />
          </div>
        ))}
      </div>
    </motion.div>
  );

  const AddChildView = () => {
    const [formData, setFormData] = useState({ name: '', school: '', classInfo: '' });

    const handleSubmit = () => {
      if (formData.name && formData.school) {
        const newChild = {
          id: Date.now(),
          name: formData.name,
          school: formData.school,
          class: formData.classInfo,
          balance: 0,
          photo: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
          cardLocked: false,
          settings: { canteen: true, shop: true, library: true, online: false, offlineTap: true, atm: false },
          limits: { daily: 500, single: 200, atm: 0 }
        };
        setChildren([...children, newChild]);
        setView('dashboard');
      }
    };

    return (
      <motion.div className="flex flex-col h-full bg-[#F7F9FC] pb-24 overflow-y-auto hide-scrollbar" variants={pageVariants} initial="initial" animate="in" exit="out">
        <div className="px-6 pt-12 pb-4 bg-white sticky top-0 shadow-sm z-20">
          <div className="flex items-center mb-4">
            <button onClick={() => setView('dashboard')} className="p-2 -ml-2 bg-gray-50 rounded-full mr-4">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-lg font-bold text-[#1A2440]">Add New Child</h2>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="text-sm font-bold text-[#1A2440] mb-2 block">Student Name</label>
            <input
              type="text"
              placeholder="e.g. Ayaan Rahman"
              className="w-full bg-white border border-gray-200 rounded-xl p-4 outline-none focus:border-[#0B6FE8] transition text-[#1A2440]"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-bold text-[#1A2440] mb-2 block">School Name (EIIN Verified)</label>
            <input
              type="text"
              placeholder="e.g. Dhaka Residential Model College"
              className="w-full bg-white border border-gray-200 rounded-xl p-4 outline-none focus:border-[#0B6FE8] transition text-[#1A2440]"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-bold text-[#1A2440] mb-2 block">Class & Section</label>
            <input
              type="text"
              placeholder="e.g. Class 8, Sec B"
              className="w-full bg-white border border-gray-200 rounded-xl p-4 outline-none focus:border-[#0B6FE8] transition text-[#1A2440]"
              value={formData.classInfo}
              onChange={(e) => setFormData({ ...formData, classInfo: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-auto p-6">
          <button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.school}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center transition-all ${formData.name && formData.school
                ? 'bg-[#0B6FE8] text-white shadow-[0_8px_20px_rgba(11,111,232,0.3)] active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            Confirm & Add
          </button>
        </div>
      </motion.div>
    );
  };

  const AddMoneyView = () => {
    const [topUpAmount, setTopUpAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('bkash');

    const handleTopUp = () => {
      const amt = Number(topUpAmount);
      if (amt > 0) {
        setParentBalance(prev => prev + amt);
        setView('dashboard');
      }
    };

    return (
      <motion.div className="flex flex-col h-full bg-[#F7F9FC] pb-24 overflow-y-auto hide-scrollbar" variants={pageVariants} initial="initial" animate="in" exit="out">
        <div className="px-6 pt-12 pb-4 bg-white sticky top-0 shadow-sm z-20">
          <div className="flex items-center mb-4">
            <button onClick={() => setView('dashboard')} className="p-2 -ml-2 bg-gray-50 rounded-full mr-4">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-lg font-bold text-[#1A2440]">Add Money</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="w-full bg-white rounded-3xl p-6 text-center shadow-sm border border-gray-100">
            <span className="text-[#64748B] text-sm font-medium">Enter Amount to Top Up</span>
            <div className="flex items-center justify-center mt-2">
              <span className="text-2xl font-bold text-[#1A2440] mr-1">৳</span>
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="0"
                className="w-32 bg-transparent text-5xl font-bold text-[#0B6FE8] outline-none text-center placeholder-gray-300"
                autoFocus
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#1A2440] uppercase tracking-wider pl-1 mb-3">Quick Select</h3>
            <div className="grid grid-cols-3 gap-3 w-full">
              {[500, 1000, 5000].map(amt => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt.toString())}
                  className="bg-white text-[#1A2440] py-3 rounded-xl font-bold text-sm hover:border-[#0B6FE8] transition-colors border border-gray-100 shadow-sm"
                >
                  +৳{amt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#1A2440] uppercase tracking-wider pl-1 mb-3">Payment Method</h3>
            <div className="space-y-3">
              {[
                { id: 'bkash', name: 'bKash', icon: <Smartphone size={20} className="text-[#e2136e]" /> },
                { id: 'nagad', name: 'Nagad', icon: <Smartphone size={20} className="text-[#f58220]" /> },
                { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard size={20} className="text-[#0B6FE8]" /> }
              ].map(method => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex items-center p-4 rounded-xl cursor-pointer transition-all border ${paymentMethod === method.id ? 'border-[#0B6FE8] bg-blue-50/50 shadow-sm' : 'border-gray-100 bg-white'
                    }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mr-4">
                    {method.icon}
                  </div>
                  <span className="font-bold text-[#1A2440] flex-1">{method.name}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-[#0B6FE8]' : 'border-gray-300'
                    }`}>
                    {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-[#0B6FE8] rounded-full" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto p-6">
          <button
            onClick={handleTopUp}
            disabled={!topUpAmount || Number(topUpAmount) <= 0}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center transition-all ${topUpAmount && Number(topUpAmount) > 0
                ? 'bg-[#0B6FE8] text-white shadow-[0_8px_20px_rgba(11,111,232,0.3)] active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            Confirm Payment
          </button>
        </div>
      </motion.div>
    );
  };

  const MobileRechargeView = () => {
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('prepaid');

    const handleRecharge = () => {
      const amt = Number(amount);
      if (amt > 0 && amt <= parentBalance && phone.length >= 11) {
        setParentBalance(prev => prev - amt);
        setView('dashboard');
      }
    };

    return (
      <motion.div className="flex flex-col h-full bg-[#F7F9FC] pb-24 overflow-y-auto hide-scrollbar" variants={pageVariants} initial="initial" animate="in" exit="out">
        <div className="px-6 pt-12 pb-4 bg-white sticky top-0 shadow-sm z-20">
          <div className="flex items-center mb-4">
            <button onClick={() => setView('dashboard')} className="p-2 -ml-2 bg-gray-50 rounded-full mr-4">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-lg font-bold text-[#1A2440]">Mobile Recharge</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Phone Input */}
          <div>
            <label className="text-sm font-bold text-[#1A2440] mb-2 block">Mobile Number</label>
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-4 focus-within:border-[#0B6FE8] transition shadow-sm">
              <Smartphone className="text-gray-400 mr-3" size={20} />
              <input
                type="tel"
                placeholder="01X XX XXX XXX"
                className="w-full bg-transparent outline-none text-[#1A2440] font-medium text-lg"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={11}
              />
            </div>
          </div>

          {/* Connection Type */}
          <div className="flex p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setType('prepaid')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${type === 'prepaid' ? 'bg-white text-[#0B6FE8] shadow-sm' : 'text-[#64748B]'}`}
            >
              Prepaid
            </button>
            <button
              onClick={() => setType('postpaid')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${type === 'postpaid' ? 'bg-white text-[#0B6FE8] shadow-sm' : 'text-[#64748B]'}`}
            >
              Postpaid
            </button>
          </div>

          {/* Amount Input */}
          <div className="w-full bg-white rounded-3xl p-6 text-center shadow-sm border border-gray-100">
            <span className="text-[#64748B] text-sm font-medium">Recharge Amount</span>
            <div className="flex items-center justify-center mt-2">
              <span className="text-2xl font-bold text-[#1A2440] mr-1">৳</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-32 bg-transparent text-5xl font-bold text-[#0B6FE8] outline-none text-center placeholder-gray-300"
              />
            </div>
          </div>

          {/* Quick Select */}
          <div>
            <h3 className="text-sm font-bold text-[#1A2440] uppercase tracking-wider pl-1 mb-3">Quick Amounts</h3>
            <div className="grid grid-cols-4 gap-2 w-full">
              {[20, 50, 100, 500].map(amt => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className="bg-white text-[#1A2440] py-2 rounded-xl font-bold text-sm hover:border-[#0B6FE8] hover:text-[#0B6FE8] transition-colors border border-gray-100 shadow-sm"
                >
                  ৳{amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto p-6">
          <button
            onClick={handleRecharge}
            disabled={!amount || Number(amount) <= 0 || phone.length < 11 || Number(amount) > parentBalance}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center transition-all ${amount && Number(amount) > 0 && phone.length >= 11 && Number(amount) <= parentBalance
                ? 'bg-[#0B6FE8] text-white shadow-[0_8px_20px_rgba(11,111,232,0.3)] active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            Recharge Now
          </button>
        </div>
      </motion.div>
    );
  };

  const ChildProfileView = () => {
    if (!activeChild) return null;

    // Filter transactions for this specific child
    const childTransactions = TRANSACTIONS.filter(tx => activeChild.name.includes(tx.child));

    return (
      <motion.div className="flex flex-col h-full bg-[#F7F9FC] pb-24 overflow-y-auto hide-scrollbar" variants={pageVariants} initial="initial" animate="in" exit="out">
        {/* Header */}
        <div className="px-6 pt-12 pb-6 bg-[#0B6FE8] text-white rounded-b-[40px] shadow-sm relative z-10">
          <div className="flex items-center mb-6">
            <button onClick={() => setView('dashboard')} className="p-2 -ml-2 bg-white/20 hover:bg-white/30 rounded-full mr-4 transition backdrop-blur-sm">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-lg font-bold">Student Profile</h2>
          </div>

          <div className="flex flex-col items-center pb-4 text-center">
            <div className="relative mb-4">
              <img src={activeChild.photo} alt={activeChild.name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" />
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                <CheckCircle2 size={12} className="text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{activeChild.name}</h3>
            <p className="text-blue-100 text-sm font-medium">{activeChild.school}</p>
            <div className="inline-block mt-3 px-4 py-1.5 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
              {activeChild.class}
            </div>
          </div>
        </div>

        <div className="px-6 -mt-8 relative z-20 space-y-6">
          {/* Balance Card */}
          <div className="bg-white rounded-[24px] p-6 shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[#64748B] text-sm mb-1">Available Spending Balance</p>
                <h2 className="text-3xl font-bold text-[#1A2440]">৳{activeChild.balance.toLocaleString()}</h2>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#0B6FE8]">
                <Banknote size={24} />
              </div>
            </div>

            <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-50">
              <button
                onClick={() => setView('transfer')}
                className="flex-1 bg-[#0B6FE8] text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center active:scale-95 transition"
              >
                <Plus size={16} className="mr-2" /> Top Up Card
              </button>
              <button
                onClick={() => setView('controls')}
                className="flex-1 bg-gray-50 text-[#1A2440] py-2.5 rounded-xl text-sm font-bold flex items-center justify-center border border-gray-200 active:scale-95 transition hover:bg-gray-100"
              >
                <Settings size={16} className="mr-2" /> Card Limits
              </button>
            </div>
          </div>

          {/* Academic & Attendance Insights */}
          <div>
            <h3 className="text-sm font-bold text-[#1A2440] uppercase tracking-wider pl-1 mb-3">Insights</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-3">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-xs text-[#64748B] mb-1">Attendance (May)</p>
                  <p className="text-xl font-bold text-[#1A2440]">92%</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center text-[#EA6C00] mb-3">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="text-xs text-[#64748B] mb-1">Term 1 Grade</p>
                  <p className="text-xl font-bold text-[#1A2440]">A+</p>
                </div>
              </div>
            </div>
          </div>

          {/* Child's Recent Activity */}
          <div>
            <div className="flex justify-between items-center mb-3 pl-1">
              <h3 className="text-sm font-bold text-[#1A2440] uppercase tracking-wider">Recent Activity</h3>
              <span onClick={() => setView('history')} className="text-[#0B6FE8] text-xs font-bold cursor-pointer hover:underline">See All</span>
            </div>
            <div className="bg-white rounded-[24px] p-2 shadow-sm border border-gray-100">
              {childTransactions.length > 0 ? childTransactions.map((tx, idx) => (
                <div key={tx.id} className={`p-3 flex items-center justify-between ${idx !== childTransactions.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${tx.amount > 0 ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                      {tx.amount > 0 ? <ArrowDown size={18} /> : <ArrowRight size={18} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1A2440] text-sm">{tx.title}</h4>
                      <p className="text-xs text-[#64748B]">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-500' : 'text-[#1A2440]'}`}>
                    {tx.amount > 0 ? '+' : ''}৳{Math.abs(tx.amount)}
                  </span>
                </div>
              )) : (
                <p className="p-4 text-center text-sm text-[#64748B]">No recent activity found.</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // --- NAVIGATION CONFIG ---
  const navItems = [
    { id: 'dashboard', icon: <Home size={22} />, label: 'Home', action: () => setView('dashboard') },
    { id: 'services', icon: <Grid size={22} />, label: 'Services', action: () => setView('meal') }, // Shortcut to Meal for demo
    { id: 'history', icon: <Clock size={22} />, label: 'History', action: () => setView('history') },
    { id: 'profile', icon: <User size={22} />, label: 'Profile', action: () => setView('profile') },
  ];

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center overflow-hidden font-sans">
      {/* Mobile Device Mockup Container */}
      <div className="w-[390px] h-[852px] bg-white rounded-[45px] shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden ring-8 ring-gray-800">

        {/* Dynamic Island (Decorative) */}
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50 mt-2 pointer-events-none">
          <div className="w-32 h-7 bg-black rounded-full"></div>
        </div>

        {/* Content Area */}
        <div className="w-full h-full relative overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            {view === 'splash' && <Splash key="splash" />}
            {view === 'onboarding' && <Onboarding key="onboarding" />}
            {view === 'auth_phone' && <AuthPhone key="auth_phone" />}
            {view === 'auth_otp' && <AuthOTP key="auth_otp" />}
            {view === 'kyc_nid' && <KYCNid key="kyc_nid" />}
            {view === 'kyc_selfie' && <KYCSelfie key="kyc_selfie" />}
            {view === 'dashboard' && <Dashboard key="dashboard" />}
            {view === 'child_profile' && <ChildProfileView key="child_profile" />}
            {view === 'controls' && <CardControls key="controls" />}
            {view === 'transfer' && <Transfer key="transfer" />}
            {view === 'meal' && <MealBooking key="meal" />}
            {view === 'qr_token' && <QRToken key="qr" />}
            {view === 'history' && <HistoryView key="history" />}
            {view === 'fees' && <FeesView key="fees" />}
            {view === 'notices' && <NoticesView key="notices" />}
            {view === 'profile' && <ProfileView key="profile" />}
            {view === 'add_child' && <AddChildView key="add_child" />}
            {view === 'add_money' && <AddMoneyView key="add_money" />}
            {view === 'mobile_recharge' && <MobileRechargeView key="mobile_recharge" />}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        {!['splash', 'onboarding', 'auth_phone', 'auth_otp', 'kyc_nid', 'kyc_selfie', 'qr_token'].includes(view) && (
          <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 pb-6 pt-3 px-6 z-40 rounded-b-[45px]">
            <div className="flex justify-between items-center">
              {navItems.map(item => {
                const isActive = view === item.id || (view === 'meal' && item.id === 'services');
                return (
                  <button
                    key={item.id}
                    onClick={item.action || (() => setView(item.id))}
                    className="flex flex-col items-center justify-center w-16"
                  >
                    <div className={`mb-1 transition-all duration-300 ${isActive ? 'text-[#0B6FE8] scale-110 shadow-sm' : 'text-[#64748B]'}`}>
                      {item.icon}
                    </div>
                    <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-[#0B6FE8]' : 'text-[#64748B]'}`}>
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>
            {/* iOS Home Indicator */}
            <div className="w-32 h-1 bg-gray-300 rounded-full mx-auto mt-5"></div>
          </div>
        )}
      </div>

      {/* Global CSS for hiding scrollbars but keeping functionality */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
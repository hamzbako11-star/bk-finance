import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Landmark,
  Award,
  BookOpen,
  DollarSign,
  Briefcase,
  Layers,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Info,
  Calculator,
  MessageSquare,
  Send,
  Sparkles,
  Check,
  Calendar,
  BookMarked,
  X,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  User,
  Activity,
  Award as PrizeIcon,
  RotateCcw
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { motion, AnimatePresence } from "motion/react";

import Navigation from "./components/Navigation";
import MarketTicker from "./components/MarketTicker";
import { COURSES, INVESTMENT_PACKAGES, ECONOMIC_EVENTS, TESTIMONIALS, GLOSSARY, QUIZ_QUESTIONS, FAQS } from "./data";
import { Course, InvestmentPackage, ChatMessage, ConsultationBooking } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [advisorOpen, setAdvisorOpen] = useState<boolean>(false);
  const [discordAlertOpen, setDiscordAlertOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.src.includes("/api/bako-image")) {
      target.src = "https://drive.google.com/thumbnail?id=1dSeAUi7SUW3yxaT8AWf5Anh6dkovlDEQ&sz=w1000";
    } else if (target.src.includes("/api/bashir-image")) {
      target.src = "https://drive.google.com/thumbnail?id=1pTt1so8hWZt4Ak0hlDzFjSdGx9B4dMg5&sz=w1000";
    } else if (target.src.includes("drive.google.com")) {
      target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&h=800&q=80";
    }
  };

  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "advisor",
      text: "Welcome to BK Finance. I am BK, founder and chief strategist. I can help audit your trading setups, review key price action levels, calculate risk models, or guide your PAP investment strategy. What is your primary focus today?",
      timestamp: new Date()
    }
  ]);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Newsletter subscription states
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [newsletterSuccess, setNewsletterSuccess] = useState<string>("");
  const [newsletterError, setNewsletterError] = useState<string>("");
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState<boolean>(false);

  // Booking states
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    intent: "both" as "education" | "investment" | "both",
    timeframe: "immediate",
    notes: ""
  });
  const [bookingSuccess, setBookingSuccess] = useState<string>("");
  const [bookingError, setBookingError] = useState<string>("");
  const [isSubmittingBooking, setIsSubmittingBooking] = useState<boolean>(false);
  const [activeBookings, setActiveBookings] = useState<ConsultationBooking[]>([]);

  // Calculator states
  const [calcType, setCalcType] = useState<"pip" | "position" | "margin">("position");
  const [accountSize, setAccountSize] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [stopLossPips, setStopLossPips] = useState<number>(20);
  const [currencyPair, setCurrencyPair] = useState<string>("EUR/USD");
  const [calculatedSize, setCalculatedSize] = useState<number>(0.5);

  // Quiz states
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Selected details states
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(COURSES[1]); // default to Intermediate
  const [selectedPackage, setSelectedPackage] = useState<InvestmentPackage | null>(INVESTMENT_PACKAGES[1]); // default to Balanced

  // Sync / fetch active bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      if (response.ok) {
        const data = await response.json();
        setActiveBookings(data);
      }
    } catch (e) {
      console.error("Failed to load bookings");
    }
  };

  // Perform position sizing calculation
  useEffect(() => {
    const riskDollar = accountSize * (riskPercent / 1);
    // Standard pip value calculation: EUR/USD standard lot pip value is $10.
    // Lot Size = Risk Amount / (Stop Loss in Pips * Pip Value for 1 Standard Lot)
    let pipValueFactor = 10; // default for major pairs
    if (currencyPair === "USD/JPY") {
      pipValueFactor = 6.5; // JPY currency adjustment simulation
    } else if (currencyPair === "XAU/USD (Gold)") {
      pipValueFactor = 1.0; // custom gold simulation
    }

    const calculatedLots = riskDollar / (stopLossPips * pipValueFactor);
    setCalculatedSize(parseFloat(calculatedLots.toFixed(2)));
  }, [accountSize, riskPercent, stopLossPips, currencyPair]);

  // Handle Chat message submission
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: chatInput,
      timestamp: new Date()
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          history: chatMessages.map((m) => ({ role: m.sender === "user" ? "user" : "model", parts: [{ text: m.text }] }))
        })
      });

      if (!response.ok) {
        throw new Error("Failed to receive BK Coach guidance");
      }

      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "advisor",
          text: data.text,
          timestamp: new Date()
        }
      ]);
    } catch (error: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "advisor",
          text: `[SYSTEM] connection latency detected. BK Strategy recommendation: Keep capital risk strictly locked at 1% of equity. Error: ${error.message}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Handle Newsletter Submission
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubmittingNewsletter(true);
    setNewsletterSuccess("");
    setNewsletterError("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterSuccess(data.message);
        setNewsletterEmail("");
      } else {
        setNewsletterError(data.error || "Subscription failure.");
      }
    } catch (err) {
      setNewsletterError("Unable to establish server synchronization.");
    } finally {
      setIsSubmittingNewsletter(false);
    }
  };

  // Handle Consultation Booking
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBooking(true);
    setBookingSuccess("");
    setBookingError("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingForm)
      });
      const data = await res.json();
      if (res.ok) {
        setBookingSuccess(`Success! Appointment Reference: ${data.booking.id}. BK's executive assistant will reach out shortly.`);
        setBookingForm({
          name: "",
          email: "",
          phone: "",
          intent: "both",
          timeframe: "immediate",
          notes: ""
        });
        fetchBookings();
      } else {
        setBookingError(data.error || "Booking transaction failed.");
      }
    } catch (err) {
      setBookingError("Unable to reach the BK secure booking vault.");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Handle Quiz Flow
  const handleAnswerSelection = (index: number) => {
    setSelectedAnswerIndex(index);
  };

  const handleNextQuizQuestion = () => {
    if (selectedAnswerIndex === null) return;
    
    const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
    if (selectedAnswerIndex === currentQuestion.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }

    if (currentQuestionIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="min-h-screen bg-[#030d1e] text-slate-100 flex flex-col font-sans relative selection:bg-brand-gold/30 selection:text-white" id="app-root-container">
      
      {/* Navigation Layer */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} onOpenAdvisor={() => setAdvisorOpen(true)} darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Live Market Ticker */}
      <MarketTicker />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* HOMEPAGE VIEW */}
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="space-y-12"
              id="home-view-container"
            >
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0a192f] border border-slate-800 rounded-lg p-6 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 bg-brand-gold/10 border border-brand-gold/20 px-3 py-1 rounded-full text-xs text-brand-gold font-mono uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verified 7-Year Trading Legacy</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-display">
                  Master the Markets.<br />
                  With PAP<br />
                  <span className="text-brand-gold">You're Either in.... or Watching</span>
                </h1>
                
                <p className="text-base sm:text-lg text-brand-slate max-w-xl leading-relaxed">
                  Master pure Price Action Strategy. Learn to read clean candlestick charts, identify key support and resistance zones, and trade raw market flow with absolute precision.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button 
                    onClick={() => setActiveTab("academy")}
                    className="flex items-center justify-center space-x-2 bg-brand-gold text-brand-navy hover:bg-yellow-500 font-bold px-6 py-4 rounded-md transition duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-brand-gold/10"
                  >
                    <span>Start Your Trading Journey</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setActiveTab("invest")}
                    className="flex items-center justify-center space-x-2 border border-slate-700 text-white hover:bg-white/5 font-bold px-6 py-4 rounded-md transition duration-200"
                  >
                    <span>Explore Managed Portfolios</span>
                  </button>
                </div>
              </div>

              {/* Split Metrics Card */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="border-b border-slate-100 pb-4 mb-4 flex items-center justify-between">
                  <span className="text-xs uppercase font-mono text-brand-gold tracking-widest font-bold">Global Live Metrics</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase font-bold">Audited</span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Total AUM</span>
                    <span className="text-3xl font-extrabold text-slate-950 font-display">$67k</span>
                    <span className="text-[10px] text-emerald-600 font-mono block">▲ Stable Performance</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Students Coached</span>
                    <span className="text-3xl font-extrabold text-slate-950 font-display">294</span>
                    <span className="text-[10px] text-slate-500 font-mono block">Personalized Coaching</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Years Experience</span>
                    <span className="text-3xl font-extrabold text-slate-950 font-display">7 Years</span>
                    <span className="text-[10px] text-brand-gold font-mono block font-medium">BK Chief Credentials</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Success Rate</span>
                    <span className="text-3xl font-extrabold text-slate-950 font-display">82.4%</span>
                    <span className="text-[10px] text-emerald-600 font-mono block">LMS Course Completion</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Pure PAP Execution Spreads</span>
                    <span className="text-slate-900 font-mono font-semibold">0.0 Pips Raw</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Risk Mitigation Threshold</span>
                    <span className="text-emerald-700 font-mono font-semibold">1.5% Peak Stop-Loss</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clear Path Segmentation CTA Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#0a192f] border-t-4 border-brand-gold rounded-lg p-6 space-y-4 hover:border-white transition-all duration-300">
                <div className="h-12 w-12 bg-brand-gold/10 border border-brand-gold/30 rounded-lg flex items-center justify-center text-brand-gold">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">I want to Learn Pure Price Action</h3>
                <p className="text-sm text-brand-slate leading-relaxed">
                  Join the BK Academy to dismantle retail misconceptions. Learn raw candlestick patterns, market structure shifts, and key price levels directly from veteran price action coaches.
                </p>
                <button 
                  onClick={() => setActiveTab("academy")}
                  className="inline-flex items-center space-x-1.5 text-xs text-brand-gold font-bold hover:text-white group"
                >
                  <span>Explore Courses & Mentorship</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="bg-[#0a192f] border-t-4 border-emerald-500 rounded-lg p-6 space-y-4 hover:border-white transition-all duration-300">
                <div className="h-12 w-12 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">I want BK to Manage My Capital</h3>
                <p className="text-sm text-brand-slate leading-relaxed">
                  Delegate execution to our audited Price Action master systems. Access conservative, balanced, or aggressive market-flow profiles backed by real-time transparent account ledger updates.
                </p>
                <button 
                  onClick={() => setActiveTab("invest")}
                  className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 font-bold hover:text-white group"
                >
                  <span>Analyze Price Action Managed Allocations</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Live Chart Preview Section (D3/Recharts simulated macro trends) */}
            <div className="bg-[#0a192f] border border-slate-800 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-navy-card-border/50 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">BK Master Performance Growth Chart</h3>
                  <p className="text-xs text-brand-slate">Compounded historical trajectory of BK Managed Portfolios since 2021</p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-brand-slate">
                  <span className="inline-block w-3 h-3 bg-brand-gold rounded-full" />
                  <span>Balanced Growth Portfolio</span>
                  <span className="inline-block w-3 h-3 bg-emerald-400 rounded-full ml-4" />
                  <span>Conservative Core Portfolio</span>
                </div>
              </div>

              <div className="h-72 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { year: "2021", Balanced: 154, Conservative: 128 },
                      { year: "2022", Balanced: 229, Conservative: 168 },
                      { year: "2023", Balanced: 369, Conservative: 213 },
                      { year: "2024", Balanced: 563, Conservative: 284 },
                      { year: "2025", Balanced: 888, Conservative: 367 },
                      { year: "2026 (YTD)", Balanced: 1042, Conservative: 412 }
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorBalanced" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorConservative" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#475569" />
                    <YAxis stroke="#475569" label={{ value: 'Index Base 100', angle: -90, position: 'insideLeft', fill: '#475569' }} />
                    <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", color: "#0f172a" }} />
                    <Area type="monotone" dataKey="Balanced" stroke="#2563eb" fillOpacity={1} fill="url(#colorBalanced)" strokeWidth={3} />
                    <Area type="monotone" dataKey="Conservative" stroke="#10b981" fillOpacity={1} fill="url(#colorConservative)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Course Pathway Highlights */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 font-display">Featured Academy Paths</h2>
                  <p className="text-sm text-brand-slate">Strictly structured education designed for scalable career advancement</p>
                </div>
                <button 
                  onClick={() => setActiveTab("academy")} 
                  className="text-xs text-brand-gold font-bold hover:underline hidden sm:block"
                >
                  View Full Curriculum
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {COURSES.slice(0, 3).map((course) => (
                  <div key={course.id} className="bg-[#0a192f] border border-slate-800 rounded-lg p-5 flex flex-col hover:border-brand-gold/40 transition duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/20 uppercase">
                        {course.tier}
                      </span>
                      <span className="text-xs text-brand-slate font-mono">{course.duration}</span>
                    </div>

                    <h3 className="font-bold text-lg text-white font-display mb-2">{course.title}</h3>
                    <p className="text-xs text-brand-slate leading-relaxed mb-4 flex-1">{course.description}</p>
                    
                    <div className="pt-4 border-t border-navy-card-border/50 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-brand-slate block">Instructor</span>
                        <span className="text-slate-900 font-medium">{course.instructor}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedCourse(course);
                          setActiveTab("academy");
                        }}
                        className="text-xs font-bold text-brand-gold hover:text-white"
                      >
                        Enroll Path
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials Carousel Selection */}
            <div className="bg-gradient-to-r from-brand-navy to-navy-dark border border-slate-800 rounded-lg p-8">
              <h2 className="text-xs uppercase tracking-widest text-brand-gold font-bold mb-6 text-center">Student and Client Voices</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TESTIMONIALS.map((t) => (
                  <div key={t.id} className="bg-navy-dark/60 border border-navy-card-border/40 p-5 rounded-lg flex flex-col space-y-4">
                    <p className="text-sm text-slate-300 italic flex-1 leading-relaxed">
                      "{t.text}"
                    </p>
                    <div className="flex items-center space-x-3 pt-3 border-t border-navy-card-border/30">
                      <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover border border-brand-gold/30" />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{t.name}</h4>
                        <span className="text-[10px] text-brand-slate block">{t.role}</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold block">{t.gainPercent}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter lead magnet section */}
            <div className="bg-[#0a192f] border border-slate-800 rounded-lg p-6 sm:p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl" />
              
              <div className="max-w-2xl mx-auto space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 font-display">Get BK's Weekly Market Outlook</h3>
                <p className="text-sm text-brand-slate">
                  Subscribe to our premium macroeconomic analysis newsletter. Get direct technical levels on EUR/USD, GBP/USD, and XAU/USD delivered to your inbox every Sunday evening before market open.
                </p>

                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input 
                    type="email" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your financial email address" 
                    className="flex-1 bg-navy-dark border border-slate-700 rounded px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-gold"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={isSubmittingNewsletter}
                    className="bg-brand-gold text-brand-navy hover:bg-yellow-500 font-bold px-6 py-3 rounded text-sm transition duration-200"
                  >
                    {isSubmittingNewsletter ? "Syncing..." : "Receive Outlook"}
                  </button>
                </form>

                {newsletterSuccess && <p className="text-xs text-emerald-400 font-mono">{newsletterSuccess}</p>}
                {newsletterError && <p className="text-xs text-rose-400 font-mono">{newsletterError}</p>}

                <p className="text-[10px] text-brand-slate">
                  *We guard your privacy with bank-grade security. No spam. One click unsubscribe.
                </p>
              </div>
            </div>
          </motion.div>
        )}


        {/* ABOUT US VIEW */}
        {activeTab === "about" && (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22 }}
            className="space-y-12"
            id="about-view-container"
          >
            {/* Split Bio */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="relative rounded-lg overflow-hidden border border-brand-gold/30">
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-transparent to-transparent z-10" />
                  <img 
                    src="/api/bako-image" 
                    onError={handleImageError}
                    alt="Bako Hamz (BK)" 
                    referrerPolicy="no-referrer"
                    className="w-full object-cover object-center h-96 lg:h-[450px]" 
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <h3 className="text-xl font-bold text-white font-display">Bako Hamz (BK)</h3>
                    <p className="text-xs text-brand-gold font-mono uppercase tracking-widest">Founder & Managing Director</p>
                  </div>
                </div>
                <div className="bg-[#0a192f] border border-slate-800 p-4 rounded-lg text-center font-mono text-xs text-brand-slate">
                  Verified MyFxBook Audit Rank: Top 0.5% Global Managers
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs uppercase font-mono font-bold text-brand-gold tracking-widest">THE FOUNDER'S STORY</span>
                <h2 className="text-3xl font-extrabold text-slate-950 font-display">A Mission of Radical Transparency in Finance</h2>
                
                <p className="text-sm text-brand-slate leading-relaxed">
                  "I spent my first three years in the market losing money to commercial trading systems, indicators, and online chatrooms selling get-rich-quick courses. It wasn't until I decoded raw price action mechanics and market flow that I learned how price actually transacts without lagging indicators."
                </p>
                
                <p className="text-sm text-brand-slate leading-relaxed">
                  Under BK’s guidance, BK Finance was launched in 2019 with a strict mandate: **eliminate lagging indicators and publish fully transparent audited returns.** We combine high-density pedagogical courses with physical price action managed account operations (PAP), creating a continuous pipeline where graduates can master price action and gain fund allocations.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="bg-[#0a192f] border border-slate-800 p-4 rounded-lg">
                  <h4 className="font-bold text-slate-900 text-sm mb-2 font-display">Professional Credibility</h4>
                  <p className="text-xs text-brand-slate leading-relaxed">
                      7+ Years active trading, certified Series 34 compliant definitions, and custom prop firm risk evaluation mandates.
                    </p>
                  </div>
                  <div className="bg-[#0a192f] border border-slate-800 p-4 rounded-lg">
                  <h4 className="font-bold text-slate-900 text-sm mb-2 font-display">The BK Ecosystem</h4>
                  <p className="text-xs text-brand-slate leading-relaxed">
                      We do not just sell modules. We provide ongoing live community webinars, customized strategy logs, and vetted price action strategies.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision & Regulatory Section */}
            <div className="bg-[#0a192f] border border-slate-800 rounded-lg p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-lg font-display">Our Mission</h3>
                <p className="text-xs text-brand-slate leading-relaxed">
                  To democratize professional price action trading, equipping retail capital with the math, psychology, and risk structures needed to extract long-term consistency from the financial markets.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-lg font-display">Our Vision</h3>
                <p className="text-xs text-brand-slate leading-relaxed">
                  To establish the world's most robust Learn-and-Earn pipeline, where any motivated student can secure a $200,000 funded account by displaying strict risk execution.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-lg font-display">Transparency Standard</h3>
                <p className="text-xs text-brand-slate leading-relaxed">
                  We do not make hypothetical performance claims. Every percentage return and drawdown limit is extracted from live accounts linked directly to verified audit matrices.
                </p>
              </div>
            </div>

            {/* Team Section */}
            <div>
              <h3 className="text-center font-bold text-xl text-slate-950 font-display mb-8">Educators and Analysts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-[#0a192f] border border-slate-800 rounded-lg p-5 text-center">
                  <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80" alt="David Miller" className="h-20 w-20 rounded-full mx-auto object-cover mb-4 border border-brand-gold/30" />
                  <h4 className="font-bold text-slate-900 font-display">David Miller</h4>
                  <span className="text-[10px] text-brand-gold uppercase font-mono block mb-2">Lead Foundation Educator</span>
                  <p className="text-xs text-brand-slate leading-relaxed">Former Chicago Board of Trade options broker specializing in fundamental interest rate differentials.</p>
                </div>
                <div className="bg-[#0a192f] border border-slate-800 rounded-lg p-5 text-center">
                  <img 
                    src="/api/bashir-image" 
                    onError={handleImageError}
                    alt="Bashir Sani Nadada" 
                    referrerPolicy="no-referrer"
                    className="h-20 w-20 rounded-full mx-auto object-cover mb-4 border border-brand-gold/30" 
                  />
                  <h4 className="font-bold text-slate-900 font-display">Bashir Sani Nadada</h4>
                  <span className="text-[10px] text-brand-gold uppercase font-mono block mb-2">Quantitative Strategist</span>
                  <p className="text-xs text-brand-slate leading-relaxed">Expert in algorithmic currency correlations, fair value modeling, and central bank macro flows.</p>
                </div>
                <div className="bg-[#0a192f] border border-slate-800 rounded-lg p-5 text-center animate-pulse-gold">
                  <img 
                    src="/api/bako-image" 
                    onError={handleImageError}
                    alt="BK (Bako)" 
                    referrerPolicy="no-referrer"
                    className="h-20 w-20 rounded-full mx-auto object-cover mb-4 border border-brand-gold/30" 
                  />
                  <h4 className="font-bold text-slate-900 font-display">Bako Hamz (BK)</h4>
                  <span className="text-[10px] text-brand-gold uppercase font-mono block mb-2">Chief Market Strategist</span>
                  <p className="text-xs text-brand-slate leading-relaxed">Founder, lead live execution mentor, and managing director of our private PAP portfolio reserves.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}


        {/* ACADEMY VIEW */}
        {activeTab === "academy" && (
          <motion.div
            key="academy"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22 }}
            className="space-y-12"
            id="academy-view-container"
          >
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs uppercase font-mono text-brand-gold tracking-widest font-bold">BK EDUCATION HUB</span>
              <h2 className="text-3xl font-extrabold text-slate-950 font-display">No Retail Indicators. Pure Candle Mechanics.</h2>
              <p className="text-sm text-brand-slate">
                Our curriculum progresses from the core foundation up to advanced price action models. Select a specific tier below to review details.
              </p>
            </div>

            {/* Split Screen Tier Selection and Curriculums */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left sidebar: Tier List */}
              <div className="lg:col-span-4 space-y-3">
                {COURSES.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex flex-col ${
                      selectedCourse?.id === course.id
                        ? "bg-brand-gold/10 border-brand-gold shadow-lg"
                        : "bg-[#0a192f] border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-[10px] font-mono uppercase text-brand-slate">{course.tier}</span>
                      <span className="text-[10px] text-brand-gold font-bold font-mono">${course.price} USD</span>
                    </div>
                    <span className={`font-bold text-sm font-display ${selectedCourse?.id === course.id ? "text-brand-gold" : "text-slate-900"}`}>{course.title}</span>
                  </button>
                ))}

                {/* Lead into Interactive Quiz CTA */}
                <div className="bg-[#030d1e] border border-dashed border-brand-gold/30 p-4 rounded-lg mt-6">
                  <h4 className="text-xs font-bold text-brand-gold uppercase font-mono mb-2">Test Your Trading Edge</h4>
                  <p className="text-[11px] text-brand-slate leading-relaxed mb-3">
                    Think you have the discipline and knowledge to trade pure market flow? Take our rapid 4-question risk assessment quiz.
                  </p>
                  <button 
                    onClick={() => {
                      setQuizStarted(true);
                      window.scrollTo({ top: document.getElementById("quiz-anchor")?.offsetTop, behavior: "smooth" });
                    }}
                    className="w-full text-center bg-brand-gold/10 border border-brand-gold/30 text-brand-gold font-bold py-2 rounded text-xs hover:bg-brand-gold hover:text-brand-navy transition duration-150"
                  >
                    Launch Assessment Quiz
                  </button>
                </div>
              </div>

              {/* Right content: Curriculum Breakdown */}
              <div className="lg:col-span-8 bg-[#0a192f] border border-slate-800 rounded-lg p-6 sm:p-8 space-y-6">
                {selectedCourse ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-navy-card-border/50 gap-4">
                      <div>
                        <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-bold">{selectedCourse.tier} PATHWAY</span>
                        <h3 className="text-xl font-bold text-slate-950 font-display mt-1">{selectedCourse.title}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-brand-gold font-display">${selectedCourse.price}</span>
                        <span className="text-[10px] text-brand-slate block">LIFETIME ACCESS</span>
                      </div>
                    </div>

                    <p className="text-sm text-brand-slate leading-relaxed">
                      {selectedCourse.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-navy-dark/60 p-4 rounded-lg text-xs">
                      <div>
                        <span className="text-brand-slate block">Duration</span>
                        <span className="text-slate-900 font-bold">{selectedCourse.duration}</span>
                      </div>
                      <div>
                        <span className="text-brand-slate block">Path Format</span>
                        <span className="text-slate-900 font-bold">{selectedCourse.format}</span>
                      </div>
                      <div>
                        <span className="text-brand-slate block">Lead Instructor</span>
                        <span className="text-slate-900 font-bold">{selectedCourse.instructor} ({selectedCourse.instructorTitle})</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase text-brand-gold font-bold tracking-wider">Curriculum Module Breakdown</h4>
                      <div className="space-y-2">
                        {selectedCourse.modules.map((module, i) => (
                          <div key={i} className="flex items-start space-x-3 bg-navy-dark/40 p-3 rounded border border-navy-card-border/30">
                            <span className="text-xs font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded font-bold">
                              Module 0{i+1}
                            </span>
                            <span className="text-xs text-slate-200">{module}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-mono uppercase text-brand-gold font-bold tracking-wider">Key Skills Acquired</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCourse.skillsAcquired.map((skill, i) => (
                          <span key={i} className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded font-mono font-bold">
                            ✔ {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-navy-card-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-emerald-400 font-bold font-mono">📈 {selectedCourse.completionRate}%</span>
                        <span className="text-brand-slate">Average student milestone completion rate</span>
                      </div>
                      <button 
                        onClick={() => {
                          setBookingForm({
                            ...bookingForm,
                            intent: "education",
                            notes: `Interested in enrolling: ${selectedCourse.title}`
                          });
                          setActiveTab("contact");
                        }}
                        className="bg-brand-gold text-brand-navy hover:bg-yellow-500 font-bold px-6 py-3 rounded text-xs transition duration-150 font-display"
                      >
                        Enroll and Secure Seat
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-brand-slate">Select a path from the left sidebar.</div>
                )}
              </div>
            </div>

            {/* Interactive Quiz Assessment Section */}
            <div id="quiz-anchor" className="bg-gradient-to-b from-[#0a192f] to-[#030d1e] border border-slate-800 rounded-lg p-6 sm:p-10">
              <div className="max-w-3xl mx-auto space-y-6">
                {!quizStarted ? (
                  <div className="text-center space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/30 mb-2">
                      <PrizeIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-950 font-display">Price Action Sizing and Market Structure Assessment</h3>
                    <p className="text-sm text-brand-slate max-w-xl mx-auto">
                      Durable wealth creation relies on mathematics, not luck. Test your current technical understanding of risk metrics and market flow cycles. Take this rapid, 4-question assessment.
                    </p>
                    <button 
                      onClick={resetQuiz}
                      className="bg-brand-gold text-brand-navy hover:bg-yellow-500 font-bold px-8 py-3.5 rounded-lg text-sm transition"
                    >
                      Start Technical Quiz
                    </button>
                  </div>
                ) : quizFinished ? (
                  <div className="text-center space-y-6">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <Check className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-bold text-slate-950 font-display">Your Assessment Score: {quizScore} / {QUIZ_QUESTIONS.length}</h4>
                      <p className="text-xs text-brand-slate max-w-md mx-auto">
                        {quizScore === QUIZ_QUESTIONS.length 
                          ? "Exceptional score! You display high strategic alignment. We recommend skipping straight to the Advanced or Mentorship program."
                          : quizScore >= 2 
                          ? "Good base understanding. You understand the math, but may lack execution rules. We suggest our Technical Analysis & Price Action Path."
                          : "Beginner alignment. To preserve capital, you must establish basic order sizing. We strongly advise our Foundations Path."}
                      </p>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <button 
                        onClick={resetQuiz}
                        className="border border-slate-700 hover:bg-white/5 font-bold px-5 py-2.5 rounded text-xs"
                      >
                        Retake Assessment
                      </button>
                      <button 
                        onClick={() => {
                          setBookingForm({
                            ...bookingForm,
                            intent: "education",
                            notes: `Assessment complete. Scored: ${quizScore}/4`
                          });
                          setActiveTab("contact");
                        }}
                        className="bg-brand-gold text-brand-navy hover:bg-yellow-500 font-bold px-5 py-2.5 rounded text-xs"
                      >
                        Discuss Score with BK
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between text-xs text-brand-slate font-mono pb-2 border-b border-navy-card-border/50">
                      <span>QUESTION {currentQuestionIndex + 1} OF {QUIZ_QUESTIONS.length}</span>
                      <span>CURRENT SCORE: {quizScore}</span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 leading-relaxed">
                      {QUIZ_QUESTIONS[currentQuestionIndex].question}
                    </h4>

                    <div className="grid grid-cols-1 gap-3">
                      {QUIZ_QUESTIONS[currentQuestionIndex].options.map((option, index) => {
                        let btnStyle = "bg-navy-dark border-slate-800 text-slate-200 hover:border-brand-gold/40";
                        if (selectedAnswerIndex === index) {
                          btnStyle = "bg-brand-gold/10 border-brand-gold text-brand-gold font-medium";
                        }
                        return (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelection(index)}
                            className={`w-full text-left p-4 rounded-lg border text-xs transition duration-150 ${btnStyle}`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    {selectedAnswerIndex !== null && (
                      <div className="bg-navy-dark/80 border border-navy-card-border p-4 rounded text-xs text-brand-slate leading-relaxed">
                        <span className="font-bold text-brand-gold uppercase block mb-1">Coach Explanation:</span>
                        {QUIZ_QUESTIONS[currentQuestionIndex].explanation}
                      </div>
                    )}

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handleNextQuizQuestion}
                        disabled={selectedAnswerIndex === null}
                        className={`font-bold px-6 py-2.5 rounded text-xs transition ${
                          selectedAnswerIndex !== null 
                            ? "bg-brand-gold text-brand-navy hover:bg-yellow-500" 
                            : "bg-slate-800 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        {currentQuestionIndex + 1 === QUIZ_QUESTIONS.length ? "Finish Assessment" : "Next Question"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}


        {/* INVESTMENT SERVICES VIEW */}
        {activeTab === "invest" && (
          <motion.div
            key="invest"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22 }}
            className="space-y-12"
            id="invest-view-container"
          >
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs uppercase font-mono text-brand-gold tracking-widest font-bold">MANAGED SERVICES</span>
              <h2 className="text-3xl font-extrabold text-slate-950 font-display">Price Action Protocol (PAP) Managed Accounts</h2>
              <p className="text-sm text-brand-slate">
                Delegate technical execution to certified professionals. We trade pooled assets on a direct commission structure with no retail markup.
              </p>
            </div>

            {/* Split packages selector and historical graph */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Package Options */}
              <div className="lg:col-span-4 space-y-3">
                {INVESTMENT_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex flex-col ${
                      selectedPackage?.id === pkg.id
                        ? "bg-brand-gold/10 border-brand-gold shadow-lg"
                        : "bg-[#0a192f] border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-[10px] font-mono uppercase text-brand-slate">{pkg.riskProfile} Risk</span>
                      <span className="text-[10px] text-emerald-400 font-bold font-mono">{pkg.targetMonthlyReturn} Monthly</span>
                    </div>
                    <span className={`font-bold text-sm font-display ${selectedPackage?.id === pkg.id ? "text-brand-gold" : "text-slate-900"}`}>{pkg.name}</span>
                  </button>
                ))}

                {/* Secure Compliance Card */}
                <div className="bg-navy-dark/60 border border-navy-card-border p-4 rounded-lg space-y-3">
                  <div className="flex items-center space-x-2 text-brand-gold text-xs font-bold uppercase font-mono">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Compliance Protocols</span>
                  </div>
                  <p className="text-[10px] text-brand-slate leading-relaxed">
                    All investments require complete identity verification (KYC/AML) under secure clearing brokers. We do not accept cash deposits or execute unlicensed retail pooling.
                  </p>
                </div>
              </div>

              {/* Right Column: Active Package Audit Details */}
              <div className="lg:col-span-8 bg-[#0a192f] border border-slate-800 rounded-lg p-6 sm:p-8 space-y-6">
                {selectedPackage ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-navy-card-border/50 gap-4">
                      <div>
                        <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-bold">{selectedPackage.riskProfile} PROFILE</span>
                        <h3 className="text-xl font-bold text-slate-950 font-display mt-1">{selectedPackage.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-brand-slate block">MINIMUM THRESHOLD</span>
                        <span className="text-xl font-black text-brand-gold font-display">${selectedPackage.minInvestment.toLocaleString()} USD</span>
                      </div>
                    </div>

                    <p className="text-sm text-brand-slate leading-relaxed">
                      {selectedPackage.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-navy-dark/60 p-4 rounded-lg text-xs">
                      <div>
                        <span className="text-brand-slate block">Performance Incentive Fee</span>
                        <span className="text-slate-900 font-bold">{selectedPackage.performanceFee} (High-Water Mark Principle)</span>
                      </div>
                      <div>
                        <span className="text-brand-slate block">Annual Platform Management Fee</span>
                        <span className="text-slate-900 font-bold">{selectedPackage.managementFee}</span>
                      </div>
                      <div className="sm:col-span-2 border-t border-navy-card-border/50 pt-2 mt-2">
                        <span className="text-brand-slate block">Target Demographics & Suitability</span>
                        <span className="text-slate-900 font-bold">{selectedPackage.suitableFor}</span>
                      </div>
                    </div>

                    {/* Historical graph for selected package */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase text-brand-gold font-bold tracking-wider">Audited Performance History</h4>
                      <div className="h-56 bg-navy-dark/40 border border-navy-card-border/30 p-2 rounded">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={selectedPackage.historicalPerformance}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="year" stroke="#475569" />
                            <YAxis stroke="#475569" unit="%" />
                            <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", color: "#0f172a" }} />
                            <Bar dataKey="return" fill="#2563eb" name="Annual % Return" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Current Asset Allocation distribution */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase text-emerald-700 font-bold tracking-wider">Active Asset Allocation</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {selectedPackage.assetAllocation.map((asset, i) => (
                          <div key={i} className="bg-navy-dark/40 border border-navy-card-border/20 p-3 rounded text-center">
                            <span className="text-[10px] text-brand-slate block">{asset.name}</span>
                            <span className="text-sm font-bold text-slate-900 font-mono">{asset.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-6 border-t border-navy-card-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <span className="text-[10px] text-brand-slate italic">
                        *Past performance does not guarantee future success. Leverage carries risk.
                      </span>
                      <button 
                        onClick={() => {
                          setBookingForm({
                            ...bookingForm,
                            intent: "investment",
                            notes: `Interested in Managed Package: ${selectedPackage.name}`
                          });
                          setActiveTab("contact");
                        }}
                        className="bg-brand-gold text-brand-navy hover:bg-yellow-500 font-bold px-6 py-3 rounded text-xs transition duration-150 font-display"
                      >
                        Schedule Portfolio Review
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-brand-slate">Select a managed package option.</div>
                )}
              </div>
            </div>
          </motion.div>
        )}


        {/* TRADING TOOLS VIEW */}
        {activeTab === "tools" && (
          <motion.div
            key="tools"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22 }}
            className="space-y-12"
            id="tools-view-container"
          >
            {/* Split Tools: Calculator & Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Interactive Position Size Sizer */}
              <div className="lg:col-span-7 bg-[#0a192f] border border-slate-800 rounded-lg p-6 sm:p-8 space-y-6">
                <div className="pb-4 border-b border-navy-card-border/50">
                  <span className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">Trading Calculator</span>
                  <h3 className="text-xl font-bold text-slate-950 font-display mt-1">Price Action Position Size Sizer</h3>
                  <p className="text-xs text-brand-slate mt-1">Calculate exact lot allocations to preserve capital relative to stop-loss levels.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-brand-slate font-mono uppercase block">Account Equity ($USD)</label>
                    <input 
                      type="number" 
                      value={accountSize} 
                      onChange={(e) => setAccountSize(Number(e.target.value))}
                      className="w-full bg-navy-dark border border-slate-700 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-gold font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-brand-slate font-mono uppercase block">Capital At Risk (%)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={riskPercent} 
                      onChange={(e) => setRiskPercent(Number(e.target.value))}
                      className="w-full bg-navy-dark border border-slate-700 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-gold font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-brand-slate font-mono uppercase block">Stop-Loss in Pips</label>
                    <input 
                      type="number" 
                      value={stopLossPips} 
                      onChange={(e) => setStopLossPips(Number(e.target.value))}
                      className="w-full bg-navy-dark border border-slate-700 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-gold font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-brand-slate font-mono uppercase block">Currency Pair Standard</label>
                    <select 
                      value={currencyPair}
                      onChange={(e) => setCurrencyPair(e.target.value)}
                      className="w-full bg-navy-dark border border-slate-700 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-gold font-mono"
                    >
                      <option value="EUR/USD">EUR/USD (Spread 0.2)</option>
                      <option value="GBP/USD">GBP/USD (Spread 0.4)</option>
                      <option value="USD/JPY">USD/JPY (Spread 0.3)</option>
                      <option value="XAU/USD (Gold)">XAU/USD Gold (Spread 1.2)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-navy-dark border border-navy-card-border p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-brand-slate block">REVENUE RISK TOLERANCE</span>
                    <span className="text-base font-bold text-slate-900 font-mono">${(accountSize * (riskPercent / 100)).toFixed(2)} USD</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-brand-gold block">RECOMMENDED LOT ALLOCATION</span>
                    <span className="text-2xl font-black text-brand-gold font-mono">{calculatedSize} Lots</span>
                  </div>
                </div>

                <div className="p-3 bg-brand-gold/5 border border-brand-gold/20 rounded text-xs text-brand-slate leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1">Risk Warning Rule:</span>
                  If your Recommended Lot Allocation is larger than what your account margin can leverage, scale down. Never compromise core risk configurations.
                </div>
              </div>

              {/* Right Column: Live Economic Calendar */}
              <div className="lg:col-span-5 bg-[#0a192f] border border-slate-800 rounded-lg p-6 space-y-6">
                <div className="pb-4 border-b border-navy-card-border/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">Economic Feed</span>
                    <h3 className="text-lg font-bold text-slate-950 font-display mt-1">High Impact Events</h3>
                  </div>
                  <Calendar className="h-5 w-5 text-brand-gold" />
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {ECONOMIC_EVENTS.map((event) => {
                    const isHigh = event.importance === "High";
                    return (
                      <div key={event.id} className="bg-navy-dark/60 border border-navy-card-border/30 p-3 rounded space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-brand-slate">{event.time}</span>
                          <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                            isHigh ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
                          }`}>
                            {event.importance} Impact
                          </span>
                        </div>

                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-900 font-mono bg-navy-card-light px-1.5 py-0.5 rounded mr-1.5 inline-block">
                              {event.currency}
                            </span>
                            <span className="text-xs text-slate-200">{event.event}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-1.5 border-t border-navy-card-border/10 text-brand-slate">
                          <div>Prev: <span className="text-slate-900">{event.previous}</span></div>
                          <div>Forecast: <span className="text-slate-900">{event.forecast}</span></div>
                          {event.actual && (
                            <div>Actual: <span className="text-emerald-400 font-bold">{event.actual}</span></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Forex glossary list */}
            <div className="bg-[#0a192f] border border-slate-800 rounded-lg p-6 sm:p-8">
              <div className="flex items-center space-x-2 pb-4 border-b border-navy-card-border/50 mb-6">
                <BookMarked className="h-5 w-5 text-brand-gold" />
                <h3 className="text-lg font-bold text-slate-950 font-display">Lexicon of Price Action Terms</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {GLOSSARY.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <span className="font-bold text-sm text-brand-gold font-mono">{item.term}</span>
                    <p className="text-xs text-brand-slate leading-relaxed">{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}


        {/* COMMUNITY VIEW */}
        {activeTab === "community" && (
          <motion.div
            key="community"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22 }}
            className="space-y-12"
            id="community-view-container"
          >
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs uppercase font-mono text-brand-gold tracking-widest font-bold font-mono">ALUMNI CORE</span>
              <h2 className="text-3xl font-extrabold text-slate-950 font-display">BK Telegram & Private Guild</h2>
              <p className="text-sm text-brand-slate">
                Trading is a lonely pursuit. Join our student forums, share daily chart layouts, and trace market flow entries with vetted partners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#0a192f] border border-slate-800 rounded-lg p-6 sm:p-8 space-y-4">
                <div className="h-12 w-12 bg-sky-500/10 border border-sky-500/30 rounded-lg flex items-center justify-center text-sky-400">
                  <Send className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 font-display">BK Telegram Channel</h3>
                <p className="text-sm text-brand-slate leading-relaxed">
                  Our official Telegram channel serves as the operational command center. Access real-time updates for session markups (London & NY Open), macroeconomic updates, and direct student portfolio peer reviews.
                </p>
                <div className="space-y-2 text-xs text-brand-slate pt-2">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>Active Telegram Subscribers: 1,840+ Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-sky-400" />
                    <span>Daily Technical Submissions: 140+ Charts</span>
                  </div>
                </div>
                <a 
                  href="https://t.me/bkfinancesmarketing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-3 rounded text-xs transition duration-150 text-center"
                >
                  <Send className="h-4 w-4" />
                  <span>Join BK Telegram Channel</span>
                </a>
              </div>

              <div className="bg-[#0a192f] border border-slate-800 rounded-lg p-6 sm:p-8 space-y-4">
                <div className="h-12 w-12 bg-brand-gold/10 border border-brand-gold/30 rounded-lg flex items-center justify-center text-brand-gold">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 font-display">Weekly Live Trading Webinars</h3>
                <p className="text-sm text-brand-slate leading-relaxed">
                  Every Sunday at 18:00 EST and Wednesday at 08:00 EST, BK hosts live interactive group webinars. Watch live trade executions, ask direct structure questions, and get your strategy logs audited in real-time.
                </p>
                <div className="space-y-2 text-xs text-brand-slate pt-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 font-mono">Sunday Outlook:</span>
                    <span>Macro imbalance sweeps & high-probability key levels</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 font-mono">Wednesday Recal:</span>
                    <span>Midweek volatility management and active adjustments</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab("contact")}
                  className="bg-brand-gold text-brand-navy hover:bg-yellow-500 font-bold px-6 py-3 rounded text-xs transition duration-150"
                >
                  Join Next Scheduled Session
                </button>
              </div>
            </div>
          </motion.div>
        )}


        {/* PRICING VIEW */}
        {activeTab === "pricing" && (
          <motion.div
            key="pricing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22 }}
            className="space-y-12"
            id="pricing-view-container"
          >
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs uppercase font-mono text-brand-gold tracking-widest font-bold">TRANSPARENT FEE TIERS</span>
              <h2 className="text-3xl font-extrabold text-slate-950 font-display">Investment Packages and Mentorship Pricing</h2>
              <p className="text-sm text-brand-slate">
                Choose the educational tier that aligns with your timeline, or select an asset allocation managed structure.
              </p>
            </div>

            {/* Course Package Comparison Table */}
            <div className="bg-[#0a192f] border border-slate-800 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-navy-card-border">
                <h3 className="font-bold text-lg text-slate-950 font-display">Academy Tiers Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-brand-slate">
                  <thead className="bg-navy-dark uppercase font-mono font-bold border-b border-navy-card-border/50">
                    <tr>
                      <th className="p-4">Package Parameter</th>
                      <th className="p-4">Foundation</th>
                      <th className="p-4 text-brand-gold">Intermediate (Popular)</th>
                      <th className="p-4">Advanced</th>
                      <th className="p-4">elite Mentorship</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-card-border/30">
                    <tr>
                      <td className="p-4 font-bold text-slate-900">Tuition Price (One-Off)</td>
                      <td className="p-4 text-slate-900">$145 USD</td>
                      <td className="p-4 text-brand-gold font-bold">$299 USD</td>
                      <td className="p-4 text-slate-900">$499 USD</td>
                      <td className="p-4 text-slate-900">$1,000 USD</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-slate-900">Curriculum Level</td>
                      <td className="p-4">Basics & Vocab</td>
                      <td className="p-4 text-slate-900">Full Price Action</td>
                      <td className="p-4">Smart Money Flows</td>
                      <td className="p-4 text-slate-900">Custom Private Coaching</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-slate-900">Live Webinar Access</td>
                      <td className="p-4">❌ No</td>
                      <td className="p-4 text-emerald-600">✔ Bi-Weekly</td>
                      <td className="p-4 text-emerald-600">✔ Fully Included</td>
                      <td className="p-4 text-emerald-600">✔ Daily Live Trading Room</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-slate-900">Private Strategy Audit</td>
                      <td className="p-4">❌ No</td>
                      <td className="p-4">❌ No</td>
                      <td className="p-4 text-emerald-600">✔ Month-End Audit</td>
                      <td className="p-4 text-emerald-600">✔ Direct weekly BK feedback</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-slate-900">Fund Allocation Target</td>
                      <td className="p-4">❌ No</td>
                      <td className="p-4">❌ No</td>
                      <td className="p-4">✔ Prop Firm Prep</td>
                      <td className="p-4 text-brand-gold font-bold">✔ Direct PAP Pipeline</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Money back and client protection */}
            <div className="bg-navy-dark/60 border border-navy-card-border p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm font-display">14-Day Capital Protection Guarantee</h4>
                <p className="text-xs text-brand-slate leading-relaxed">
                  If you enroll in any of our technical video courses (Foundation or Intermediate) and decide within 14 days that our structured approach is not aligned with your path, email our compliance team for an immediate tuition refund.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm font-display">High-Water Mark Principle for Investments</h4>
                <p className="text-xs text-brand-slate leading-relaxed">
                  We only profit when you profit. Our PAP performance fees (15% - 35% depending on package risk profile) operate strictly under the high-water mark. If your account equity declines, no fee is charged until all prior losses are fully recouped.
                </p>
              </div>
            </div>
          </motion.div>
        )}


        {/* CONTACT & SUPPORT VIEW */}
        {activeTab === "contact" && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22 }}
            className="space-y-12"
            id="contact-view-container"
          >
            {/* Split Screen Form & FAQs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Booking & Inquiry Form */}
              <div className="lg:col-span-7 bg-[#0a192f] border border-slate-800 rounded-lg p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">Secure Gate</span>
                  <h3 className="text-xl font-bold text-slate-950 font-display mt-1">Book Your Free Strategic Audit</h3>
                  <p className="text-xs text-brand-slate mt-1">Discuss educational enrolment paths or investment portfolio limits with BK's senior staff.</p>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-brand-slate font-mono uppercase block">Full Legal Name</label>
                      <input 
                        type="text" 
                        required
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                        placeholder="e.g., Marcus Sterling"
                        className="w-full bg-navy-dark border border-slate-700 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-brand-slate font-mono uppercase block">Primary Contact Email</label>
                      <input 
                        type="email" 
                        required
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                        placeholder="e.g., marcus@domain.com"
                        className="w-full bg-navy-dark border border-slate-700 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-brand-slate font-mono uppercase block">Telephone / WhatsApp Contact</label>
                      <input 
                        type="text" 
                        required
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                        placeholder="e.g., +1 555-019-2834"
                        className="w-full bg-navy-dark border border-slate-700 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-brand-slate font-mono uppercase block">Strategic Intent</label>
                      <select 
                        value={bookingForm.intent}
                        onChange={(e) => setBookingForm({ ...bookingForm, intent: e.target.value as any })}
                        className="w-full bg-navy-dark border border-slate-700 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-gold"
                      >
                        <option value="education">Academy / Education Paths</option>
                        <option value="investment">PAP Managed Account Services</option>
                        <option value="both">Both (The Learn-and-Earn Pipeline)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-brand-slate font-mono uppercase block">Availability Timeframe</label>
                    <select 
                      value={bookingForm.timeframe}
                      onChange={(e) => setBookingForm({ ...bookingForm, timeframe: e.target.value })}
                      className="w-full bg-navy-dark border border-slate-700 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-gold"
                    >
                      <option value="immediate">Immediate Focus (Within 48 hours)</option>
                      <option value="week">Next Scheduled Wave (Within 7 days)</option>
                      <option value="general">General Consultation</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-brand-slate font-mono uppercase block">Custom Strategy Goals / Background (Optional)</label>
                    <textarea 
                      rows={3}
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      placeholder="e.g., Current risk profile, years traded, or targeted PAP allocation..."
                      className="w-full bg-navy-dark border border-slate-700 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-gold resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="w-full bg-brand-gold text-brand-navy hover:bg-yellow-500 font-bold py-3.5 rounded text-sm transition font-display"
                  >
                    {isSubmittingBooking ? "Securing Secure Slot..." : "Submit Secure Request Vault"}
                  </button>

                  {bookingSuccess && <p className="text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 p-3 rounded">{bookingSuccess}</p>}
                  {bookingError && <p className="text-xs text-rose-400 font-mono bg-rose-500/10 border border-rose-500/20 p-3 rounded">{bookingError}</p>}
                </form>

                {/* Submissions feedback listing */}
                {activeBookings.length > 0 && (
                  <div className="pt-6 border-t border-navy-card-border/50">
                    <h4 className="text-xs font-bold text-slate-900 uppercase font-mono mb-3">Live Booking Ledger Tracker</h4>
                    <div className="space-y-2">
                      {activeBookings.map((bk, i) => (
                        <div key={i} className="bg-navy-dark/40 border border-navy-card-border/20 p-3 rounded flex items-center justify-between text-xs font-mono">
                          <div>
                            <span className="text-brand-gold block font-bold">{bk.id} — Confirmed</span>
                            <span className="text-brand-slate">Attendee: {bk.name} ({bk.intent.toUpperCase()})</span>
                          </div>
                          <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                            Verified
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: FAQ & Contact Info */}
              <div className="lg:col-span-5 space-y-6">
                {/* Physical Contacts */}
                <div className="bg-[#0a192f] border border-slate-800 rounded-lg p-6 space-y-4">
                  <h3 className="font-bold text-slate-950 text-base font-display">BK Corporate Offices</h3>
                  <div className="space-y-3 text-xs text-brand-slate">
                    <div className="flex items-start space-x-2.5">
                      <MapPin className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-900 block font-bold">BK Headquarters</span>
                        <span>No 32 Center Road, hill crecent, Katsina 83367</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2.5">
                      <Mail className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-900 block font-bold">Secure Support Vault</span>
                        <span>hamzbako11@gmail.com</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2.5">
                      <Phone className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-900 block font-bold">Administrative Desk</span>
                        <span>+234 70 7658 5906</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQs */}
                <div className="bg-[#0a192f] border border-slate-800 rounded-lg p-6 space-y-4">
                  <h3 className="font-bold text-slate-950 text-base font-display">Educational & PAP FAQ</h3>
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {FAQS.map((faq, i) => (
                      <div key={i} className="space-y-1 pb-3 border-b border-navy-card-border/20 last:border-none">
                        <span className="text-xs font-bold text-slate-900 block">{faq.question}</span>
                        <p className="text-[11px] text-brand-slate leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

      </main>

      {/* Persistent Compliance Footer */}
      <footer className="bg-navy-dark border-t border-navy-card-border/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4 text-[10px] text-brand-slate leading-relaxed">
            <div className="max-w-3xl space-y-2">
              <span className="font-bold text-rose-400 uppercase font-mono tracking-widest block">⚠ SECURE RISK WARNING DISCLOSURE</span>
              <p>
                Trading Foreign Exchange (Forex) and Leveraged Financial Instruments involves major risk of loss. It is not suitable for all retail or professional investors. Leverage can magnify losses as well as gains, and you may lose more than your initial deposit.
              </p>
              <p>
                BK Finance publishes historical results derived from transparent third-party audited accounts. Historical performance metrics do not constitute a guarantee of future success. You should only risk capital that you can afford to lose.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 uppercase font-bold text-brand-slate font-mono whitespace-nowrap pt-2 md:pt-0">
              <a href="#" className="hover:text-brand-gold">Terms of Service</a>
              <a href="#" className="hover:text-brand-gold">Privacy Ledger</a>
              <a href="#" className="hover:text-brand-gold">GDPR Rule</a>
              <a href="#" className="hover:text-brand-gold">AML Policy</a>
            </div>
          </div>
          <div className="text-center text-[10px] text-brand-slate/50 border-t border-navy-card-border/30 pt-4">
            © 2026 BK Finance. All Rights Reserved. Fully Certified Technical Price Action Academy & Managed PAP.
          </div>
        </div>
      </footer>


      {/* BK AI ADVISOR DRAWER / CHAT PANEL & DISCORD MODAL */}
      <AnimatePresence>
        {advisorOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" 
            id="chat-drawer-backdrop"
            onClick={() => setAdvisorOpen(false)}
          >
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="w-full max-w-md bg-[#0a192f] h-full flex flex-col shadow-2xl border-l border-brand-gold/30 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-navy-card-border/50 bg-navy-dark flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-brand-gold text-brand-navy flex items-center justify-center font-bold">
                    BK
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white font-display flex items-center">
                      BK AI Advisor <Sparkles className="h-3 w-3 text-brand-gold ml-1 animate-pulse" />
                    </h4>
                    <span className="text-[9px] text-brand-slate uppercase tracking-wider font-mono">7-Yr Price Action Master</span>
                  </div>
                </div>
                <button 
                  onClick={() => setAdvisorOpen(false)}
                  className="text-brand-slate hover:text-white p-1 rounded-full hover:bg-white/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
                {chatMessages.map((msg) => {
                  const isUser = msg.sender === "user";
                  return (
                    <motion.div 
                      key={msg.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] rounded p-3 ${
                        isUser 
                          ? "bg-brand-gold/10 border border-brand-gold/30 text-white" 
                          : "bg-navy-dark border border-navy-card-border text-slate-200"
                      }`}>
                        <div className="text-[9px] text-brand-slate mb-1">
                          {isUser ? "STUDENT" : "COACH BK"} — {msg.timestamp.toLocaleTimeString()}
                        </div>
                        <p className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</p>
                      </div>
                    </motion.div>
                  );
                })}
                {isSending && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-navy-dark border border-navy-card-border text-brand-slate max-w-[85%] rounded p-3">
                      <span>BK is reviewing market structure...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Inputs */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-navy-card-border/50 bg-navy-dark/95 flex gap-2">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask BK about risk sizing or market flow..."
                  className="flex-1 bg-navy-dark border border-slate-700 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-gold font-sans"
                  required
                />
                <button 
                  type="submit"
                  disabled={isSending}
                  className="bg-brand-gold text-brand-navy p-2.5 rounded hover:bg-yellow-500 transition shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* SECURE TELEGRAM OVERLAY MODAL */}
        {discordAlertOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setDiscordAlertOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white border border-slate-200 rounded-lg p-6 shadow-2xl space-y-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded bg-sky-50 text-sky-500 flex items-center justify-center">
                    <Send className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 font-display">Telegram Gateway Access</h4>
                </div>
                <button 
                  onClick={() => setDiscordAlertOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 py-2 text-slate-600 text-sm">
                <p>
                  To protect our professional standard, our Telegram operational command channels are <strong className="text-slate-900">exclusively reserved</strong> for:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 font-sans">
                  <li>Active enrollment students of BK Academy paths</li>
                  <li>Verified Price Action Protocol (PAP) portfolio clients</li>
                </ul>
                <p className="text-xs bg-sky-50/50 text-sky-800 border border-sky-100 p-3 rounded leading-relaxed">
                  <strong>Verification Step:</strong> If you are already a client or student, click below to submit a secure inquiry. Select "Academy/Education" or "Managed Account" and BK's assistant will verify and issue your unique gateway key.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setDiscordAlertOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setDiscordAlertOpen(false);
                    setActiveTab("contact");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-brand-gold text-white rounded-lg transition shadow-sm hover:bg-blue-700"
                >
                  Submit Gateway Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

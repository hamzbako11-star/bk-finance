import React, { useState } from "react";
import { TrendingUp, ShieldCheck, Menu, X, Landmark, Award, Sun, Moon } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdvisor: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Navigation({ activeTab, setActiveTab, onOpenAdvisor, darkMode, setDarkMode }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Us" },
    { id: "academy", label: "Academy" },
    { id: "invest", label: "Investment Services" },
    { id: "tools", label: "Trading Tools" },
    { id: "community", label: "Community" },
    { id: "pricing", label: "Pricing" },
    { id: "contact", label: "Contact" },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-card-border/50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div 
          onClick={() => handleTabClick("home")}
          className="flex cursor-pointer items-center space-x-2"
          id="brand-logo-container"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gold text-white">
            <Landmark className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              BK <span className="text-brand-gold font-extrabold">Finance</span>
            </span>
            <div className="flex items-center space-x-1 text-[9px] text-slate-500 tracking-widest uppercase font-mono">
              <ShieldCheck className="h-3 w-3 text-brand-gold inline" />
              <span>Professional Standard</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                activeTab === item.id
                  ? "text-brand-gold bg-brand-gold/10"
                  : "text-slate-600 hover:text-brand-gold hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Button & Advisor Trigger */}
        <div className="hidden lg:flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg border border-navy-card-border/50 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 transition duration-200"
            aria-label="Toggle theme"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-500" />}
          </button>
          <button 
            onClick={onOpenAdvisor}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-brand-gold/30 bg-brand-gold/5 text-brand-gold hover:bg-brand-gold/10 transition duration-200 font-display"
          >
            BK AI Advisor
          </button>
          <button 
            onClick={() => handleTabClick("contact")}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-brand-gold text-white hover:bg-blue-700 hover:scale-105 transition duration-200 font-display shadow-sm shadow-brand-gold/20"
          >
            Book Free Audit
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center space-x-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded border border-navy-card-border/30 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-500" />}
          </button>
          <button 
            onClick={onOpenAdvisor}
            className="px-2.5 py-1.5 text-[10px] font-semibold rounded bg-brand-gold/10 border border-brand-gold/30 text-brand-gold"
          >
            AI Advisor
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-navy-card-border bg-white px-4 py-3 space-y-2 shadow-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-base font-semibold transition duration-150 ${
                activeTab === item.id
                  ? "text-brand-gold bg-brand-gold/10 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 pb-2 border-t border-navy-card-border flex flex-col space-y-2">
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdvisor();
              }}
              className="w-full text-center py-2.5 rounded-lg border border-brand-gold/30 bg-brand-gold/5 text-brand-gold text-sm font-semibold"
            >
              BK AI Advisor (Ask Me Anything)
            </button>
            <button
              onClick={() => handleTabClick("contact")}
              className="w-full text-center py-2.5 rounded-lg bg-brand-gold text-white text-sm font-semibold shadow-sm"
            >
              Book Free Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

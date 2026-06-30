/**
 * BK Finance - Shared TypeScript Interfaces and Types
 */

export interface Course {
  id: string;
  title: string;
  tier: "Foundation" | "Intermediate" | "Advanced" | "Mentorship";
  description: string;
  duration: string;
  format: "Video Course" | "Live Webinars" | "Hybrid" | "1-on-1 Mentorship";
  instructor: string;
  instructorTitle: string;
  rating: number;
  studentsCount: number;
  modules: string[];
  price: number;
  completionRate: number;
  skillsAcquired: string[];
}

export interface InvestmentPackage {
  id: string;
  name: string;
  riskProfile: "Conservative" | "Balanced" | "Aggressive";
  minInvestment: number;
  targetMonthlyReturn: string;
  managementFee: string;
  performanceFee: string;
  description: string;
  suitableFor: string;
  historicalPerformance: { year: number; return: number }[];
  assetAllocation: { name: string; percentage: number }[];
}

export interface CalendarEvent {
  id: string;
  time: string;
  currency: string;
  event: string;
  importance: "High" | "Medium" | "Low";
  previous: string;
  forecast: string;
  actual?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
  verificationLink?: string;
  gainPercent?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "advisor";
  text: string;
  timestamp: Date;
}

export interface ConsultationBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  intent: "education" | "investment" | "both";
  timeframe: string;
  notes?: string;
  status: "pending" | "confirmed";
  timestamp: Date;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MarketTicker {
  symbol: string;
  price: number;
  change: number;
  high: number;
  low: number;
}

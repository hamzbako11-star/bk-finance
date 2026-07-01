import { Course, InvestmentPackage, CalendarEvent, Testimonial, QuizQuestion } from "./types";

export const COURSES: Course[] = [
  {
    id: "fnd-101",
    title: "Price Action Foundations",
    tier: "Foundation",
    description: "Master the base concepts of price action trading. Learn pip values, contract sizing, margin mechanics, and core exchange pairs with strict risk constraints.",
    duration: "4 Weeks (12 Hours)",
    format: "Video Course",
    instructor: "David Miller",
    instructorTitle: "Senior Price Action Analyst & Educator",
    rating: 4.8,
    studentsCount: 3420,
    modules: [
      "Introduction to Global Currency Markets & Broker Mechanics",
      "Pips, Lot Sizes, Margins, Leverage, and Balance vs Equity",
      "Order Types: Market, Limit, Stop, and Take-Profit/Stop-Loss Mechanics",
      "The Golden Rules of Capital Preservation: Defining Your Core Risk Per Trade"
    ],
    price: 145,
    completionRate: 88,
    skillsAcquired: ["Core Price Action Terminology", "Order Entry Operations", "Basic Risk Sizing", "Leverage Calculations"]
  },
  {
    id: "int-201",
    title: "Technical Analysis & Price Action Mastery",
    tier: "Intermediate",
    description: "Transition from retail metrics to pure candlestick chart mechanics. Understand market structure shifts, price flow transitions, and trade entries using price action mechanics.",
    duration: "6 Weeks (20 Hours)",
    format: "Hybrid",
    instructor: "BK (Bako Hamz)",
    instructorTitle: "Founder & Chief Market Strategist",
    rating: 4.9,
    studentsCount: 2150,
    modules: [
      "Market Structure & Multi-Timeframe Trend Identification",
      "Support & Resistance, Supply & Demand Zones, and Reversal Keys",
      "Key Candlestick Formations, Chart Patterns, and Dynamic Moving Averages",
      "Trading Psychology: Controlling FOMO, Defeating Revenge Trading, and Trading Logs"
    ],
    price: 299,
    completionRate: 74,
    skillsAcquired: ["Price Action Analysis", "Supply & Demand Execution", "Psychological Discipline", "Trade Logging"]
  },
  {
    id: "adv-301",
    title: "Price Action Order Flow & Portfolio Management",
    tier: "Advanced",
    description: "Align with professional market flow structures. Learn advanced price action levels, fair value gaps, market structure shifts, and trading portfolio scaling models.",
    duration: "8 Weeks (30 Hours)",
    format: "Live Webinars",
    instructor: "Bashir Sani Nadada",
    instructorTitle: "Former Quantitative Bank Trader",
    rating: 5.0,
    studentsCount: 1120,
    modules: [
      "Price Action Protocol (PAP): Identifying Market Flow Footprints",
      "Fair Value Gaps (FVG), Support/Resistance Shifts, and Inducement Traps",
      "Correlations, Intermarket Analysis (DXY vs Majors), and Macro Drivers",
      "Professional Portfolio Management, Drawdown Recovery, and Prop Firm Rules"
    ],
    price: 499,
    completionRate: 65,
    skillsAcquired: ["Price Action Concepts", "Market Flow Profiling", "Portfolio Risk Optimization", "Macroeconomic Analysis"]
  },
  {
    id: "men-401",
    title: "Elite One-on-One Mentorship Program",
    tier: "Mentorship",
    description: "Direct elite pipeline. Partner with BK directly. Live daily trading room access, weekly Q&As, customized private trading journal audits, and funded opportunity paths.",
    duration: "3 Months (Custom Schedule)",
    format: "1-on-1 Mentorship",
    instructor: "BK (Bako Hamz)",
    instructorTitle: "Founder & Chief Market Strategist",
    rating: 5.0,
    studentsCount: 180,
    modules: [
      "Custom Strategy Formulation: Adapting Models to Your Lifestyle",
      "Daily Live Trading Sessions: Executing Setups in Real-Time Markets",
      "Weekly Video Audits of Your Personal Trade Logs and Error Correction",
      "Prop Firm Funded Account Assessment & Direct Allocation Path"
    ],
    price: 1000,
    completionRate: 94,
    skillsAcquired: ["Live Strategic Execution", "Fund Allocation Success", "Rigorous Trade Plan Formulation", "Professional Grade Auditing"]
  }
];

export const INVESTMENT_PACKAGES: InvestmentPackage[] = [
  {
    id: "pkg-conservative",
    name: "BK Conservative Wealth PAP",
    riskProfile: "Conservative",
    minInvestment: 5000,
    targetMonthlyReturn: "2.5% - 4.0%",
    managementFee: "1.0% Annualized",
    performanceFee: "15% of Net Profits",
    description: "Preserve principal capital at all costs while steadily outpacing inflation. Trades focus purely on high-volume currency majors (EUR/USD, GBP/USD) during prime sessions with tight stop-losses and a maximum historical drawdown of 4.5%.",
    suitableFor: "Retirement assets, corporate cash balances, and low-risk appetite capital looking for stable, low-volatility compound returns.",
    historicalPerformance: [
      { year: 2021, return: 28.4 },
      { year: 2022, return: 31.2 },
      { year: 2023, return: 26.8 },
      { year: 2024, return: 33.5 },
      { year: 2025, return: 29.1 }
    ],
    assetAllocation: [
      { name: "EUR/USD Major", percentage: 45 },
      { name: "GBP/USD Major", percentage: 35 },
      { name: "USD/JPY Major", percentage: 15 },
      { name: "Cash Reserve", percentage: 5 }
    ]
  },
  {
    id: "pkg-balanced",
    name: "BK Balanced Alpha PAP Account",
    riskProfile: "Balanced",
    minInvestment: 10000,
    targetMonthlyReturn: "4.5% - 6.5%",
    managementFee: "1.5% Annualized",
    performanceFee: "25% of Net Profits",
    description: "Optimized for a balance of safety and aggressive yield. Includes minor currency crosses (EUR/JPY, GBP/JPY) and gold (XAU/USD) with strict mathematical hedging overlays. Maximum historical drawdown limited to 8.2%.",
    suitableFor: "Growth-oriented investors willing to accept controlled, short-term volatility in exchange for accelerated compound interest cycles.",
    historicalPerformance: [
      { year: 2021, return: 54.2 },
      { year: 2022, return: 48.7 },
      { year: 2023, return: 61.3 },
      { year: 2024, return: 52.4 },
      { year: 2025, return: 57.8 }
    ],
    assetAllocation: [
      { name: "USD Majors", percentage: 40 },
      { name: "Cross Rates (JPY/CHF)", percentage: 30 },
      { name: "Precious Metals (Gold)", percentage: 20 },
      { name: "Strategic Cash Block", percentage: 10 }
    ]
  },
  {
    id: "pkg-aggressive",
    name: "BK Aggressive Macro Venture",
    riskProfile: "Aggressive",
    minInvestment: 25000,
    targetMonthlyReturn: "8.0% - 12.0%",
    managementFee: "2.0% Annualized",
    performanceFee: "35% of Net Profits",
    description: "Uncapped volatility model designed to exploit macro imbalances, central bank interest differentials (carry trades), and high-momentum commodity breaks (Gold & Oil). Structured under advanced PAP execution. Max historical drawdown: 15.4%.",
    suitableFor: "High net worth individuals with sophisticated risk profiles, looking to dedicate a satellite portion of their overall net worth to maximum yield.",
    historicalPerformance: [
      { year: 2021, return: 112.5 },
      { year: 2022, return: 94.3 },
      { year: 2023, return: 124.6 },
      { year: 2024, return: 108.1 },
      { year: 2025, return: 118.9 }
    ],
    assetAllocation: [
      { name: "Precious Metals & Crude", percentage: 40 },
      { name: "High-Volatility Majors", percentage: 30 },
      { name: "Exotic Currency Yields", percentage: 20 },
      { name: "Opportunity Reserves", percentage: 10 }
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Marcus Sterling",
    role: "Full-Time Trader & Academy Alumnus",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    text: "Before BK's Intermediate Course, I was blowing accounts every month with retail indicator slop. BK forced me to delete indicators and focus on pure price candles and market structure. Today, I am a fully funded trader with a $100k account.",
    rating: 5,
    gainPercent: "+142% Capital Growth"
  },
  {
    id: "test-2",
    name: "Sophia Vance",
    role: "PAP Managed Portfolio Client",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    text: "As an emergency physician, I have zero time to monitor live charts. Investing in BK's Balanced PAP account gave me access to high-fidelity returns with professional risk management. The quarterly audits are completely transparent.",
    rating: 5,
    gainPercent: "+6.2% Average Monthly Return"
  },
  {
    id: "test-3",
    name: "Kabir Adesina",
    role: "Prop Firm Trader & Mentorship Graduate",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    text: "BK's live trading room access is worth ten times the program fee. Watching how BK controls his nerves and executes trades during high-impact US NFP news taught me the psychological stamina required to trade professionally.",
    rating: 5,
    gainPercent: "Funded $200k Account Secured"
  }
];

export const ECONOMIC_EVENTS: CalendarEvent[] = [
  {
    id: "cal-1",
    time: "08:30 EST",
    currency: "USD",
    event: "Consumer Price Index (CPI) m/m",
    importance: "High",
    previous: "0.2%",
    forecast: "0.3%",
    actual: "0.4%"
  },
  {
    id: "cal-2",
    time: "10:30 EST",
    currency: "USD",
    event: "Crude Oil Inventories",
    importance: "Medium",
    previous: "1.2M",
    forecast: "-0.8M",
    actual: "-1.1M"
  },
  {
    id: "cal-3",
    time: "13:00 EST",
    currency: "GBP",
    event: "BOE Gov Bailey Speaks",
    importance: "High",
    previous: "N/A",
    forecast: "N/A"
  },
  {
    id: "cal-4",
    time: "19:30 EST",
    currency: "AUD",
    event: "Retail Sales m/m",
    importance: "Medium",
    previous: "0.6%",
    forecast: "0.4%"
  },
  {
    id: "cal-5",
    time: "04:30 EST",
    currency: "EUR",
    event: "German HCOB Manufacturing PMI",
    importance: "High",
    previous: "45.4",
    forecast: "46.1",
    actual: "45.9"
  }
];

export const GLOSSARY: { term: string; definition: string }[] = [
  { term: "PAP / MAM", definition: "Price Action Protocol Account. A software setup that allows investors to combine capital into a single account managed by an expert price action trader, distributing profits and losses proportionally." },
  { term: "Spread", definition: "The difference between the BID price (selling price) and the ASK price (buying price) of a currency pair. This represents the primary cost of entering a transaction." },
  { term: "Price Action Protocol (PAP)", definition: "An advanced price action methodology focusing on identifying market structures, key price levels, fair value gaps, and market flow cycles to trade alongside professional desks." },
  { term: "Pip (Percentage in Point)", definition: "The smallest unit of price movement in a currency pair, usually equal to 0.0001 (or 0.01 for Japanese Yen pairs)." },
  { term: "Fair Value Gap (FVG)", definition: "A structural price imbalance on a chart occurring when buying or selling pressure is so intense that price moves rapidly, leaving a gap that market flow eventually returns to fill." },
  { term: "Drawdown", definition: "The peak-to-trough decline in an investment portfolio or trading account, expressed as a percentage. It measures the risk and equity fluctuations of a system." }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "If you have a $10,000 trading account and follow a strict 1% risk management rule per trade, what is the maximum dollar amount you should risk on any single setup?",
    options: ["$10", "$100", "$1,000", "$50"],
    correctIndex: 1,
    explanation: "Correct! 1% of $10,000 is exactly $100. Restricting your risk per trade to 1% is the single most important rule to withstand statistical drawdown cycles."
  },
  {
    id: 2,
    question: "Which of the following describes a 'Fair Value Gap' (FVG) in advanced market structure?",
    options: [
      "The spread charged by execution providers on weekends.",
      "A three-candle pattern showing a rapid displacement of price where the first candle's high and third candle's low do not overlap, leaving a price structural imbalance.",
      "An increase in interest rates by the Federal Reserve.",
      "A wedge pattern indicating trend exhaustion."
    ],
    correctIndex: 1,
    explanation: "Spot on! An FVG is an imbalance on a 3-candle sequence, demonstrating massive price displacement. Markets frequently retrace to rebalance these gaps."
  },
  {
    id: 3,
    question: "What does a 1:3 Risk-to-Reward ratio mean when executing a position?",
    options: [
      "You risk $300 to make $100.",
      "You are trading 3 standard lots simultaneously.",
      "You risk $100 (via stop-loss) to target a potential gain of $300 (via take-profit).",
      "You hold the position open for exactly 3 sessions."
    ],
    correctIndex: 2,
    explanation: "Excellent. A 1:3 ratio means your target gain is 3 times your risk. With a 1:3 ratio, you can lose 70% of your trades and still remain net profitable!"
  },
  {
    id: 4,
    question: "What is a PAP Account structure in Price Action investment?",
    options: [
      "An automated bot trading without human supervision.",
      "A government-backed savings bond denominated in USD.",
      "Price Action Protocol Account, letting investors pool funds into a master portfolio managed by an expert, sharing returns proportionally.",
      "A high-frequency arbitrage pipeline."
    ],
    correctIndex: 2,
    explanation: "Correct! PAP allows professional managers (like BK Finance) to trade pooled investor assets on a single interface with complete compliance and proportional distribution."
  }
];

export const FAQS = [
  {
    question: "Is Price Action trading safe? What are the core risks involved?",
    answer: "No financial trading is completely 'safe.' Trading involves high leverage, which can amplify both profits and losses. BK Finance preaches strict risk management (1-2% absolute risk per trade) to ensure you are never exposed to catastrophic capital damage."
  },
  {
    question: "What is the minimum capital required for BK PAP Services?",
    answer: "Our Managed PAP packages start with a minimum threshold of $5,000 for the Conservative program, $10,000 for the Balanced portfolio, and $25,000 for the Aggressive Macro Venture."
  },
  {
    question: "Can I join the Mentorship Program as an absolute beginner?",
    answer: "Yes. Our Mentorship program is custom-tailored. It includes the Foundation curriculum to build your vocabulary, but scales quickly through 1-on-1 coaching into advanced price action models, leading directly to a funded prop firm path."
  },
  {
    question: "Are the historical returns for managed accounts guaranteed?",
    answer: "Absolutely not. Legally and ethically, BK Finance does not guarantee returns. Historical performance is derived from fully transparent, third-party audited statements. Price action trading involves substantial risk, and you should only trade with risk capital you can afford to lose."
  }
];

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// In-memory databases for full-stack interactivity
const subscriptions: { email: string; timestamp: Date }[] = [];
const bookings: {
  id: string;
  name: string;
  email: string;
  phone: string;
  intent: "education" | "investment" | "both";
  timeframe: string;
  notes?: string;
  status: "pending" | "confirmed";
  timestamp: Date;
}[] = [];

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } else {
    console.warn("GEMINI_API_KEY is not set. AI Coach features will operate in simulated mode.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini API Client:", error);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Advisor Chatbot
  app.post("/api/coach", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!ai) {
        // Fallback simulation if no API Key is present
        const fallbackAnswers = [
          "In Forex trading, risk management is your shield. I suggest never risking more than 1% of your account size per trade. Let's look at your risk-reward ratio first.",
          "Market structure is king. Before trying to enter a position, identify if we are making higher highs and higher lows (uptrend) or lower highs and lower lows (downtrend).",
          "Trading psychology represents 80% of your success. If you let greed dictate your lot sizes, or fear make you close early, no system will save you. Keep a disciplined journal.",
          "Regarding PAMM accounts, we manage funds with institutional discipline. Conservative strategies target 2-4% monthly with tight drawdowns. Let me know if you would like to book a portfolio review.",
          "Institutional order blocks represent where central banks leave their pending orders. Look for strong displacement candles and return-to-origin entries."
        ];
        const randomAnswer = fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
        return res.json({
          text: `[SIMULATED ADVISOR] ${randomAnswer}\n\n*Disclaimer: Forex trading involves significant risk. Historical performance is not indicative of future results.*`
        });
      }

      // Prepare system instructions and payload
      const systemInstruction = 
        "You are 'BK', founder and elite master coach of BK Finance Forex Trading Academy & Investment Services. " +
        "You have 12 years of institutional trading experience, a certified track record, and manage multi-million PAMM portfolios. " +
        "Your tone is professional, authoritative, confident, realistic, and results-driven. " +
        "Keep your advice practical. Focus heavily on risk management (never risking more than 1-2% per trade, risk-reward ratios of at least 1:2 or 1:3), price action, market structure, and disciplined trading psychology. " +
        "When asked about investment services, explain PAMM/MAM structures clearly and transparently. " +
        "Always conclude with a concise, professional financial risk disclosure.";

      // Query Gemini 3.5 Flash
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.75,
        }
      });

      const responseText = response.text || "I apologize, but I am unable to generate a response at this time.";
      res.json({ text: responseText });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "An error occurred while analyzing your strategy: " + error.message });
    }
  });

  // API Route: Subscribe to newsletter
  app.post("/api/subscribe", (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email address is required" });
    }

    if (subscriptions.some(sub => sub.email.toLowerCase() === email.toLowerCase())) {
      return res.status(200).json({ message: "You are already subscribed to the BK Finance daily market outlook!" });
    }

    subscriptions.push({ email, timestamp: new Date() });
    res.status(201).json({ message: "Successfully subscribed to the BK Finance daily market outlook! Welcome aboard." });
  });

  // API Route: Book Free Consultation
  app.post("/api/book", (req, res) => {
    const { name, email, phone, intent, timeframe, notes } = req.body;
    if (!name || !email || !phone || !intent || !timeframe) {
      return res.status(400).json({ error: "All required fields must be completed." });
    }

    const newBooking = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      name,
      email,
      phone,
      intent,
      timeframe,
      notes,
      status: "confirmed" as const,
      timestamp: new Date()
    };

    bookings.push(newBooking);
    res.status(201).json({
      message: "Consultation booked successfully!",
      booking: newBooking
    });
  });

  // API Route: Get Active Bookings (for client-side feedback)
  app.get("/api/bookings", (req, res) => {
    res.json(bookings);
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BK Finance Server] Running on http://localhost:${PORT}`);
  });
}

startServer();

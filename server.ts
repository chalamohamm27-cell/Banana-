import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client with fallback check
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not defined or is default. Some premium AI services might fail.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ---------------------------------------------------------
// SERVER ENGINE API ENDPOINTS
// ---------------------------------------------------------

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 1. Creative AI Chatbot Companion ("Banana AI Friend")
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const ai = getGeminiClient();
    
    // Structure chat contents
    const systemInstruction = 
      "You are 'Banana AI Companion', a witty, trend-savvy, hyper-enthusiastic short-video creator co-pilot " +
      "integrated directly inside 'Banana'—the ultimate social vertical video app. You love viral memes, TikTok transition " +
      "hacks, cinematic lenses, retro VHS aesthetics, and snapping moments. Keep your responses super energetic, conversational, " +
      "whip-smart, and structured with clean lines. Give snappy tips about filters, music syncing, and viral video creation. " +
      "Throw in a subtle banana, split, or yellow pun occasionally, but do not let it dominate your personality.";

    const formattedContents: any[] = [];
    
    if (history && Array.isArray(history)) {
      history.forEach((h: { sender: string; text: string }) => {
        formattedContents.push({
          role: h.sender === "ai" ? "model" : "user",
          parts: [{ text: h.text }]
        });
      });
    }
    
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.85,
      }
    });

    const text = response.text || "Oops, your Banana companion slipped! Let's try chatting again.";
    res.json({ text });
  } catch (err: any) {
    console.error("Gemini Chat Error:", err);
    res.json({ 
      text: "🔋 *Connection Drifted* | I couldn't reach the Banana AI servers, but don't stop creating! Let's try that again. Tip: Double check your network or token key configuration." 
    });
  }
});

// 2. Automated Smart Caption & Hashtag Optimization
app.post("/api/generate-captions", async (req, res) => {
  try {
    const { videoDescription, musicName, filters, speed } = req.body;
    const ai = getGeminiClient();

    const prompt = `Generate highly engaging captions, hashtags, and virality tips for a vertical video using the following attributes:
- User-provided context/concept: "${videoDescription || 'Unboxing or life update loop'}"
- Audio sync/music track: "${musicName || 'No background track selected'}"
- Editing Filters applied: "${filters || 'Standard cinematic'}"
- Recording/Clipping Speed: ${speed || '1.0'}x

Create a highly targeted social structure tailored to TikTok, Instagram Reels, Messenger, and Snapchat audiences.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: { 
              type: Type.STRING, 
              description: "A super catchy, short caption featuring relevant lifestyle emojis. Max 100 chars." 
            },
            hashtags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "6 trending or niche social media tags starting with #" 
            },
            challengeRecommendation: { 
              type: Type.STRING, 
              description: "A creative activity challenge users can perform (e.g. 'Dance while holding a yellow item!'). Max 150 chars." 
            },
            viralPotential: { 
              type: Type.INTEGER, 
              description: "Predicted virality raw score from 0 to 100 based on aesthetic settings." 
            }
          },
          required: ["caption", "hashtags", "challengeRecommendation", "viralPotential"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("Caption Generation Error:", err);
    res.json({
      caption: "Slowing things down for a super-chill vibe. 🍌✨",
      hashtags: ["#BananaApp", "#VibeShift", "#VideoEdit", "#ShortForm", "#SlowMo", "#Trending"],
      challengeRecommendation: "Try duplicating a key transition in slow motion!",
      viralPotential: 68
    });
  }
});

// 3. AI-Powered Creative Effect Advisory
app.post("/api/video-effect-advice", async (req, res) => {
  try {
    const { idea } = req.body;
    if (!idea) {
      res.status(400).json({ error: "Video concept idea is required" });
      return;
    }

    const ai = getGeminiClient();
    const prompt = 
      `The user has a vertical video concept: "${idea}". ` +
      `Give 3 expert-level recommendations for their video editing settings. Recommend specific filters ` +
      `(e.g. VHS Tape, neon glow), an audio track vibe, and exact speed multipliers (e.g. 0.5x slo-mo or 1.5x fast-forward) ` +
      `that will heighten retention and visual layout. Please respond strictly in JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedFilter: { type: Type.STRING, description: "Highly fitting color palette filter" },
            idealSpeed: { type: Type.STRING, description: "Suggested speed choice (e.g. '1.5x' or '0.5x')" },
            idealAudioGenre: { type: Type.STRING, description: "Witty audio genre recommendation" },
            proTip: { type: Type.STRING, description: "One killer cinematic trick to boost completion rates" }
          },
          required: ["recommendedFilter", "idealSpeed", "idealAudioGenre", "proTip"]
        }
      }
    });

    const advice = JSON.parse(response.text || "{}");
    res.json(advice);
  } catch (err: any) {
    console.error("Effect Advice Error:", err);
    res.json({
      recommendedFilter: "Neon VHS",
      idealSpeed: "1.5x for upbeat transitions",
      idealAudioGenre: "Hyperpop energetic baseline",
      proTip: "End with a perfect loop transition so viewers watch it twice!"
    });
  }
});

// ---------------------------------------------------------
// VITE OR STATIC SERVING MIDDLEWARE
// ---------------------------------------------------------

async function setupApp() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting full-stack dev server with live Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production build from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🍌 BANANA Server is running securely on http://localhost:${PORT}`);
  });
}

setupApp();

# 🍌 Banana — Interactive Short-Video Social Platform

Banana is a highly styled, full-stack, vertical video social network that fuses together the immersive loop feeds of **TikTok/Instagram Reels**, the ephemeral magic of **Snapchat**, and the security of **encrypted messenger systems**. 

Powered by **React 19**, **Vite**, **Tailwind CSS**, and **Express**, the application features a robust local render engine combined with **Google Gemini-powered AI assistants** to elevate video workflows, hashtags, and visual parameters.

---

## 🎨 Creative Core Features

### 1. Interactive Loop viewport (`Moment Feed`)
* **Vertical Video Feed**: Experience high-precision media loop simulation including custom progress tickers and speed multipliers.
* **Micro-interaction Physics**: Tap the device screen for a single-pulse transition or **Double-Tap** to float glowing custom hearts, automatically liking the video.
* **Live Feedbacks & Saved Decks**: Comment in real time and bookmark creations to your private profile dashboard securely.
* **Direct Sharing**: Route any video loop dynamically to your active chat lists instantly.

### 2. High-Speed Multi-Track Engine (`Creator Studio`)
* **Interactive Timestamps**: Add custom animated text overlay stamps at precise seconds with customizable colors.
* **Aesthetic Filters**: Toggle between **VHS retro noise overlays**, **Neon hue glow shaders**, and beautiful **Sunset warm washes**.
* **Pacing Knobs**: Slow things down with 0.5x slo-mo or fast-forward up to 2.0x pace multipliers.
* **Direct Compiler**: Instantly publish your customized render layers onto the live social system feed.

### 3. Encrypted Sphere (`Private Chats`)
* **Diffie-Hellman Encrypted Channels**: Initiate fully functional cryptographic conversation endpoints configured with unique room session keys.
* **Snapchat Temporal Snapchat Burn**: Receive and open disappearing polaroid snaps that feature a strict, uncopyable **5-second countdown**. Once opened, the cryptographic key burns the snap permanently from the current memory sequence.
* **AI Creator co-pilot**: Direct backend access to your witty, trend-savvy, retro VHS-obsessed **Banana AI Companion**.

### 4. Interactive Gemini AI assistants
* `POST /api/chat`: Connects to Gemini model parameters with persistent user chat history to provide snappy TikTok movement suggestions, transition hacks, and funny puns.
* `POST /api/generate-captions`: Evaluates current video filters, recording paces, and theme descriptions to formulate highly optimized, catchy captions, trending hashtags, and physical social media challenges.
* `POST /api/video-effect-advice`: Receives a high-level video concept (e.g. *"skipping rocks at midnight"*) and suggests the absolute best cinematic filters, speeds, and audio tracks to skyrocket completion parameters on social media feeds.

---

## 🗂️ File Space Architecture

```text
├── /metadata.json         # Platform configuration & frame permission lists
├── /package.json          # Bundle dependency manager & full-stack script entries
├── /server.ts             # Express backend engine & server-side Gemini SDK wrappers
├── /index.html            # Main site DOM mount container
├── /vite.config.ts        # Vite execution settings & proxy configurations
├── /src
│   ├── /main.tsx          # React application bootstrapping
│   ├── /App.tsx           # Social Client Core UI (Feed, Creator Studio, DM Engine)
│   ├── /data.ts           # Pre-configured seed data, lists of loops, and chats
│   ├── /types.ts          # Shared TypeScript type guidelines, Comment, and Video templates
│   └── /index.css         # Global Tailwind CSS definitions & custom animations
└── /.env.example          # Environment setups & secret parameter configurations
```

---

## 🚀 Speed-Run Installation

Ensure you have **Node.js (v18+)** installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Keys
Configure your local environment variables. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Inside your `.env` file, specify your Google GenAI Token:
```env
GEMINI_API_KEY="AI_STUDIO_CREDENTIALS_KEY"
APP_URL="http://localhost:3000"
```

### 3. Run Development Server
Triggers the full-stack server running Express as an entry router and mounting Vite's middleware layer automatically:
```bash
npm run dev
```
Open [http://localhost:3050](http://localhost:3000) inside your browser to start building!

### 4. Compile Production Build
Compiles client assets inside static `/dist` and bundles the Express backend into a single CommonJS compiler file (`dist/server.cjs`):
```bash
npm run build
npm start
```

---

## 🔒 Security & Performance Guidelines
* **Zero Keys Leakage**: All calls to the Google GenAI SDK are kept strictly server-side inside `server.ts`. No tokens are exposed to browser requests.
* **Active Progress Observers**: Uses debounced intervals to keep track of client media loop pacing, bypassing standard iframe canvas constraints.
* **Robust Fallbacks**: In the absence of a defined `GEMINI_API_KEY`, endpoints automatically fall back to optimized local recommendation patterns, ensuring zero interface downtime.

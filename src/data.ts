import { VideoSource, VideoPost, Chat } from "./types";

export const VIDEO_SOURCES: VideoSource[] = [
  {
    id: "neon-dj",
    title: "⚡ Cyberpunk Synth DJ Loop",
    bgGradient: "from-purple-900 via-indigo-950 to-emerald-950",
    theme: "neon",
    duration: 10,
  },
  {
    id: "beach-vibes",
    title: "🌊 Sunset Coast Drift",
    bgGradient: "from-amber-600 via-orange-850 to-stone-900",
    theme: "sunset",
    duration: 12,
  },
  {
    id: "slowmo-ollie",
    title: "🛹 Retro Midnight Ollie Trick",
    bgGradient: "from-slate-800 via-stone-950 to-cyan-950",
    theme: "vhs",
    duration: 8,
  },
  {
    id: "puppy-bounce",
    title: "🐾 Golden Retriever Grass Springs",
    bgGradient: "from-emerald-700 via-yellow-950 to-zinc-950",
    theme: "none",
    duration: 9,
  }
];

export const INITIAL_VIDEOS: VideoPost[] = [
  {
    id: "post-1",
    username: "skater_sam",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    caption: "Hit that triple-stair Ollie cleanly! Vintage deck feel is unmatched 🛹",
    hashtags: ["#SkateLyfe", "#VHSVibes", "#RetroBoard", "#BananaRoll", "#MidnightOllie"],
    videoSourceId: "slowmo-ollie",
    musicName: "Banana Chill Lo-Fi (88bpm)",
    filters: "vhs",
    speed: 1,
    textOverlays: [
      { text: "Midnight Session", time: 1.5, color: "#FBBF24" },
      { text: "Clean Landing!", time: 4.8, color: "#10B981" }
    ],
    likesCount: 1420,
    commentsCount: 94,
    comments: [
      {
        id: "c-1",
        username: "glow_rider",
        userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
        text: "The pop on that board was incredible, style points for the B&W edit! 🔥",
        timestamp: "2h ago"
      },
      {
        id: "c-2",
        username: "banana_coder",
        userAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        text: "Are you using 0.5x slo-mo on impact? Looks sick!",
        timestamp: "1h ago"
      }
    ],
    sharesCount: 340,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "post-2",
    username: "synth_luna",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    caption: "Testing the live synthesizer under neon rings 🎹 Drop a sub!",
    hashtags: ["#Synthwave", "#Cyberpunk", "#LiveSet", "#Electronic", "#NeonJam"],
    videoSourceId: "neon-dj",
    musicName: "Synthwave Speedrunners",
    filters: "neon",
    speed: 1.5,
    textOverlays: [
      { text: "LIVE STREAM EFFECT", time: 2, color: "#E11D48" }
    ],
    likesCount: 2840,
    commentsCount: 182,
    comments: [
      {
        id: "c-3",
        username: "vj_blitz",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        text: "Lethal bass line. Please upload the full track to Banana Music!",
        timestamp: "5h ago"
      }
    ],
    sharesCount: 1120,
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: "post-3",
    username: "golden_toby",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    caption: "Toby decided gravity was optional today 🐾 Zoom zoom!",
    hashtags: ["#GoldenRetriever", "#PuppyBounce", "#CuteDoggo", "#BestBoy", "#SlowMoJump"],
    videoSourceId: "puppy-bounce",
    musicName: "Sunkissed acoustic guitar",
    filters: "none",
    speed: 0.5,
    textOverlays: [
      { text: "Look at his ears! 🐾", time: 1.2, color: "#FFFFFF" }
    ],
    likesCount: 8930,
    commentsCount: 542,
    comments: [
      {
        id: "c-4",
        username: "cat_overlord",
        userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
        text: "Okay, even as a cat lover, this dog has major airtime 🐶❤️",
        timestamp: "1d ago"
      }
    ],
    sharesCount: 2430,
    isLiked: false,
    isBookmarked: false,
  }
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: "chat-ai",
    partnerName: "Banana AI Companion",
    partnerAvatar: "🤖", // represented with emoji or nice avatar
    isOnline: true,
    isAI: true,
    encryptionLocked: false,
    sessionKey: "ECDH-BANANA-AI-DIRECT",
    messages: [
      {
        id: "m-ai-1",
        sender: "ai",
        text: "Welcome to Banana Space! 🍌 I'm your interactive AI video co-pilot. Want a script, a crazy challenge, or advice on what filter makes videos go viral? Let's chat!",
        timestamp: "10:00 AM",
      }
    ]
  },
  {
    id: "chat-sam",
    partnerName: "skater_sam",
    partnerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    isOnline: true,
    encryptionLocked: true,
    sessionKey: "AES-GCM-72A9-F28B-0C14",
    messages: [
      {
        id: "m-sam-1",
        sender: "friend",
        text: "Hey! Did you catch that Ollie video I published? Built it using the vintage lens in the Banana Studio.",
        timestamp: "Yesterday",
        isEncrypted: true,
        sessionKey: "AES-GCM-72A9-F28B-0C14"
      },
      {
        id: "m-sam-me",
        sender: "me",
        text: "Yeah, it looked super crisp! The pop on that fourth step was amazing. The slow motion landing was spot on.",
        timestamp: "Yesterday",
        isEncrypted: true,
        sessionKey: "AES-GCM-72A9-F28B-0C14"
      },
      {
        id: "m-sam-2",
        sender: "friend",
        text: "Thanks! I'm planning to post a neon skateboard run next. Check this snap out before I post it!",
        timestamp: "10:30 AM",
        isEncrypted: true,
        sessionKey: "AES-GCM-72A9-F28B-0C14"
      },
      {
        id: "m-sam-snap",
        sender: "friend",
        text: "Sent a disappearing photo (5s timer)",
        timestamp: "10:31 AM",
        mediaType: "disappearing-photo",
        mediaUrl: "🛹",
        durationSeconds: 5,
        opened: false,
        isEncrypted: true,
        sessionKey: "AES-GCM-72A9-F28B-0C14"
      }
    ]
  },
  {
    id: "chat-luna",
    partnerName: "synth_luna",
    partnerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    isOnline: false,
    encryptionLocked: false,
    sessionKey: "AES-GCM-DE8F-4411-B532",
    messages: [
      {
        id: "m-luna-1",
        sender: "friend",
        text: "Dude, that synth clip reached 2k views today! The Banana feed is crazy right now.",
        timestamp: "Yesterday",
      },
      {
        id: "m-luna-2",
        sender: "me",
        text: "Congrats Luna! That electronic baseline is a solid jam.",
        timestamp: "Yesterday",
      }
    ]
  }
];

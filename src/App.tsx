import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  MessageSquare,
  PlusCircle,
  Sparkles,
  Heart,
  MessageCircle,
  Send,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Play,
  Zap,
  Sliders,
  Flame,
  CheckCircle,
  Clock,
  ArrowUpRight,
  HelpCircle,
  X,
  ChevronRight,
  User,
  Music,
  Trash2,
  Camera,
  Layers,
  Activity,
  Award
} from "lucide-react";
import { VIDEO_SOURCES, INITIAL_VIDEOS, INITIAL_CHATS } from "./data";
import { VideoPost, Chat, Message, VideoSource, Comment } from "./types";

export default function App() {
  // Navigation & Workspace tabs
  // 'feed' | 'studio' | 'messenger'
  const [activeTab, setActiveTab] = useState<"feed" | "studio" | "messenger">("feed");

  // Global Video list (can be pushed to by the creator studio)
  const [videos, setVideos] = useState<VideoPost[]>(INITIAL_VIDEOS);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const activeVideo = videos[currentVideoIndex] || INITIAL_VIDEOS[0];

  // Feed status states
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>("");
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number }[]>([]);
  const bubbleIdCounter = useRef(0);

  // Sharing Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [videoToShare, setVideoToShare] = useState<VideoPost | null>(null);

  // Chats and Chat selection
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>("chat-ai");
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
  const [chatMessageInput, setChatMessageInput] = useState<string>("");
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);

  // Disappearing Polariod / Photo Timer Snap
  const [revealSnapId, setRevealSnapId] = useState<string | null>(null);
  const [snapCountdown, setSnapCountdown] = useState<number>(0);
  const [revealedPics, setRevealedPics] = useState<Record<string, string>>({
    "m-sam-snap": "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=350&auto=format&fit=crop&q=80" // skating trick preview representation
  });

  // Creator Studio State
  const [studioSourceId, setStudioSourceId] = useState<string>("neon-dj");
  const [studioFilter, setStudioFilter] = useState<string>("neon");
  const [studioSpeed, setStudioSpeed] = useState<number>(1.0);
  const [studioMusic, setStudioMusic] = useState<string>("Retro Synth-Pop Sync");
  
  // Custom Overlays State
  const [studioOverlays, setStudioOverlays] = useState<{ text: string; time: number; color: string }[]>([
    { text: "My Midnight Masterpiece", time: 2, color: "#FBBF24" }
  ]);
  const [overlayText, setOverlayText] = useState<string>("");
  const [overlayTime, setOverlayTime] = useState<number>(2);
  const [overlayColor, setOverlayColor] = useState<string>("#FBBF24");

  // Client Simulation playback
  const [studioPlayProgress, setStudioPlayProgress] = useState<number>(0);
  const [isStudioPlaying, setIsStudioPlaying] = useState<boolean>(true);

  // AI assistant status metrics
  const [videoDescription, setVideoDescription] = useState<string>("");
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState<boolean>(false);
  const [aiCaptions, setAiCaptions] = useState<{
    caption: string;
    hashtags: string[];
    challengeRecommendation: string;
    viralPotential: number;
  } | null>(null);

  // AI Advisor status
  const [advisorConcept, setAdvisorConcept] = useState<string>("");
  const [isConsultingAdvisor, setIsConsultingAdvisor] = useState<boolean>(false);
  const [aiAdvice, setAiAdvice] = useState<{
    recommendedFilter: string;
    idealSpeed: string;
    idealAudioGenre: string;
    proTip: string;
  } | null>(null);

  // System toast or offline helper toast
  const [systemToast, setSystemToast] = useState<{ text: string; type: "success" | "info" } | null>(null);

  // Live progress simulation for playback bar in standard feed
  const [feedProgress, setFeedProgress] = useState<number>(30);

  // Double tap hearts on vertical feed
  const lastTapRef = useRef<number>(0);

  // Trigger floating interactive hearts
  const triggerFloatHearts = (e?: React.MouseEvent) => {
    let clientX = 150;
    let clientY = 250;
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      clientX = e.clientX - rect.left;
      clientY = e.clientY - rect.top;
    }
    const newId = bubbleIdCounter.current++;
    setBubbles(prev => [...prev, { id: newId, x: clientX, y: clientY }]);
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== newId));
    }, 850);
  };

  const handleVideoAreaClick = (e: React.MouseEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      triggerFloatHearts(e);
      handleLikeToggle(activeVideo.id);
      showToast("Loved this vibes! 💛 Floating to feed.", "success");
    } else {
      // Single tap -> toggle play/pause or trigger float hearts slightly
      setFeedProgress(p => (p > 95 ? 0 : p + 5));
    }
    lastTapRef.current = now;
  };

  // Helper alert toast
  const showToast = (text: string, type: "success" | "info" = "success") => {
    setSystemToast({ text, type });
    setTimeout(() => {
      setSystemToast(null);
    }, 4000);
  };

  // Handle Feed likes
  const handleLikeToggle = (postId: string) => {
    setVideos(prev =>
      prev.map(v => {
        if (v.id === postId) {
          const updatedLiked = !v.isLiked;
          return {
            ...v,
            isLiked: updatedLiked,
            likesCount: updatedLiked ? v.likesCount + 1 : v.likesCount - 1
          };
        }
        return v;
      })
    );
  };

  // Handle Feed bookmarking
  const handleBookmarkToggle = (postId: string) => {
    setVideos(prev =>
      prev.map(v => {
        if (v.id === postId) {
          const updatedBookmarked = !v.isBookmarked;
          showToast(updatedBookmarked ? "Vibe Saved to your Deck! 📁" : "Removed from Deck", "info");
          return {
            ...v,
            isBookmarked: updatedBookmarked
          };
        }
        return v;
      })
    );
  };

  // Handle Comment Adding
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment: Comment = {
      id: `rc-${Date.now()}`,
      username: "you_the_creator",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      text: commentInput.trim(),
      timestamp: "Just now"
    };

    setVideos(prev =>
      prev.map(v => {
        if (v.id === activeVideo.id) {
          return {
            ...v,
            commentsCount: v.commentsCount + 1,
            comments: [newComment, ...v.comments]
          };
        }
        return v;
      })
    );

    setCommentInput("");
    showToast("Comment posted live! 💬", "success");
  };

  // Share post helper
  const triggerShareMenu = (video: VideoPost) => {
    setVideoToShare(video);
    setIsShareModalOpen(true);
  };

  const handleShareToFriend = (chatId: string) => {
    if (!videoToShare) return;

    const targetChat = chats.find(c => c.id === chatId);
    if (!targetChat) return;

    // Create shared message
    const sharedMsg: Message = {
      id: `shared-msg-${Date.now()}`,
      sender: "me",
      text: `🎬 Shared Video: "${videoToShare.caption.substring(0, 30)}..."`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mediaType: "shared-post",
      sharedPostId: videoToShare.id,
      isEncrypted: targetChat.encryptionLocked,
      sessionKey: targetChat.encryptionLocked ? targetChat.sessionKey : undefined
    };

    setChats(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: [...c.messages, sharedMsg]
          };
        }
        return c;
      })
    );

    setIsShareModalOpen(false);
    showToast(`Post shared to ${targetChat.partnerName}! 🍌✨`, "success");
    // Switch tab to messenger to see it!
    setActiveChatId(chatId);
    setActiveTab("messenger");
  };

  // Messenger logic: send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageInput.trim()) return;

    const userMessageText = chatMessageInput.trim();
    setChatMessageInput("");

    // 1. Create client message
    const userMsg: Message = {
      id: `user-msg-${Date.now()}`,
      sender: "me",
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: activeChat.encryptionLocked,
      sessionKey: activeChat.encryptionLocked ? activeChat.sessionKey : undefined
    };

    // Update active chat with user msg
    const updatedChats = chats.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          messages: [...c.messages, userMsg]
        };
      }
      return c;
    });
    setChats(updatedChats);

    // If chat is the AI companion, let's query our real server-side proxy route
    if (activeChat.isAI) {
      setIsSendingMessage(true);
      try {
        // Collect conversion history
        const relevantHistory = activeChat.messages
          .filter(m => m.mediaType !== "disappearing-photo") // skip snaps for prompt text context
          .map(m => ({
            sender: m.sender,
            text: m.text
          }))
          // only take last 8 messages for context window speed
          .slice(-8);

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: userMessageText,
            history: relevantHistory
          })
        });

        const data = await response.json();
        const aiResponseText = data.text || "I was chewing on a banana! Could you say that again?";

        const aiMsg: Message = {
          id: `ai-msg-${Date.now()}`,
          sender: "ai",
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChats(prev =>
          prev.map(c => {
            if (c.id === "chat-ai") {
              return {
                ...c,
                messages: [...c.messages, aiMsg]
              };
            }
            return c;
          })
        );
      } catch (err) {
        console.error("AI chat fail", err);
        // Fallback simulated quirky response
        const fallbackMsg: Message = {
          id: `ai-msg-${Date.now()}`,
          sender: "ai",
          text: "🔋 *Connection Drifted* | Offline mode triggered. I recommend a VHS retro filter with a lo-fi acoustic track for your skateboarding clip to guarantee high completion loops!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChats(prev =>
          prev.map(c => {
            if (c.id === "chat-ai") {
              return {
                ...c,
                messages: [...c.messages, fallbackMsg]
              };
            }
            return c;
          })
        );
      } finally {
        setIsSendingMessage(false);
      }
    } else {
      // Simulated response for chat partners
      setIsSendingMessage(true);
      setTimeout(() => {
        const friendResponses: Record<string, string[]> = {
          "chat-sam": [
            "Awesome! Let me adjust my aesthetic filter real quick.",
            "That's high-speed energy! Have you run that through the AI Hashtag engine yet?",
            "Encrypted channel is so fast here. Let's make a combined skate compilation!"
          ],
          "chat-luna": [
            "That soundtrack is massive. Sending a remix over later!",
            "I'm testing a Sunset Coast Drift vibe at 0.5x speed. Absolutely gorgeous.",
            "Meet me in the studio section! I'm rendering a neon loop."
          ]
        };

        const list = friendResponses[activeChat.id] || ["Cool vibe!", "Check this out!"];
        const randomReply = list[Math.floor(Math.random() * list.length)];

        const replyMsg: Message = {
          id: `friend-msg-${Date.now()}`,
          sender: "friend",
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEncrypted: activeChat.encryptionLocked,
          sessionKey: activeChat.encryptionLocked ? activeChat.sessionKey : undefined
        };

        setChats(prev =>
          prev.map(c => {
            if (c.id === activeChat.id) {
              return {
                ...c,
                messages: [...c.messages, replyMsg]
              };
            }
            return c;
          })
        );
        setIsSendingMessage(false);
      }, 1500);
    }
  };

  // Snapchat-style disappearing photo snap revealer
  const openDisappearingSnap = (msgId: string) => {
    setRevealSnapId(msgId);
    setSnapCountdown(5);
  };

  useEffect(() => {
    if (revealSnapId && snapCountdown > 0) {
      const timer = setTimeout(() => {
        setSnapCountdown(p => p - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (revealSnapId && snapCountdown === 0) {
      // Mark snap as opened/burned
      setChats(prev =>
        prev.map(c => ({
          ...c,
          messages: c.messages.map(m => {
            if (m.id === revealSnapId) {
              return { ...m, opened: true };
            }
            return m;
          })
        }))
      );
      setRevealSnapId(null);
      showToast("🔐 Disappearing Moment burned in memory forever!", "info");
    }
  }, [revealSnapId, snapCountdown]);

  // AI Creator Studio: Generate Captions
  const handleGenerateCaptions = async () => {
    setIsGeneratingCaptions(true);
    try {
      const response = await fetch("/api/generate-captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoDescription: videoDescription || "An absolute masterclass transition",
          musicName: studioMusic,
          filters: studioFilter,
          speed: studioSpeed
        })
      });

      const result = await response.json();
      setAiCaptions(result);
      showToast("✨ AI optimized hashtags & captions loaded!", "success");
    } catch (err) {
      console.error(err);
      // Fallback prediction
      setAiCaptions({
        caption: `A whole new rhythm at ${studioSpeed}x pace index ⭐`,
        hashtags: ["#BananaApp", "#CreateNext", "#VibeCheck", "#AEConsult", "#ViralPost"],
        challengeRecommendation: "Hold a yellow accessory in front of the lens for 3 seconds!",
        viralPotential: 82
      });
    } finally {
      setIsGeneratingCaptions(false);
    }
  };

  // AI Creator Studio: Consult Advisory
  const handleConsultAdvisor = async () => {
    if (!advisorConcept.trim()) {
      showToast("Please write a concept prompt first!", "info");
      return;
    }
    setIsConsultingAdvisor(true);
    try {
      const response = await fetch("/api/video-effect-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: advisorConcept })
      });
      const result = await response.json();
      setAiAdvice(result);
      showToast("🧠 Co-pilot effect recommendation formulated!", "success");
    } catch (err) {
      console.error(err);
      setAiAdvice({
        recommendedFilter: "sunset",
        idealSpeed: "0.5x",
        idealAudioGenre: "Chill Lo-Fi Acoustic Loop",
        proTip: "Apply a 0.5x speed reduction right at the transition climax to keep users hooked!"
      });
    } finally {
      setIsConsultingAdvisor(false);
    }
  };

  // Auto applies advisor's settings to current knobs
  const applyAdvisorSettings = () => {
    if (!aiAdvice) return;
    const filterKey = aiAdvice.recommendedFilter.toLowerCase();
    
    if (filterKey.includes("vhs")) setStudioFilter("vhs");
    else if (filterKey.includes("neon")) setStudioFilter("neon");
    else if (filterKey.includes("sunset") || filterKey.includes("amber")) setStudioFilter("sunset");
    else if (filterKey.includes("crimson")) setStudioFilter("crimson");
    else setStudioFilter("none");

    if (aiAdvice.idealSpeed.includes("0.5")) setStudioSpeed(0.5);
    else if (aiAdvice.idealSpeed.includes("1.5")) setStudioSpeed(1.5);
    else if (aiAdvice.idealSpeed.includes("2")) setStudioSpeed(2.0);
    else setStudioSpeed(1.0);

    setStudioMusic(aiAdvice.idealAudioGenre);
    showToast("Applied AI Settings directly to Studio Knobs! 🎚️", "success");
  };

  // Add customized overlay text to list
  const addTextOverlay = () => {
    if (!overlayText.trim()) return;
    setStudioOverlays(p => [
      ...p,
      { text: overlayText.trim(), time: overlayTime, color: overlayColor }
    ]);
    setOverlayText("");
    showToast("Custom text overlay stamped! 🎯", "success");
  };

  const removeTextOverlay = (index: number) => {
    setStudioOverlays(p => p.filter((_, i) => i !== index));
  };

  // Compile, post to feed!
  const compileAndPublishPost = () => {
    const finalCaption = aiCaptions?.caption || videoDescription || "My dynamic short video with real-time gradient overlays!";
    const finalHashtags = aiCaptions?.hashtags || ["#BananaApp", "#FreshMaker", "#ShortFeed"];
    
    const newCompiledPost: VideoPost = {
      id: `custom-post-${Date.now()}`,
      username: "you_the_creator",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      caption: finalCaption,
      hashtags: finalHashtags,
      videoSourceId: studioSourceId,
      musicName: studioMusic,
      filters: studioFilter,
      speed: studioSpeed,
      textOverlays: studioOverlays,
      likesCount: 1,
      commentsCount: 0,
      comments: [],
      sharesCount: 0,
      isLiked: false,
      isBookmarked: false
    };

    setVideos(prev => [newCompiledPost, ...prev]);
    setCurrentVideoIndex(0);
    showToast("🚀 Successfully published to Banana Vertical Feed!", "success");
    setActiveTab("feed");
  };

  // Progress counter simulation in Studio play preview
  useEffect(() => {
    let interval: any;
    if (isStudioPlaying) {
      interval = setInterval(() => {
        setStudioPlayProgress(p => (p >= 100 ? 0 : p + (5 * studioSpeed)));
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isStudioPlaying, studioSpeed]);

  // Keep simulated feed loop pacing correctly
  useEffect(() => {
    const interval = setInterval(() => {
      setFeedProgress(p => {
        if (p >= 100) return 0;
        return p + 2;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [currentVideoIndex]);

  // Selected video source details helper
  const getSourceDetails = (sourceId: string): VideoSource => {
    return VIDEO_SOURCES.find(s => s.id === sourceId) || VIDEO_SOURCES[0];
  };

  // CSS mappings for filters on the viewports
  const getFilterCSSClass = (filterName: string) => {
    switch (filterName) {
      case "vhs":
        return "brightness-[0.9] contrast-[1.1] saturate-[0.8] grayscale-[0.1] sepia-[0.15]";
      case "neon":
        return "hue-rotate-[140deg] contrast-[1.3] saturate-[2.0] brightness-[1.05]";
      case "sunset":
        return "sepia-[0.3] hue-rotate-[-30deg] saturate-[1.6] contrast-[1.05] brightness-[0.95]";
      case "crimson":
        return "hue-rotate-[-85deg] saturate-[2.5] contrast-[1.2] brightness-[0.9]";
      default:
        return "brightness-[1] contrast-[1] saturate-[1.1]";
    }
  };

  // Video source aesthetic background gradients representing full video renders
  const getGradientForSource = (sourceId: string) => {
    const src = getSourceDetails(sourceId);
    return src.bgGradient;
  };

  return (
    <div className="min-h-screen bg-stone-950 font-sans text-stone-100 flex flex-col antialiased">
      
      {/* ⚠️ SYSTEM NOTIFICATION TOAST BAR */}
      {systemToast && (
        <div id="system-toast" className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-stone-900 border border-amber-400 text-amber-100 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-yellow-400 shrink-0" />
          <span className="text-sm font-semibold tracking-wide">{systemToast.text}</span>
          <button onClick={() => setSystemToast(null)} className="text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 📱 SNAPCHAT TIMER DISAPEARING DIALOG OVERLAY */}
      {revealSnapId && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-3xl p-6 text-center shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs tracking-widest text-stone-500 font-mono">🔒 HIGH-SECURITY BURN</span>
              <div className="bg-amber-400 text-stone-950 px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> {snapCountdown}s remaining
              </div>
            </div>

            <h3 className="text-2xl font-display font-bold text-white">Disappearing Moment Reveal</h3>
            
            <div className="aspect-[3/4] w-64 mx-auto rounded-3xl relative overflow-hidden bg-stone-950 border border-amber-400/30 flex items-center justify-center shadow-inner">
              {/* Polaroid Photo frame representation */}
              <div className="absolute inset-x-2 top-2 bottom-12 rounded-2xl overflow-hidden bg-gradient-to-tr from-stone-850 to-stone-950 flex flex-col items-center justify-center border border-stone-800">
                <Camera className="w-12 h-12 text-yellow-400 opacity-25 mb-4 animate-pulse" />
                <span className="text-8xl select-none filter blur-[2px]">{revealedPics[revealSnapId] ? "🛹" : "🌊"}</span>
                <p className="text-xs text-stone-400 font-mono mt-4">Unencrypted Temporal Snap</p>
              </div>
              <div className="absolute bottom-2 inset-x-2 text-center text-[10px] text-stone-500 font-mono">
                Captured via Banana Studio
              </div>
              
              {/* Top timer countdown bar */}
              <div className="absolute bottom-0 left-0 bg-amber-400 h-1 transition-all duration-1000" style={{ width: `${(snapCountdown / 5) * 100}%` }} />
            </div>

            <p className="text-xs text-amber-100/70 italic">
              "This snap is protected under one-time cryptographic burn. Closing, screenshotting, or letting the timer lapse deletes it permanently from the server memory."
            </p>
          </div>
        </div>
      )}

      {/* 🔗 DIRECT SHARE MODAL */}
      {isShareModalOpen && videoToShare && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 w-full max-w-md rounded-3xl p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-display font-semibold flex items-center gap-2">
                <Share2 className="w-5 h-5 text-yellow-400" /> Share Moment
              </h4>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-950 p-3 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-400 to-amber-600 shrink-0 flex items-center justify-center text-stone-950 font-bold font-display">
                🍌
              </div>
              <div className="min-w-0">
                <p className="text-xs text-stone-400 font-mono">@{videoToShare.username}</p>
                <p className="text-sm font-medium text-white truncate">{videoToShare.caption}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs tracking-wider text-stone-500 uppercase font-mono font-bold">Select Encrypted Endpoint</span>
              <div className="space-y-1">
                {chats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => handleShareToFriend(chat.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-850 hover:bg-stone-800 transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-stone-700 flex items-center justify-center overflow-hidden border border-stone-650 shrink-0">
                        {chat.isAI ? (
                          <span className="text-base">{chat.partnerAvatar}</span>
                        ) : (
                          <img src={chat.partnerAvatar} alt={chat.partnerName} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{chat.partnerName}</p>
                        <p className="text-xs text-stone-400 flex items-center gap-1">
                          {chat.encryptionLocked ? (
                            <>
                              <Lock className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-mono text-[10px]">ECDH Encrypted Connection</span>
                            </>
                          ) : (
                            <span className="text-stone-500">Standard Direct Chat</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-500" />
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center pt-2">
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="text-xs font-semibold text-stone-400 hover:text-white underline"
              >
                Cancel and return to feed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 BANANA DYNAMIC GLOBAL HEADER */}
      <header className="bg-stone-950/80 border-b border-stone-900 sticky top-0 z-30 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400 shrink-0 flex items-center justify-center shadow-lg shadow-amber-400/20">
              <span className="text-2xl select-none font-bold text-stone-950">🍌</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-display font-black tracking-normal uppercase text-amber-400">Banana</h1>
                <span className="bg-stone-850 text-stone-400 border border-stone-800 text-[10px] font-mono px-2 py-0.5 rounded">
                  v2.6 Secure
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-none">The Ultimate Encrypted Video-Sharing Social Sphere</p>
            </div>
          </div>

          {/* Nav pills */}
          <nav id="banana-navigation" className="flex items-center gap-1 bg-stone-900 p-1 rounded-2xl border border-stone-855">
            <button
              onClick={() => setActiveTab("feed")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase transition-all duration-300 ${
                activeTab === "feed"
                  ? "bg-stone-800 text-yellow-400 shadow-sm font-bold border-t border-stone-700"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Video className="w-4 h-4 shrink-0" />
              <span>Moment Feed</span>
            </button>
            
            <button
              onClick={() => setActiveTab("studio")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase transition-all duration-300 ${
                activeTab === "studio"
                  ? "bg-stone-800 text-yellow-400 shadow-sm font-bold border-t border-stone-705"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Creator Studio</span>
            </button>

            <button
              onClick={() => setActiveTab("messenger")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase transition-all duration-300 ${
                activeTab === "messenger"
                  ? "bg-stone-800 text-yellow-400 shadow-sm font-bold border-t border-stone-705"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Private Sphere</span>
            </button>
          </nav>

          {/* Secure Keys Badge */}
          <div className="hidden lg:flex items-center gap-2 bg-emerald-990 bg-zinc-900 px-4 py-2 rounded-2xl border border-emerald-900/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-left">
              <p className="text-[10px] font-mono font-bold text-stone-400 leading-none uppercase">End-to-End Cryptography</p>
              <p className="text-[11px] font-mono text-emerald-400 font-semibold leading-normal">ECDH-256 Active</p>
            </div>
          </div>

        </div>
      </header>

      {/* 🌌 MAIN GRID WORKSPACES */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6">
        
        {/* =================================--------- */}
        {/* TAB 1: VERTICAL SOCIAL FEED */}
        {/* =================================--------- */}
        {activeTab === "feed" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left navigation shortcuts column - list of video posts */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-stone-900 border border-stone-850 rounded-3xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <h3 className="text-sm font-semibold tracking-wide uppercase font-mono text-stone-400">🔥 Live Moments</h3>
                  <span className="bg-yellow-400/20 text-yellow-400 text-[10px] px-2 py-0.5 rounded font-bold font-mono">
                    {videos.length} clips
                  </span>
                </div>
                
                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {videos.map((vid, index) => {
                    const source = getSourceDetails(vid.videoSourceId);
                    return (
                      <button
                        key={vid.id}
                        onClick={() => {
                          setCurrentVideoIndex(index);
                          setFeedProgress(12);
                        }}
                        className={`w-full text-left p-3 rounded-2xl transition flex items-center gap-3 border ${
                          currentVideoIndex === index
                            ? "bg-stone-800/80 border-amber-400/50 text-white"
                            : "bg-stone-950 border-stone-850 text-stone-300 hover:bg-stone-850"
                        }`}
                      >
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${source.bgGradient} flex items-center justify-center shrink-0 border border-stone-700/40`}>
                          <span className="text-xs">
                            {vid.filters === "vhs" ? "📹" : vid.filters === "neon" ? "⚡" : vid.filters === "sunset" ? "🌅" : "🎥"}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-mono text-stone-400 leading-tight">@{vid.username}</p>
                          <p className="text-sm font-medium font-display truncate text-stone-100">{vid.caption}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="bg-stone-900 px-1.5 py-0.5 rounded text-[9px] text-stone-400 font-mono">
                              {vid.speed}x speed
                            </span>
                            <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                              ❤️ {vid.likesCount}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => setActiveTab("studio")} 
                    className="w-full bg-stone-950 hover:bg-stone-850 border border-stone-800 text-yellow-400 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" /> Create Custom Loop
                  </button>
                </div>
              </div>

              {/* Secure Messenger Shortcut card */}
              <div className="bg-stone-900 border border-stone-850 rounded-3xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-stone-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs tracking-wider uppercase font-mono font-bold">Encrypted Nodes</span>
                </div>
                <p className="text-xs text-stone-400">Share your favorite video hooks using standard Diffie-Hellman safe keys with your contacts.</p>
                <button
                  onClick={() => setActiveTab("messenger")}
                  className="w-full bg-stone-950 hover:bg-stone-800 text-xs py-2 rounded-xl text-stone-300 font-bold tracking-wider"
                >
                  Configure Safe Keys
                </button>
              </div>
            </div>

            {/* Middle Main Column - Vertical Video Viewport Simulator */}
            <div className="lg:col-span-5 flex flex-col items-center">
              
              {/* Device frame container */}
              <div 
                id="vertical-phone-viewport"
                className="w-full max-w-[360px] bg-stone-900 border-[10px] border-stone-800 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col aspect-[9/16]"
              >
                {/* Simulated Notch */}
                <div className="absolute top-0 inset-x-0 h-6 bg-stone-900 z-20 flex justify-center items-center">
                  <div className="w-24 h-4 bg-black rounded-b-2xl" />
                </div>

                {/* Animated Simulated Video Canvas Background */}
                <div 
                  onClick={handleVideoAreaClick}
                  className={`flex-1 w-full bg-gradient-to-tr ${getGradientForSource(activeVideo.videoSourceId)} relative flex flex-col justify-end p-5 transition-all duration-700 overflow-hidden cursor-pointer ${getFilterCSSClass(activeVideo.filters)}`}
                >
                  {/* Floating Double Tap Hearts render */}
                  {bubbles.map(b => (
                    <div
                      key={b.id}
                      className="absolute pb-10 pointer-events-none text-yellow-400 animate-float-banana"
                      style={{ left: b.x - 20, top: b.y - 20 }}
                    >
                      <Heart className="w-12 h-12 fill-yellow-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
                    </div>
                  ))}

                  {/* Filter Scanline / Grid effect for VHS */}
                  {activeVideo.filters === "vhs" && (
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_3px_100%] z-10 opacity-70 animate-pulse" />
                  )}

                  {/* Filter Neon glow layers */}
                  {activeVideo.filters === "neon" && (
                    <div className="absolute inset-0 pointer-events-none border-[12px] border-indigo-500/20 rounded-2xl shadow-[inset_0_0_40px_rgba(168,85,247,0.4)] mix-blend-screen z-10 animate-pulse" />
                  )}

                  {/* Filter Sunset coast warmth mask */}
                  {activeVideo.filters === "sunset" && (
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-amber-500/10 via-orange-500/15 to-stone-900/30 mix-blend-overlay z-10" />
                  )}

                  {/* Playhead overlay element */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="bg-black/35 backdrop-blur-sm p-4 rounded-full text-white opacity-0 active:opacity-100 transition-opacity">
                      <Play className="w-10 h-10 fill-white" />
                    </span>
                  </div>

                  {/* Dynamic Rendered Text Overlays based on timestamps */}
                  {activeVideo.textOverlays.map((lay, idx) => {
                    // Simple simulation mapping layout parameters
                    return (
                      <div 
                        key={idx}
                        className="absolute self-center font-display font-black text-center text-xl uppercase tracking-wider drop-shadow-2xl px-4 py-2 rounded-xl border border-white/10 select-none bg-stone-950/40 backdrop-blur-xs animate-pulse"
                        style={{
                          top: `${30 + (idx * 20)}%`,
                          color: lay.color,
                          textShadow: `0 0 10px ${lay.color}`
                        }}
                      >
                        {lay.text}
                      </div>
                    );
                  })}

                  {/* Bottom details inside vertical video frame */}
                  <div className="space-y-2 z-10 text-left bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 shrink-0">
                        <img src={activeVideo.userAvatar} alt={activeVideo.username} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-400">@{activeVideo.username}</span>
                      <span className="bg-yellow-400 text-stone-950 text-[8px] px-1 rounded font-bold font-mono">CREATOR</span>
                    </div>

                    <p className="text-xs text-stone-200">
                      {activeVideo.caption}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {activeVideo.hashtags.map((tag, i) => (
                        <span key={i} className="text-[10px] text-amber-300 font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Audio track info */}
                    <div className="flex items-center gap-1.5 text-stone-300 text-xs py-1 border-t border-white/5 font-mono">
                      <Music className="w-3.5 h-3.5 text-yellow-400 animate-spin" style={{ animationDuration: "8s" }} />
                      <span className="truncate flex-1 max-w-[200px]">{activeVideo.musicName}</span>
                      <span className="bg-stone-900 border border-stone-850 px-1 rounded text-[8px]">
                        {activeVideo.speed}x
                      </span>
                    </div>

                  </div>

                  {/* Absolute positioning of vertical video action buttons inside frame right margin */}
                  <div className="absolute right-3.5 top-1/4 flex flex-col gap-5 items-center z-20">
                    <button
                      onClick={() => handleLikeToggle(activeVideo.id)}
                      className={`group p-3 rounded-full flex flex-col items-center justify-center transition ${
                        activeVideo.isLiked 
                          ? "bg-yellow-400 text-stone-950 shadow-lg shadow-amber-400/20" 
                          : "bg- stone-950/60 bg-black/50 text-stone-200 hover:text-yellow-400"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${activeVideo.isLiked ? "fill-current" : ""}`} />
                      <span className="text-[10px] font-bold font-mono mt-0.5">{activeVideo.likesCount}</span>
                    </button>

                    <button
                      onClick={() => {
                        const el = document.getElementById("comment-input-field");
                        if (el) el.focus();
                      }}
                      className="p-3 rounded-full bg-black/50 text-stone-200 hover:text-yellow-400 transition"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-[10px] font-bold font-mono mt-0.5">{activeVideo.commentsCount}</span>
                    </button>

                    <button
                      onClick={() => triggerShareMenu(activeVideo)}
                      className="p-3 rounded-full bg-black/50 text-stone-200 hover:text-yellow-400 transition"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="text-[10px] font-bold font-mono mt-0.5">{activeVideo.sharesCount}</span>
                    </button>

                    <button
                      onClick={() => handleBookmarkToggle(activeVideo.id)}
                      className={`p-3 rounded-full bg-black/50 transition ${
                        activeVideo.isBookmarked ? "text-yellow-400" : "text-stone-200 hover:text-yellow-400"
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${activeVideo.isBookmarked ? "fill-current" : ""}`} />
                    </button>

                    {/* Mute toggle icon */}
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-3 rounded-full bg-black/50 text-stone-300 hover:text-yellow-400 transition"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>

                  {/* Interactive floating playback process ticker */}
                  <div className="absolute bottom-1.5 inset-x-5 h-1 bg-white/20 rounded z-20 overflow-hidden">
                    <div 
                      className="bg-yellow-400 h-full transition-all duration-300"
                      style={{ width: `${feedProgress}%` }}
                    />
                  </div>

                </div>

                {/* Double Tap Prompt notice */}
                <div className="bg-stone-950 p-2 text-center text-[10px] font-mono text-stone-500 border-t border-stone-850">
                  ⚡ TAP FOR PLAYHEAD | DOUBLE-TAP TO LIKE
                </div>
              </div>

            </div>

            {/* Right Column - Comments System and Media Meta info */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Media meta info */}
              <div className="bg-stone-900 border border-stone-850 rounded-3xl p-5 space-y-3">
                <h3 className="text-xs tracking-wider uppercase font-mono font-bold text-stone-400">Moment Blueprint</h3>
                <div className="flex justify-between text-sm py-1 border-b border-stone-850">
                  <span className="text-stone-400">Audio Track</span>
                  <span className="font-semibold truncate max-w-[180px]">{activeVideo.musicName}</span>
                </div>
                <div className="flex justify-between text-sm py-1 border-b border-stone-850">
                  <span className="text-stone-400">Rendering Lens</span>
                  <span className="font-mono bg-stone-950 px-2 rounded text-yellow-400 uppercase text-xs">
                    {activeVideo.filters === "none" ? "No filter" : `${activeVideo.filters} glow`}
                  </span>
                </div>
                <div className="flex justify-between text-sm py-1 border-b border-stone-850">
                  <span className="text-stone-400">Pacing SpeedMultiplier</span>
                  <span className="font-semibold text-xs font-mono">{activeVideo.speed}x</span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-stone-400">Interactive Overlays</span>
                  <span className="font-semibold text-stone-300">{activeVideo.textOverlays.length} stamped</span>
                </div>
              </div>

              {/* Comments list container */}
              <div className="bg-stone-900 border border-stone-850 rounded-3xl p-5 space-y-4 flex flex-col h-[340px]">
                
                <div className="flex justify-between items-center border-b border-stone-800 pb-2 shrink-0">
                  <h3 className="text-sm font-semibold tracking-wide uppercase font-mono text-stone-400">
                    💬 Comments ({activeVideo.comments.length})
                  </h3>
                  <span className="text-xs text-stone-500 font-mono">Live Sync</span>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left">
                  {activeVideo.comments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                      <MessageCircle className="w-8 h-8 text-stone-605 text-stone-600 mb-1" />
                      <p className="text-xs text-stone-500 font-mono">No feedback yet on this clip.</p>
                      <p className="text-[10px] text-stone-600">Be the first to leave a comment!</p>
                    </div>
                  ) : (
                    activeVideo.comments.map(comm => (
                      <div key={comm.id} className="p-2.5 rounded-2xl bg-stone-950/75 border border-stone-855 flex gap-2.5">
                        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-stone-700">
                          <img src={comm.userAvatar} alt={comm.username} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold text-amber-400">@{comm.username}</span>
                            <span className="text-[10px] text-stone-500 font-mono">{comm.timestamp}</span>
                          </div>
                          <p className="text-xs text-stone-200 mt-1 leading-snug">{comm.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Form */}
                <form onSubmit={handleAddComment} className="flex gap-2 shrink-0 border-t border-stone-800 pt-3">
                  <input
                    id="comment-input-field"
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Drop some clean feedback..."
                    className="flex-1 bg-stone-950 text-xs rounded-xl px-3 py-2 border border-stone-800 focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-500 text-stone-950 px-3 rounded-xl text-xs font-bold font-mono transition"
                  >
                    Post
                  </button>
                </form>

              </div>

            </div>

          </div>
        )}

        {/* =================================--------- */}
        {/* TAB 2: ADVANCED CREATOR STUDIO */}
        {/* =================================--------- */}
        {activeTab === "studio" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
            
            {/* Left Options/Knobs controls (8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Box 1: Concept & AI co-pilot advisers */}
              <div className="bg-stone-900 border border-stone-850 rounded-3xl p-5 md:p-6 space-y-5">
                
                <div className="flex items-center justify-between border-b border-stone-802 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-lg font-display font-semibold text-stone-100">AI Creator Advisory Co-Pilot</h2>
                  </div>
                  <span className="text-xs tracking-widest text-stone-500 uppercase font-mono">Gemini Enhanced</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs tracking-wider text-amber-300 uppercase font-sans font-bold">What is your video concept idea?</label>
                  <p className="text-xs text-stone-400">Describe the clip you want to produce. Banana's AI prompt engine will advice the custom settings.</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-yellow-450 focus:border-yellow-400"
                      placeholder="e.g. 'Skateboarding through a neon street under wet rain at midnight' or 'A puppies first reaction to bubbly water'"
                      value={advisorConcept}
                      onChange={(e) => setAdvisorConcept(e.target.value)}
                    />
                    <button
                      onClick={handleConsultAdvisor}
                      disabled={isConsultingAdvisor}
                      className="bg-yellow-400 hover:bg-yellow-500 text-stone-950 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 font-mono"
                    >
                      {isConsultingAdvisor ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Advising...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Get Vibe</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* AI advice result */}
                {aiAdvice && (
                  <div className="bg-stone-950 p-4 rounded-2xl border border-yellow-400/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-yellow-400 font-mono font-bold uppercase flex items-center gap-1">
                        🏆 AI Smart Recipe Advice
                      </span>
                      <button
                        onClick={applyAdvisorSettings}
                        className="bg-stone-900 border border-stone-800 hover:bg-stone-850 hover:border-yellow-400 text-yellow-400 text-[10px] font-mono px-3 py-1 rounded-lg font-bold"
                      >
                        Apply Recommendations
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      <div className="bg-stone-900/60 p-2.5 rounded-xl text-xs">
                        <span className="text-stone-400 block mb-0.5">Filter lens</span>
                        <span className="font-semibold font-mono text-stone-200">{aiAdvice.recommendedFilter}</span>
                      </div>
                      <div className="bg-stone-900/60 p-2.5 rounded-xl text-xs">
                        <span className="text-stone-400 block mb-0.5">Video Speed</span>
                        <span className="font-semibold font-mono text-stone-200">{aiAdvice.idealSpeed}</span>
                      </div>
                      <div className="bg-stone-900/60 p-2.5 rounded-xl text-xs">
                        <span className="text-stone-400 block mb-0.5">Audio Track Genre</span>
                        <span className="font-semibold font-mono text-stone-200">{aiAdvice.idealAudioGenre}</span>
                      </div>
                    </div>

                    <p className="text-xs text-emerald-400 pt-1 border-t border-white/5 italic">
                      💡 <strong>Pro Tip:</strong> {aiAdvice.proTip}
                    </p>
                  </div>
                )}

              </div>

              {/* Box 2: Fine-Tuning Studio Knobs */}
              <div className="bg-stone-900 border border-stone-850 rounded-3xl p-5 md:p-6 space-y-6">
                
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-amber-400" />
                    <h2 className="text-lg font-display font-semibold text-stone-100">Tactile Clip Customizer Knobs</h2>
                  </div>
                  <span className="text-xs tracking-widest text-stone-500 uppercase font-mono">Analog Interface</span>
                </div>

                {/* Sub row 1: Template and speed */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Select raw footage source */}
                  <div className="space-y-2">
                    <label className="text-xs tracking-wider text-amber-300 uppercase font-bold font-mono">1. Select Raw Video Buffer</label>
                    <select
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-yellow-450 focus:border-yellow-400"
                      value={studioSourceId}
                      onChange={(e) => setStudioSourceId(e.target.value)}
                    >
                      {VIDEO_SOURCES.map(src => (
                        <option key={src.id} value={src.id}>
                          {src.title} ({src.duration}s loop)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pacing selection */}
                  <div className="space-y-2">
                    <label className="text-xs tracking-wider text-amber-300 uppercase font-bold font-mono">2. Speed Multiplier Coefficient</label>
                    <div className="grid grid-cols-4 gap-1">
                      {[0.5, 1.0, 1.5, 2.0].map(sp => (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => setStudioSpeed(sp)}
                          className={`py-2 rounded-lg text-xs font-bold font-mono transition border ${
                            studioSpeed === sp
                              ? "bg-stone-800 border-amber-400 text-yellow-400"
                              : "bg-stone-950 border-stone-850 text-stone-400 hover:text-stone-200"
                          }`}
                        >
                          {sp}x
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Sub row 2: Applied filter lens */}
                <div className="space-y-2">
                  <label className="text-xs tracking-wider text-amber-300 uppercase font-bold font-mono flex items-center justify-between">
                    <span>3. Choose Active Rendering Lens</span>
                    <span className="text-stone-500 text-[10px] uppercase font-bold font-mono">GPU Shader level</span>
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { key: "none", name: "Standard Base", desc: "No filtration" },
                      { key: "vhs", name: "VHSTape CRT", desc: "Retro VHS sweep" },
                      { key: "neon", name: "Neon Cyber", desc: "140° Hue contrast" },
                      { key: "sunset", name: "Sunset Coast", desc: "Warm amber glow" },
                      { key: "crimson", name: "Crimson Haze", desc: "Dramatic red tint" }
                    ].map(fil => (
                      <button
                        key={fil.key}
                        onClick={() => setStudioFilter(fil.key)}
                        className={`p-2.5 rounded-xl text-left transition border ${
                          studioFilter === fil.key
                            ? "bg-stone-800/80 border-amber-400 text-yellow-400"
                            : "bg-stone-950 border-stone-850 text-stone-400 hover:text-stone-250 hover:bg-stone-850"
                        }`}
                      >
                        <p className="text-[11px] font-bold font-mono leading-none">{fil.name}</p>
                        <p className="text-[8px] text-stone-500 mt-0.5 leading-none">{fil.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub row 3: Audio alignment & Overlays */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Audio title */}
                  <div className="space-y-2">
                    <label className="text-xs tracking-wider text-amber-300 uppercase font-bold font-mono">4. Align Audio Waveform</label>
                    <input
                      type="text"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-yellow-400"
                      value={studioMusic}
                      onChange={(e) => setStudioMusic(e.target.value)}
                      placeholder="e.g. 'Chill Lo-Fi Acoustic Loop'"
                    />
                  </div>

                  {/* Context note */}
                  <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-850 flex items-center gap-3">
                    <Activity className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold font-mono text-stone-300 leading-tight">Synced FPS & pacing</p>
                      <p className="text-[9px] text-stone-400 mt-0.5 leading-snug">The live engine automatically shifts matching video rates, overlay timings, and shader properties on compile.</p>
                    </div>
                  </div>

                </div>

                {/* Stamping Overlays visual section */}
                <div className="border-t border-stone-800 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs tracking-wider uppercase font-mono font-bold text-stone-400">Add Live Text Overlays</h3>
                    <span className="text-[10px] text-stone-500 uppercase font-mono font-bold">Vector Stamping</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    
                    <div className="md:col-span-6 space-y-1">
                      <label className="text-[10px] text-stone-400 font-mono">Text Heading String</label>
                      <input
                        type="text"
                        value={overlayText}
                        onChange={(e) => setOverlayText(e.target.value)}
                        placeholder="e.g. 'OLLIE TIME!'"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-yellow-400"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] text-stone-400 font-mono">Time stamp (s)</label>
                      <input
                        type="number"
                        min="0"
                        max="12"
                        value={overlayTime}
                        onChange={(e) => setOverlayTime(Number(e.target.value))}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-center font-mono focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] text-stone-400 font-mono">Accent color</label>
                      <select
                        value={overlayColor}
                        onChange={(e) => setOverlayColor(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none"
                      >
                        <option value="#FBBF24">Amber Yellow</option>
                        <option value="#10B981">Mint Green</option>
                        <option value="#E11D48">Rose Neon</option>
                        <option value="#FFFFFF">Base White</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={addTextOverlay}
                      className="md:col-span-2 bg-stone-950 hover:bg-stone-800 border border-stone-700 hover:border-yellow-400 text-yellow-400 font-bold font-mono py-1.5 rounded-lg text-xs"
                    >
                      Add Text
                    </button>

                  </div>

                  {/* Registered Stamped list */}
                  {studioOverlays.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {studioOverlays.map((lay, i) => (
                        <div key={i} className="bg-stone-950 border border-stone-850 px-3 py-1 rounded-xl flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lay.color }} />
                          <span className="text-[10px] font-mono font-bold text-stone-300">
                            "{lay.text}" <span className="text-stone-500 font-normal">@{lay.time}s</span>
                          </span>
                          <button onClick={() => removeTextOverlay(i)} className="text-stone-500 hover:text-red-400">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>

              {/* Box 3: Automated Smart captions generation */}
              <div className="bg-stone-900 border border-stone-850 rounded-3xl p-5 md:p-6 space-y-5">
                
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <h2 className="text-lg font-display font-semibold text-stone-100">AI automated Smart Captions & Virality</h2>
                  </div>
                  <span className="text-xs tracking-widest text-stone-500 uppercase font-mono">Prediction Metrics</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs tracking-wider text-amber-300 uppercase font-bold font-mono">Brief Scene Context / Caption Vibe</label>
                  <p className="text-xs text-stone-400">Type a simple reference description of what's happening or click generate.</p>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-yellow-400"
                      placeholder="e.g. 'Epic jump and landing the ollie cleanly with sunset shadow lines'..."
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                    />
                    <button
                      onClick={handleGenerateCaptions}
                      disabled={isGeneratingCaptions}
                      className="bg-yellow-400 hover:bg-yellow-550 hover:bg-yellow-500 text-stone-950 px-5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 font-mono"
                    >
                      {isGeneratingCaptions ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Optimize</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* AI captions result display */}
                {aiCaptions && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-stone-950 p-4 rounded-3xl border border-stone-850">
                    
                    {/* Caption block (8 columns) */}
                    <div className="md:col-span-8 space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 block">AI Recommended Hook</span>
                        <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800 text-xs text-stone-100 italic mt-0.5 select-all">
                          {aiCaptions.caption}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 block">Trending Hashtags Bundle</span>
                        <div className="flex flex-wrap gap-1.5 mt-0.5">
                          {aiCaptions.hashtags.map((tag, i) => (
                            <span key={i} className="bg-stone-900 text-yellow-400 font-mono text-[10px] px-2.5 py-1 rounded-lg border border-stone-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-800/50">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500 font-bold block">💡 Target Virality Challenge</span>
                        <p className="text-xs text-stone-300 mt-0.5 leading-snug">{aiCaptions.challengeRecommendation}</p>
                      </div>

                    </div>

                    {/* Virality circular/numeric indicator (4 columns) */}
                    <div className="md:col-span-4 border-l border-stone-800/60 pl-3 flex flex-col items-center justify-center p-2 text-center">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 mb-2">Virality Score</span>
                      
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        {/* Simulated ring bar */}
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="48" cy="48" r="38" stroke="#1c1917" strokeWidth="8" fill="transparent" />
                          <circle 
                            cx="48" cy="48" r="38" 
                            stroke="#FBBF24" strokeWidth="8" fill="transparent" 
                            strokeDasharray={238} 
                            strokeDashoffset={238 - (238 * aiCaptions.viralPotential) / 100}
                            style={{ transition: "stroke-dashoffset 1s ease-out" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-mono font-black text-amber-400 leading-none">{aiCaptions.viralPotential}%</span>
                          <span className="text-[8px] uppercase tracking-widest text-stone-500 font-mono">Predicted</span>
                        </div>
                      </div>

                      <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-900/30 font-mono text-[9px] px-2 py-0.5 rounded mt-3 uppercase font-bold">
                        Excellent index
                      </span>

                    </div>

                  </div>
                )}

              </div>

              {/* Publish Trigger Bar */}
              <div className="bg-stone-900 border border-stone-850 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Ready to test in the social pool?</p>
                  <p className="text-xs text-stone-400">Publish your compiled custom-filtered loop. It instantly propagates to the main feed tab.</p>
                </div>
                <button
                  type="button"
                  onClick={compileAndPublishPost}
                  className="w-full sm:w-auto bg-gradient-to-tr from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-stone-950 px-8 py-3.5 rounded-2xl text-xs font-black tracking-widest uppercase shadow-xl hover:shadow-yellow-400/10 transition flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" /> Compile & Post to Feed
                </button>
              </div>

            </div>

            {/* Right Side Column (4 Columns) - Active Studio Live play simulator */}
            <div className="lg:col-span-4 space-y-4">
              
              <div className="sticky top-28 space-y-4">
                
                {/* Simulated vertical viewfinder element */}
                <div className="bg-stone-900 border-[10px] border-stone-800 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col aspect-[9/16] max-w-[280px] mx-auto">
                  
                  {/* High Quality GPU Shader simulator */}
                  <div className={`flex-1 w-full bg-gradient-to-tr ${getGradientForSource(studioSourceId)} relative flex flex-col justify-end p-4 transition-all duration-300 overflow-hidden ${getFilterCSSClass(studioFilter)}`}>
                    
                    {/* VHS Lens lines overlay */}
                    {studioFilter === "vhs" && (
                      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_3px_100%] z-10 opacity-70 animate-pulse" />
                    )}

                    {/* Cyber Neon Lens glow */}
                    {studioFilter === "neon" && (
                      <div className="absolute inset-0 pointer-events-none border-[8px] border-indigo-500/20 rounded-2xl shadow-[inset_0_0_30px_rgba(168,85,247,0.35)] mix-blend-screen z-10 animate-pulse" />
                    )}

                    {/* Warm Sunset Lens glow */}
                    {studioFilter === "sunset" && (
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-amber-500/10 via-orange-500/15 to-stone-900/30 mix-blend-overlay z-10" />
                    )}

                    {/* GPU Stamped dynamic text overlays according to loop play timer */}
                    {studioOverlays.map((lay, idx) => {
                      return (
                        <div 
                          key={idx}
                          className="absolute self-center font-display font-black text-center text-sm uppercase tracking-wide drop-shadow-2xl px-2 py-1 rounded-lg border border-white/10 select-none bg-stone-950/40 backdrop-blur-xs animate-pulse"
                          style={{
                            top: `${40 + (idx * 15)}%`,
                            color: lay.color,
                            textShadow: `0 0 8px ${lay.color}`
                          }}
                        >
                          {lay.text}
                        </div>
                      );
                    })}

                    <div className="bg-stone-950/80 p-2.5 rounded-xl text-left space-y-1">
                      <p className="text-[10px] font-mono text-amber-400">@you_the_creator</p>
                      <p className="text-[11px] leading-tight font-medium text-stone-200">
                        {videoDescription || "Live Workbench rendering preview..."}
                      </p>
                      <div className="flex items-center gap-1.5 text-stone-300 text-[9px] pt-1 border-t border-white/5 font-mono">
                        <Music className="w-3 h-3 text-yellow-400 shrink-0" />
                        <span className="truncate flex-1">{studioMusic}</span>
                      </div>
                    </div>

                    {/* Playhead duration simulation ticker */}
                    <div className="absolute bottom-1.5 inset-x-4 h-1 bg-white/20 rounded z-20 overflow-hidden">
                      <div 
                        className="bg-yellow-400 h-full transition-all duration-300"
                        style={{ width: `${studioPlayProgress}%` }}
                      />
                    </div>

                  </div>

                  {/* Physical simulator control bar */}
                  <div className="p-3 bg-stone-950 border-t border-stone-850 flex items-center justify-between text-xs text-stone-400 select-none">
                    <span className="font-mono text-stone-500 uppercase text-[9px]">Live Shader Sandbox</span>
                    <button
                      onClick={() => setIsStudioPlaying(!isStudioPlaying)}
                      className="bg-stone-850 hover:bg-stone-800 text-stone-200 p-1.5 rounded-lg flex items-center gap-1 shrink-0"
                    >
                      {isStudioPlaying ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                          <span className="text-[9px] font-bold font-mono">Live Sync</span>
                        </>
                      ) : (
                        <span className="text-[9px] font-bold font-mono">Paused</span>
                      )}
                    </button>
                  </div>

                </div>

                <div className="bg-stone-900 border border-stone-850 p-4 rounded-3xl text-center">
                  <p className="text-xs font-mono text-stone-400">Workspace status: <span className="text-emerald-400">Ready for compile</span></p>
                  <p className="text-[10px] text-stone-500 mt-1 leading-normal">Shader render targets is bound to HTML5 elements. Click compile and post above to save results.</p>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* =================================--------- */}
        {/* TAB 3: END-TO-END ENCRYPTED MESSENGER */}
        {/* =================================--------- */}
        {activeTab === "messenger" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-[600px] text-left">
            
            {/* Left Column Contacts list (4 Columns) */}
            <div className="lg:col-span-4 bg-stone-900 border border-stone-850 rounded-3xl p-4 flex flex-col">
              
              <div className="pb-3 border-b border-stone-800 shrink-0">
                <h3 className="text-xs tracking-wider uppercase font-mono font-bold text-stone-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Active Crypto Sphere
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5 font-mono">Select a partner keys exchange node</p>
              </div>

              {/* Contacts Nodes */}
              <div className="flex-1 overflow-y-auto space-y-1.5 py-3 pr-1">
                {chats.map(chat => {
                  const lastMessage = chat.messages[chat.messages.length - 1];
                  return (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className={`w-full text-left p-3 rounded-2xl transition border flex items-center justify-between gap-3 ${
                        activeChat.id === chat.id
                          ? "bg-stone-800/80 border-amber-400/50 text-white"
                          : "bg-stone-950 border-stone-850 text-stone-300 hover:bg-stone-850"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-full bg-stone-700 border border-stone-600 flex items-center justify-center overflow-hidden">
                            {chat.isAI ? (
                              <span className="text-lg">{chat.partnerAvatar}</span>
                            ) : (
                              <img src={chat.partnerAvatar} alt={chat.partnerName} className="w-full h-full object-cover" />
                            )}
                          </div>
                          {chat.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-stone-950" />
                          )}
                        </div>

                        {/* Name and preview */}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate leading-tight">{chat.partnerName}</p>
                          <p className="text-xs text-stone-400 truncate leading-normal mt-0.5 italic">
                            {lastMessage ? lastMessage.text : "No messages."}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0 gap-1">
                        <span className="text-[9px] text-stone-500 font-mono">Active</span>
                        {chat.encryptionLocked ? (
                          <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-605 bg-stone-600" />
                        )}
                      </div>

                    </button>
                  );
                })}
              </div>

              {/* Direct simulation warning disclaimer */}
              <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 shrink-0 text-[10px] text-stone-500 leading-normal font-mono">
                🛡️ ECDH Safe Channel: Client-Side messaging are authenticated prior to packet broadcast. Snaps are deleted on timer expiry.
              </div>

            </div>

            {/* Right Column - Chat active container (8 Columns) */}
            <div className="lg:col-span-8 bg-stone-900 border border-stone-850 rounded-3xl flex flex-col overflow-hidden relative">
              
              {/* Chat head summary profile bar */}
              <div className="p-4 bg-stone-950 border-b border-stone-854 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-700 overflow-hidden border border-stone-600 flex items-center justify-center">
                    {activeChat.isAI ? (
                      <span className="text-lg">{activeChat.partnerAvatar}</span>
                    ) : (
                      <img src={activeChat.partnerAvatar} alt={activeChat.partnerName} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white leading-tight">{activeChat.partnerName}</h4>
                    <span className="text-[10px] text-stone-400 flex items-center gap-1 font-mono">
                      {activeChat.encryptionLocked ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-emerald-400 leading-none uppercase font-bold">Secured: {activeChat.sessionKey}</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full shrink-0" />
                          <span className="text-stone-400 leading-none">Standard Connection Matrix</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Secure lock metadata view details toggle */}
                <span className="text-[10px] font-mono bg-stone-900 px-3 py-1 rounded-xl text-stone-400 border border-stone-800">
                  {activeChat.isAI ? "Server Hub Node" : "Standard Direct Endpoint"}
                </span>
              </div>

              {/* Chat Messages flow log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-zinc-950/30">
                {activeChat.messages.map(msg => {
                  const isUser = msg.sender === "me";
                  
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${isUser ? "items-end text-right" : "items-start text-left"}`}
                    >
                      {/* Avatar preview metadata in bubble layout if friend */}
                      {!isUser && (
                        <span className="text-[9px] text-stone-500 font-mono mb-1">
                          @{activeChat.partnerName.toLowerCase()}
                        </span>
                      )}

                      {/* Decryption lock sign post */}
                      {msg.isEncrypted && (
                        <span className="text-[8px] text-emerald-400 font-mono flex items-center gap-0.5 tracking-wide mb-0.5 uppercase">
                          <Lock className="w-2.5 h-2.5 shrink-0" /> Decrypted payload
                        </span>
                      )}

                      {/* Bubble frame */}
                      <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 ${
                        isUser 
                          ? "bg-stone-800 text-stone-100 rounded-tr-none border-t border-r border-stone-700" 
                          : msg.sender === "ai"
                          ? "bg-neutral-900 text-stone-100 rounded-tl-none border-l border-yellow-400/40"
                          : "bg-stone-900 text-stone-100 rounded-tl-none border border-stone-850"
                      }`}>
                        
                        {/* 1. Snap countdown layout */}
                        {msg.mediaType === "disappearing-photo" ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-stone-300">
                              <Camera className="w-4 h-4 text-amber-400 shrink-0" />
                              <span className="font-bold">Disappearing Moment Lock</span>
                            </div>
                            
                            {msg.opened ? (
                              <p className="text-stone-500 italic block py-1 font-mono text-[10px]">
                                ⚠️ opened & burned temporal key
                              </p>
                            ) : (
                              <button
                                onClick={() => openDisappearingSnap(msg.id)}
                                className="bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-stone-950 text-[10px] font-bold font-mono px-3 py-1.5 rounded-lg flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" /> Reveal Snap (5s)
                              </button>
                            )}
                          </div>
                        ) : msg.mediaType === "shared-post" && msg.sharedPostId ? (
                          /* 2. Interactive shared vertical post layout */
                          <div className="space-y-2 bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-left">
                            <span className="text-[9px] uppercase font-mono tracking-wider text-amber-400 font-bold block">🎒 SHARED MOMENT REPLAY</span>
                            
                            {/* Render small mini player simulation */}
                            {(() => {
                              const sharedPost = videos.find(v => v.id === msg.sharedPostId) || INITIAL_VIDEOS[0];
                              const source = getSourceDetails(sharedPost.videoSourceId);
                              return (
                                <div className="space-y-1.5">
                                  <div className={`aspect-[4/3] w-full rounded-lg bg-gradient-to-tr ${source.bgGradient} relative flex items-center justify-center overflow-hidden border border-stone-800`}>
                                    <span className="bg-black/45 p-2 rounded-full cursor-pointer hover:scale-105 transition" onClick={() => {
                                      const mappedIndex = videos.findIndex(v => v.id === sharedPost.id);
                                      if (mappedIndex !== -1) {
                                        setCurrentVideoIndex(mappedIndex);
                                        setActiveTab("feed");
                                        showToast(`Playing shared clip by @${sharedPost.username}!`, "info");
                                      }
                                    }}>
                                      <Play className="w-5 h-5 text-white fill-white" />
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-stone-400 truncate">@{sharedPost.username}: {sharedPost.caption}</p>
                                </div>
                              );
                            })()}
                          </div>
                        ) : (
                          /* 3. Regular conversation text */
                          <p className="whitespace-pre-wrap leading-relaxed select-text">{msg.text}</p>
                        )}

                        <span className="text-[9px] text-stone-550 text-stone-500 block text-right font-mono select-none pt-0.5">
                          {msg.timestamp}
                        </span>

                      </div>

                    </div>
                  );
                })}

                {isSendingMessage && (
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[9px] text-stone-500 font-mono mb-1">
                      @{activeChat.partnerName.toLowerCase()} is thinking...
                    </span>
                    <div className="bg-stone-900 text-stone-100 rounded-2xl rounded-tl-none p-3.5 border border-stone-850 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}

              </div>

              {/* Chat Input message form */}
              <form onSubmit={handleSendMessage} className="p-3 bg-stone-950 border-t border-stone-854 shrink-0 flex items-center gap-2">
                <input
                  type="text"
                  value={chatMessageInput}
                  onChange={(e) => setChatMessageInput(e.target.value)}
                  placeholder={
                    activeChat.isAI 
                      ? "Ask Banana Companion: filters, captions, or hacks..." 
                      : `Message securely: ${activeChat.partnerName}...`
                  }
                  className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
                
                {/* Send Button */}
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-stone-950 p-3 rounded-xl transition duration-200"
                >
                  <Send className="w-4 h-4 shrink-0" />
                </button>
              </form>

              {/* AI Quick helper buttons */}
              {activeChat.isAI && (
                <div className="px-3 pb-2.5 bg-stone-950 flex flex-wrap gap-1">
                  {[
                    "Draft a retro skating script hook",
                    "List TikTok top 3 virality rules",
                    "How to loop a video loop seamlessly?"
                  ].map((pillText, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setChatMessageInput(pillText)}
                      className="bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-yellow-400 text-stone-300 text-[10px] px-2.5 py-1 rounded-lg"
                    >
                      {pillText}
                    </button>
                  ))}
                </div>
              )}

            </div>

          </div>
        )}

      </main>

      {/* 📊 CORE SYSTEM STATISTICS BAR */}
      <footer className="bg-stone-950 border-t border-stone-900 py-6 px-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono">
            🍌 Banana Creator Sandbox Platform Engine — Built via elegant Display Typography & React State Engine.
          </p>
          <p className="font-mono text-[11px] text-stone-605 text-stone-600">
            Secure Cryptography parameters: AES-GCM-256 GCM authenticated. Local time: 2026-06-10T09:00Z.
          </p>
        </div>
      </footer>

    </div>
  );
}

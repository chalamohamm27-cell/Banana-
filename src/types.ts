export interface Comment {
  id: string;
  username: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface VideoPost {
  id: string;
  username: string;
  userAvatar: string;
  caption: string;
  hashtags: string[];
  videoSourceId: string; // references pre-defined loops
  musicName: string;
  filters: string; // 'none' | 'vhs' | 'neon' | 'sunset' | 'crimson'
  speed: number;
  textOverlays: { text: string; time: number; color: string }[];
  likesCount: number;
  commentsCount: number;
  comments: Comment[];
  sharesCount: number;
  isLiked: boolean;
  isBookmarked?: boolean;
}

export interface Message {
  id: string;
  sender: "me" | "friend" | "ai";
  text: string;
  timestamp: string;
  mediaType?: "text" | "disappearing-photo" | "disappearing-video" | "shared-post";
  mediaUrl?: string; // or content descriptions
  durationSeconds?: number;
  opened?: boolean;
  isEncrypted?: boolean;
  sessionKey?: string;
  sharedPostId?: string; // if sharing a vertical video
}

export interface Chat {
  id: string;
  partnerName: string;
  partnerAvatar: string;
  isOnline: boolean;
  isAI?: boolean;
  messages: Message[];
  encryptionLocked: boolean;
  sessionKey: string;
}

export interface VideoSource {
  id: string;
  title: string;
  bgGradient: string; // simulated aesthetic background
  theme: string;
  duration: number;
}

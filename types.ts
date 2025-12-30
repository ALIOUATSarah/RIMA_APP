export type ThemeColor = 'gold' | 'rust' | 'obsidian' | 'teal' | 'emerald' | 'indigo' | 'rose' | 'sky' | 'violet' | 'slate';

export interface User {
  id: string;
  name: string;
  avatarColor: string;
  role?: string;
}

export interface Message {
  id: string;
  sender: User | 'Rima';
  content: string;
  timestamp: string;
}

export interface Channel {
  id: string;
  title: string;
  members: User[];
  unreadCount?: number;
  messages: Message[];
  isPrivate?: boolean;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  theme: ThemeColor;
  channels: Channel[];
  members: User[];
  messages: Message[]; 
  profileId: string; 
  budget?: string;
  deadline?: string;
  phase?: string;
  progress?: number;
  lastActivity?: string;
}

export interface Profile {
  id: string;
  name: string;
  icon: string;
}

export type ViewType = {
  type: 'home' | 'project' | 'channel' | 'settings' | 'new_workspace' | 'new_channel' | 'project_summary' | 'channel_summary';
  projectId?: string;
  channelId?: string;
};

export interface Participant {
  id: string;
  name: string;
  avatarColor: string;
  isMuted: boolean;
  isSpeaking: boolean;
  avatarUrl?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
}

export type OSPlatform = 'windows' | 'macos' | 'linux' | 'android';

export interface SetupConfig {
  version: string;
  platform: OSPlatform;
  size: string;
  filename: string;
  checksum: string;
}

export interface FeatureType {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

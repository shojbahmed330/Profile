import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Post, User, ScrollState, Campaign, AppView, Story } from '../types';
import { PostCard } from './PostCard';
import CreatePostWidget from './CreatePostWidget';
import SkeletonPostCard from './SkeletonPostCard';
import { geminiService } from '../services/geminiService';
import RewardedAdWidget from './RewardedAdWidget';
import { getTtsPrompt } from '../constants';
import StoriesTray from './StoriesTray';
import { firebaseService } from '../services/firebaseService';
import { useSettings } from '../contexts/SettingsContext';

interface FeedScreenProps {
  isLoading: boolean;
  posts: Post[];
  currentUser: User;
  onSetTtsMessage: (message: string) => void;
  lastCommand: string | null;
  onOpenProfile: (userName: string) => void;
  onViewPost: (postId: string) => void;
  onReactToPost: (postId: string, emoji: string) => void;
  onStartCreatePost: (props?: any) => void;
  onRewardedAdClick: (campaign: Campaign) => void;
  onAdViewed: (campaignId: string) => void;
  onAdClick: (post: Post) => void;
  onStartComment: (postId: string) => void;
  onSharePost: (post: Post) => void;
  
  // New props for handling all commands locally
  onCommandProcessed: () => void;
  scrollState: ScrollState;
  onSetScrollState: (state: ScrollState) => void;
  onNavigate: (view: AppView, props?: any) => void;
  friends: User[];
  setSearchResults: (results: User[]) => void;
}

const FeedScreen: React.FC<FeedScreenProps> = ({
    isLoading, posts: initialPosts, currentUser, onSetTtsMessage, lastCommand, onOpenProfile,
    onViewPost, onReactToPost, onStartCreatePost, onRewardedAdClick, onAdViewed,
    onAdClick, onCommandProcessed, scrollState, onSetScrollState, onNavigate, friends, setSearchResults,
    onStartComment, onSharePost
}) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [adInjected, setAdInjected] = useState(false);
  const [currentPostIndex, setCurrentPostIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rewardedCampaign, setRewardedCampaign] = useState<Campaign | null>(null);
  const [storiesByAuthor, setStoriesByAuthor] = useState<Awaited<ReturnType<typeof geminiService.getStories>>>([]);
  
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const postRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { language } = useSettings();
  
  const
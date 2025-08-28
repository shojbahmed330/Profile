
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppView, User, VoiceState, Post, Comment, ScrollState, Notification, Campaign, Group, Story } from './types';
import AuthScreen from './components/AuthScreen';
import FeedScreen from './components/FeedScreen';
import ExploreScreen from './components/ExploreScreen';
import ReelsScreen from './components/ReelsScreen';
import CreatePostScreen from './components/CreatePostScreen';
import CreateReelScreen from './components/CreateReelScreen';
import CreateCommentScreen from './components/CreateCommentScreen';
import ProfileScreen from './components/ProfileScreen';
import SettingsScreen from './components/SettingsScreen';
import MessageScreen from './components/MessageScreen';
import PostDetailScreen from './components/PostDetailScreen';
import FriendsScreen from './components/FriendsScreen';
import SearchResultsScreen from './components/SearchResultsScreen';
import VoiceCommandInput from './components/VoiceCommandInput';
import Icon from './components/Icon';
import AdModal from './components/AdModal';
import { geminiService } from './services/geminiService';
import { firebaseService } from './services/firebaseService';
import { IMAGE_GENERATION_COST, REWARD_AD_COIN_VALUE, getTtsPrompt } from './constants';
import ConversationsScreen from './components/ConversationsScreen';
import AdsScreen from './components/AdsScreen';
import CampaignViewerModal from './components/CampaignViewerModal';
import MobileBottomNav from './components/MobileBottomNav';
import RoomsHubScreen from './components/RoomsHubScreen';
import RoomsListScreen from './components/RoomsListScreen';
import LiveRoomScreen from './components/LiveRoomScreen';
import VideoRoomsListScreen from './components/VideoRoomsListScreen';
import LiveVideoRoomScreen from './components/LiveVideoRoomScreen';
import GroupsHubScreen from './components/GroupsHubScreen';
import GroupPageScreen from './components/GroupPageScreen';
import ManageGroupScreen from './components/ManageGroupScreen';
import GroupChatScreen from './components/GroupChatScreen';
import GroupEventsScreen from './components/GroupEventsScreen';
import CreateEventScreen from './components/CreateEventScreen';
import CreateStoryScreen from './components/CreateStoryScreen';
import StoryViewerScreen from './components/StoryViewerScreen';
import StoryPrivacyScreen from './components/StoryPrivacyScreen';
import GroupInviteScreen from './components/GroupInviteScreen';
import ShareModal from './components/ShareModal';
import LeadFormModal from './components/LeadFormModal';
import { useSettings } from './contexts/SettingsContext';


interface ViewState {
  view: AppView;
  props?: any;
}

const MenuItem: React.FC<{
    iconName: React.ComponentProps<typeof Icon>['name'];
    label: string;
    onClick: () => void;
    badge?: string | number;
}> = ({ iconName, label, onClick, badge }) => (
    <button onClick={onClick} className="w-full flex items-center gap-4 p-4 text-left text-lg text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        <Icon name={iconName} className="w-7 h-7 text-gray-500" />
        <span className="flex-grow">{label}</span>
        {badge !== undefined && Number(badge) > 0 && <span className="text-sm font-bold bg-red-500 text-white rounded-full px-2 py-0.5">{badge}</span>}
        {badge !== undefined && Number(badge) === 0 && <span className="text-sm font-bold text-yellow-500">{badge}</span>}
    </button>
);

const MobileMenuScreen: React.FC<{
  currentUser: User;
  onNavigate: (view: AppView, props?: any) => void;
  onLogout: () => void;
  friendRequestCount: number;
}> = ({ currentUser, onNavigate, onLogout, friendRequestCount }) => {
    return (
        <div className="h-full w-full overflow-y-auto p-4 bg-slate-100 text-gray-800">
            <div className="max-w-md mx-auto">
                <button 
                    onClick={() => onNavigate(AppView.PROFILE, { username: currentUser.username })}
                    className="w-full flex items-center gap-4 p-4 mb-6 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200"
                >
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-16 h-16 rounded-full" />
                    <div>
                        <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                        <p className="text-gray-500">View your profile</p>
                    </div>
                </button>

                <div className="space-y-2 bg-white p-2 rounded-lg border border-gray-200">
                    <MenuItem 
                        iconName="users" 
                        label="Friends" 
                        onClick={() => onNavigate(AppView.FRIENDS)}
                        badge={friendRequestCount}
                    />
                    <MenuItem 
                        iconName="coin" 
                        label="Voice Coins" 
                        onClick={() => {}}
                        badge={currentUser.voiceCoins || 0}
                    />
                     <MenuItem 
                        iconName="settings" 
                        label="Settings" 
                        onClick={() => onNavigate(AppView.SETTINGS)}
                    />
                    <MenuItem 
                        iconName="users-group-solid" 
                        label="Groups" 
                        onClick={() => onNavigate(AppView.GROUPS_HUB)}
                    />
                    <MenuItem 
                        iconName="briefcase" 
                        label="Ads Center" 
                        onClick={() => onNavigate(AppView.ADS_CENTER)}
                    />
                    <MenuItem 
                        iconName="chat-bubble-group" 
                        label="Rooms" 
                        onClick={() => onNavigate(AppView.ROOMS_HUB)}
                    />
                </div>

                <div className="mt-8 border-t border-gray-200 pt-4">
                     <button onClick={onLogout} className="w-full flex items-center gap-4 p-4 text-left text-lg text-red-600 hover:bg-red-500/10 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};


// FIX: This component was incomplete. I've added the missing closing brackets, state management, render logic, and export statement.
export const UserApp: React.FC = () => {
  const [viewStack, setViewStack] = useState<ViewState[]>([{ view: AppView.AUTH }]);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [globalAuthError, setGlobalAuthError] = useState('');
  
  const [friends, setFriends] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [reelsPosts, setReelsPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isShowingAd, setIsShowingAd] = useState(false);
  const [campaignForAd, setCampaignForAd] = useState<Campaign | null>(null);
  const [viewingAd, setViewingAd] = useState<Post | null>(null);
  const [voiceState, setVoiceState] = useState<VoiceState>(VoiceState.IDLE);
  const [ttsMessage, setTtsMessage] = useState<string>('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [scrollState, setScrollState] = useState<ScrollState>('none');
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [isLoadingReels, setIsLoadingReels] = useState(true);
  const [commandInputValue, setCommandInputValue] = useState('');
  const [initialDeepLink, setInitialDeepLink] = useState<ViewState | null>(null);
  const [shareModalPost, setShareModalPost] = useState<Post | null>(null);
  const [leadFormPost, setLeadFormPost] = useState<Post | null>(null);
  const { language } = useSettings();
  
  const recognitionRef = useRef<any>(null); // To hold the active speech recognition instance
  const currentView = viewStack[viewStack.length - 1];
  const friendRequestCount = user?.pendingFriendRequests?.length || 0;

  useEffect(() => {
    const hash = window.location.hash;
    const postMatch = hash.match(/^#\/post\/([\w-]+)/);
    if (postMatch && postMatch[1]) {
        setInitialDeepLink({ view: AppView.POST_DETAILS, props: { postId: postMatch[1] } });
    }
  }, []);

  // Effect 1: Handles Auth state and sets up/tears down data listeners.
  // This runs once on mount and manages the user session.
  useEffect(() => {
      let unsubscribeFromAuth: () => void;
      try {
        unsubscribeFromAuth = firebaseService.onAuthStateChanged(({ user: authUser }) => {
            if (authUser) {
                setUser(authUser);
                setViewStack([{ view: AppView.FEED }]);
            } else {
                setUser(null);
                setViewStack([{ view: AppView.AUTH }]);
            }
            setIsAuthLoading(false);
        });
      } catch (e) {
        console.error(e);
        setGlobalAuthError('Failed to initialize authentication.');
        setIsAuthLoading(false);
      }
      
      return () => {
          if (unsubscribeFromAuth) {
              unsubscribeFromAuth();
          }
      };
  }, []);

  const handleNavigate = useCallback((view: AppView, props?: any) => {
    setViewStack(stack => [...stack, { view, props }]);
  }, []);

  const handleGoBack = useCallback(() => {
    setViewStack(stack => (stack.length > 1 ? stack.slice(0, -1) : stack));
  }, []);

  const handleLogout = async () => {
    await firebaseService.signOutUser();
    setUser(null);
    setViewStack([{ view: AppView.AUTH }]);
  };

  const renderCurrentView = () => {
    if (!user) {
      // FIX: Pass ttsMessage prop to AuthScreen
      return <AuthScreen ttsMessage={ttsMessage} onSetTtsMessage={setTtsMessage} lastCommand={lastCommand} onCommandProcessed={() => setLastCommand(null)} initialAuthError={globalAuthError} />;
    }
    switch (currentView.view) {
        case AppView.FEED:
            // FIX: Corrected geminiService call for reactToPost.
            return <FeedScreen isLoading={isLoadingFeed} posts={posts} currentUser={user} onSetTtsMessage={setTtsMessage} lastCommand={lastCommand} onOpenProfile={(username) => handleNavigate(AppView.PROFILE, { username })} onViewPost={(postId) => handleNavigate(AppView.POST_DETAILS, { postId })} onReactToPost={(postId, emoji) => geminiService.reactToPost(postId, user.id, emoji)} onStartCreatePost={(props) => handleNavigate(AppView.CREATE_POST, props)} onRewardedAdClick={(campaign) => { setCampaignForAd(campaign); setIsShowingAd(true); }} onAdViewed={(campaignId) => console.log(`Ad ${campaignId} viewed`)} onAdClick={(post) => setViewingAd(post)} onStartComment={(postId) => handleNavigate(AppView.CREATE_COMMENT, { postId })} onSharePost={(post) => setShareModalPost(post)} onCommandProcessed={() => setLastCommand(null)} scrollState={scrollState} onSetScrollState={setScrollState} onNavigate={handleNavigate} friends={friends} setSearchResults={setSearchResults} />;
        case AppView.PROFILE:
            // FIX: Corrected geminiService call for reactToPost.
            return <ProfileScreen username={currentView.props.username} currentUser={user} onSetTtsMessage={setTtsMessage} lastCommand={lastCommand} onStartMessage={(recipient) => handleNavigate(AppView.MESSAGES, { recipient })} onEditProfile={() => handleNavigate(AppView.SETTINGS)} onViewPost={(postId) => handleNavigate(AppView.POST_DETAILS, { postId })} onOpenProfile={(username) => handleNavigate(AppView.PROFILE, { username })} onReactToPost={(postId, emoji) => geminiService.reactToPost(postId, user.id, emoji)} onBlockUser={(targetUser) => geminiService.blockUser(user.id, targetUser.id)} onCurrentUserUpdate={setUser} onPostCreated={(newPost) => setPosts(p => [newPost, ...p])} onSharePost={(post) => setShareModalPost(post)} onCommandProcessed={() => setLastCommand(null)} scrollState={scrollState} onSetScrollState={setScrollState} onNavigate={handleNavigate} onGoBack={handleGoBack} onStartComment={(postId) => handleNavigate(AppView.CREATE_COMMENT, { postId })}/>
        case AppView.SETTINGS:
            // FIX: Corrected geminiService call to getUserProfileById.
            return <SettingsScreen currentUser={user} onUpdateSettings={(settings) => geminiService.updateProfile(user.id, settings).then(() => geminiService.getUserProfileById(user.id).then(u => u && setUser(u)))} onUnblockUser={(targetUser) => geminiService.unblockUser(user.id, targetUser.id)} onDeactivateAccount={() => geminiService.deactivateAccount(user.id).then(handleLogout)} lastCommand={lastCommand} onSetTtsMessage={setTtsMessage} scrollState={scrollState} onCommandProcessed={() => setLastCommand(null)} onGoBack={handleGoBack} />;
        case AppView.CREATE_POST:
            return <CreatePostScreen user={user} onPostCreated={() => handleGoBack()} onSetTtsMessage={setTtsMessage} lastCommand={lastCommand} onDeductCoinsForImage={() => geminiService.updateVoiceCoins(user.id, -IMAGE_GENERATION_COST)} onCommandProcessed={() => setLastCommand(null)} onGoBack={handleGoBack} {...currentView.props} />;
        case AppView.CREATE_COMMENT:
            return <CreateCommentScreen user={user} postId={currentView.props.postId} onCommentPosted={() => handleGoBack()} onSetTtsMessage={setTtsMessage} lastCommand={lastCommand} onCommandProcessed={() => setLastCommand(null)} onGoBack={handleGoBack} {...currentView.props} />;
        case AppView.MESSAGES:
            return <MessageScreen currentUser={user} recipientUser={currentView.props.recipient} onSetTtsMessage={setTtsMessage} lastCommand={lastCommand} scrollState={scrollState} onBlockUser={(targetUser) => geminiService.blockUser(user.id, targetUser.id)} onGoBack={handleGoBack} onCommandProcessed={() => setLastCommand(null)} />;
        case AppView.POST_DETAILS:
            // FIX: Corrected geminiService call for reactToPost.
            return <PostDetailScreen postId={currentView.props.postId} currentUser={user} onSetTtsMessage={setTtsMessage} lastCommand={lastCommand} onStartComment={(postId, replyTo) => handleNavigate(AppView.CREATE_COMMENT, { postId, replyTo })} onReactToPost={(postId, emoji) => geminiService.reactToPost(postId, user.id, emoji)} onOpenProfile={(username) => handleNavigate(AppView.PROFILE, { username })} onSharePost={(post) => setShareModalPost(post)} scrollState={scrollState} onCommandProcessed={() => setLastCommand(null)} onGoBack={handleGoBack} />;
        case AppView.FRIENDS:
             return <FriendsScreen currentUser={user} onSetTtsMessage={setTtsMessage} lastCommand={lastCommand} onOpenProfile={(username) => handleNavigate(AppView.PROFILE, { username })} scrollState={scrollState} onCommandProcessed={() => setLastCommand(null)} onNavigate={handleNavigate} onGoBack={handleGoBack} {...currentView.props} />;
        case AppView.CONVERSATIONS:
            return <ConversationsScreen currentUser={user} onOpenConversation={(peer) => handleNavigate(AppView.MESSAGES, { recipient: peer })} onSetTtsMessage={setTtsMessage} lastCommand={lastCommand} onCommandProcessed={() => setLastCommand(null)} onGoBack={handleGoBack} />;
        case AppView.ADS_CENTER:
            return <AdsScreen currentUser={user} onSetTtsMessage={setTtsMessage} lastCommand={lastCommand} onCommandProcessed={() => setLastCommand(null)} onGoBack={handleGoBack} />;
        case AppView.ROOMS_HUB:
            return <RoomsHubScreen onNavigate={handleNavigate} />;
        case AppView.ROOMS_LIST:
            return <RoomsListScreen currentUser={user} onNavigate={handleNavigate} />;
        case AppView.LIVE_ROOM:
            return <LiveRoomScreen currentUser={user} roomId={currentView.props.roomId} onNavigate={handleNavigate} onGoBack={handleGoBack} onSetTtsMessage={setTtsMessage} />;
        case AppView.VIDEO_ROOMS_LIST:
            return <VideoRoomsListScreen currentUser={user} onNavigate={handleNavigate} />;
        case AppView.LIVE_VIDEO_ROOM:
            return <LiveVideoRoomScreen currentUser={user} roomId={currentView.props.roomId} onGoBack={handleGoBack} onSetTtsMessage={setTtsMessage} />;
        case AppView.GROUPS_HUB:
            return <GroupsHubScreen currentUser={user} onNavigate={handleNavigate} onSetTtsMessage={setTtsMessage} lastCommand={lastCommand} onCommandProcessed={() => setLastCommand(null)} groups={groups} onGroupCreated={(newGroup) => handleNavigate(AppView.GROUP_PAGE, { groupId: newGroup.id })} />;
        case AppView.GROUP_PAGE:
            // FIX: Corrected geminiService call for reactToPost.
            return <GroupPageScreen currentUser={user} groupId={currentView.props.groupId} onNavigate={handleNavigate} onSetTtsMessage={setTtsMessage} onOpenProfile={(username) => handleNavigate(AppView.PROFILE, { username })} onViewPost={(postId) => handleNavigate(AppView.POST_DETAILS, { postId })} onReactToPost={(postId, emoji) => geminiService.reactToPost(postId, user.id, emoji)} onSharePost={(post) => setShareModalPost(post)} onStartCreatePost={(props) => handleNavigate(AppView.CREATE_POST, props)} lastCommand={lastCommand} onCommandProcessed={() => setLastCommand(null)} onGoBack={handleGoBack} onStartComment={(postId) => handleNavigate(AppView.CREATE_COMMENT, { postId })} />;
        case AppView.MANAGE_GROUP:
            return <ManageGroupScreen currentUser={user} groupId={currentView.props.groupId} onNavigate={handleNavigate} onSetTtsMessage={setTtsMessage} />;
        case AppView.GROUP_CHAT:
             return <GroupChatScreen currentUser={user} groupId={currentView.props.groupId} onGoBack={handleGoBack} onOpenProfile={(username) => handleNavigate(AppView.PROFILE, { username })} />;
        case AppView.GROUP_EVENTS:
            return <GroupEventsScreen currentUser={user} groupId={currentView.props.groupId} onGoBack={handleGoBack} onNavigate={handleNavigate} />;
        case AppView.CREATE_EVENT:
            return <CreateEventScreen currentUser={user} groupId={currentView.props.groupId} onGoBack={handleGoBack} onSetTtsMessage={setTtsMessage} />;
        case AppView.CREATE_STORY:
             return <CreateStoryScreen currentUser={user} onStoryCreated={() => handleGoBack()} onGoBack={handleGoBack} onSetTtsMessage={setTtsMessage} onNavigate={handleNavigate} lastCommand={lastCommand} onCommandProcessed={() => setLastCommand(null)} {...currentView.props} />;
        case AppView.STORY_VIEWER:
             return <StoryViewerScreen currentUser={user} {...currentView.props} onGoBack={handleGoBack} onOpenProfile={(username) => handleNavigate(AppView.PROFILE, { username })} />;
        case AppView.STORY_PRIVACY:
            return <StoryPrivacyScreen {...currentView.props} onGoBack={handleGoBack} />;
        case AppView.EXPLORE:
            // FIX: Corrected geminiService call for reactToPost.
            return <ExploreScreen currentUser={user} onReactToPost={(postId, emoji) => geminiService.reactToPost(postId, user.id, emoji)} onViewPost={(postId) => handleNavigate(AppView.POST_DETAILS, { postId })} onOpenProfile={(username) => handleNavigate(AppView.PROFILE, { username })} onStartComment={(postId) => handleNavigate(AppView.CREATE_COMMENT, { postId })} />;
        case AppView.REELS:
            // FIX: Corrected geminiService call for reactToPost.
            return <ReelsScreen isLoading={isLoadingReels} posts={reelsPosts} currentUser={user} onReactToPost={(postId, emoji) => geminiService.reactToPost(postId, user.id, emoji)} onViewPost={(postId) => handleNavigate(AppView.POST_DETAILS, { postId })} onOpenProfile={(username) => handleNavigate(AppView.PROFILE, { username })} onStartComment={(postId) => handleNavigate(AppView.CREATE_COMMENT, { postId })} onNavigate={handleNavigate} />;
        case AppView.CREATE_REEL:
            return <CreateReelScreen currentUser={user} onGoBack={handleGoBack} onReelCreated={handleGoBack} onSetTtsMessage={setTtsMessage} />;
        case AppView.MOBILE_MENU:
            return <MobileMenuScreen currentUser={user} onNavigate={handleNavigate} onLogout={handleLogout} friendRequestCount={friendRequestCount} />;
        case AppView.GROUP_INVITE:
            return <GroupInviteScreen currentUser={user} groupId={currentView.props.groupId} onGoBack={handleGoBack} onSetTtsMessage={setTtsMessage} />;
        case AppView.SEARCH_RESULTS:
            return <SearchResultsScreen results={searchResults} query={currentView.props.query} onSetTtsMessage={setTtsMessage} lastCommand={lastCommand} onOpenProfile={(username) => handleNavigate(AppView.PROFILE, { username })} onCommandProcessed={() => setLastCommand(null)} onGoBack={handleGoBack} />;
        default:
            return <div className="p-8">View not implemented: {currentView.view}</div>;
    }
  }

  if (isAuthLoading) {
    return <div className="h-screen w-screen bg-gray-100 flex items-center justify-center text-gray-800"><p>Loading session...</p></div>;
  }

  if (!user) {
    return <AuthScreen ttsMessage={ttsMessage} onSetTtsMessage={setTtsMessage} lastCommand={lastCommand} onCommandProcessed={() => setLastCommand(null)} initialAuthError={globalAuthError} />;
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex font-sans overflow-hidden text-gray-900">
        {renderCurrentView()}
    </div>
  );
};

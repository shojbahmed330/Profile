
import React from 'react';
import { Campaign } from '../types';
import Icon from './Icon';

interface RewardedAdWidgetProps {
    campaign: Campaign | null;
    onAdClick: (campaign: Campaign) => void;
}

const RewardedAdWidget: React.FC<RewardedAdWidgetProps> = ({ campaign, onAdClick }) => {
    
    if (!campaign) {
        return (
            <div className="bg-white rounded-lg p-4 w-full max-w-lg mx-auto shadow-md animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-grow space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="flex-shrink-0 bg-gray-200 h-12 w-32 rounded-lg"></div>
                </div>
            </div>
        );
    }

    const handleClaim = () => {
        onAdClick(campaign);
    };

    const mediaUrl = campaign.imageUrl || campaign.videoUrl || campaign.audioUrl;

    return (
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-4 w-full max-w-lg mx-auto shadow-md">
            <div className="flex items-center justify-between gap-4 text-white">
                 <div className="flex-shrink-0 bg-white/20 rounded-lg w-16 h-16 flex items-center justify-center">
                    {mediaUrl && campaign.imageUrl ? (
                         <img src={mediaUrl} alt={campaign.sponsorName} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                         <Icon name="coin" className="w-8 h-8 text-yellow-300" />
                    )}
                </div>
                <div className="flex-grow">
                    <p className="text-xs text-yellow-300 font-bold uppercase tracking-wider">Ad · Get Free Coins</p>
                    <h3 className="font-bold text-lg">{campaign.sponsorName}</h3>
                    <p className="text-sm text-indigo-200 mt-1 line-clamp-2">{campaign.caption}</p>
                </div>
                <div className="flex-shrink-0">
                    <button
                        onClick={handleClaim}
                        className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold px-5 py-3 rounded-lg transition-colors text-center"
                    >
                        Watch & Earn
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RewardedAdWidget;

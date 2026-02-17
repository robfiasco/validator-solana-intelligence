import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, MessageCircle, Eye, Shield, Rocket, 
  Brain, ChevronLeft, AlertCircle, Activity, Info, ExternalLink
} from 'lucide-react';

/**
 * MagazinePremiumStory - Complete Magazine UI for Validator Stories
 * 
 * Two-screen experience:
 * 1. Magazine Cover (story catalog with global metrics)
 * 2. Story Detail (full article with charts and AI disclosure)
 */

const MagazinePremiumStory = () => {
  const [stories, setStories] = useState([]);
  const [globalMetrics, setGlobalMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('cover');
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const response = await fetch('/data/validator_stories.json');
      const data = await response.json();
      
      setGlobalMetrics(data.global_metrics || {});
      setStories(data.stories || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load stories:', error);
      setLoading(false);
    }
  };

  const openStory = (story) => {
    setSelectedStory(story);
    setCurrentView('detail');
  };

  const closeStory = () => {
    setSelectedStory(null);
    setCurrentView('cover');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-emerald-400 text-lg">Loading stories...</div>
      </div>
    );
  }

  if (!stories.length) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-500">No stories available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-3xl mx-auto">
        {currentView === 'cover' && (
          <MagazineCover 
            stories={stories} 
            globalMetrics={globalMetrics}
            onStoryClick={openStory}
          />
        )}
        
        {currentView === 'detail' && selectedStory && (
          <StoryDetail 
            story={selectedStory}
            onBack={closeStory}
          />
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAGAZINE COVER
// ============================================================================

const MagazineCover = ({ stories, globalMetrics, onStoryClick }) => {
  const leadStory = stories[0];
  const featuredStories = stories.slice(1, 3);

  return (
    <div className="bg-gradient-to-br from-zinc-950 to-black rounded-3xl overflow-hidden border border-emerald-500/20">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-800">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-emerald-500 font-bold text-2xl mb-1.5">VALIDATOR</h1>
            <p className="text-xs text-zinc-500 leading-relaxed">Exclusive Intelligence for Seeker Owners</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Issue</div>
            <div className="text-3xl font-bold text-emerald-400 leading-none">#47</div>
            <div className="text-[10px] text-zinc-600 mt-1.5">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Global Engagement Stats */}
        {globalMetrics && (
          <div className="grid grid-cols-4 gap-3 pt-4 border-t border-zinc-800">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-zinc-600" />
              </div>
              <div className="text-xl font-bold text-white leading-none mb-1">
                {globalMetrics.total_tweets || 0}
              </div>
              <div className="text-[10px] text-zinc-600 uppercase tracking-wide leading-tight">
                Tweets<br />Analyzed
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-xl font-bold text-emerald-400 leading-none mb-1">
                {formatNumber(globalMetrics.total_engagement)}
              </div>
              <div className="text-[10px] text-zinc-600 uppercase tracking-wide leading-tight">
                Total<br />Engagement
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1.5">
                <Users className="w-3.5 h-3.5 text-zinc-600" />
              </div>
              <div className="text-xl font-bold text-white leading-none mb-1">
                {globalMetrics.unique_voices || 0}
              </div>
              <div className="text-[10px] text-zinc-600 uppercase tracking-wide leading-tight">
                Unique<br />Voices
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1.5">
                <Activity className="w-3.5 h-3.5 text-violet-500" />
              </div>
              <div className="text-xl font-bold text-violet-400 leading-none mb-1">
                {formatNumber(globalMetrics.top_tweet)}
              </div>
              <div className="text-[10px] text-zinc-600 uppercase tracking-wide leading-tight">
                Top<br />Tweet
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lead Story */}
      <div className="p-6 space-y-5">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className={`h-0.5 w-10 rounded-full ${getStoryColor(leadStory.type)}`}></div>
            <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${getStoryTextColor(leadStory.type)}`}>
              {leadStory.category}
            </span>
          </div>
          
          <h2 className="text-3xl font-bold text-white leading-[1.15]">
            {leadStory.title}
          </h2>
          
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <span>By {leadStory.author}</span>
            <span className="text-zinc-700">•</span>
            <span>{formatTimeAgo(leadStory.timestamp)}</span>
            <span className="text-zinc-700">•</span>
            <span>{leadStory.category}</span>
          </div>

          {/* Story Metrics */}
          {leadStory.metrics && (
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <MessageCircle className="w-3 h-3 text-zinc-600" />
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wide">Coverage</span>
                  </div>
                  <div className="text-lg font-bold text-white">{leadStory.metrics.tweets}</div>
                  <div className="text-[10px] text-zinc-600">tweets</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Eye className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wide">Reach</span>
                  </div>
                  <div className="text-lg font-bold text-emerald-400">
                    {formatNumber(leadStory.metrics.engagement)}
                  </div>
                  <div className="text-[10px] text-zinc-600">engagement</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Users className="w-3 h-3 text-zinc-600" />
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wide">Voices</span>
                  </div>
                  <div className="text-lg font-bold text-white">{leadStory.metrics.voices}</div>
                  <div className="text-[10px] text-zinc-600">people</div>
                </div>
              </div>
            </div>
          )}

          <p className="text-base text-zinc-400 leading-relaxed">
            {leadStory.content?.signal || leadStory.content?.story?.substring(0, 200) + '...'}
          </p>

          <button 
            onClick={() => onStoryClick(leadStory)}
            className={`px-5 py-2.5 text-white text-sm rounded-lg font-medium transition-colors flex items-center gap-2 ${
              getStoryButtonColor(leadStory.type)
            }`}
          >
            Read Full Analysis
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>

        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em]">Featured Stories</h3>

            <div className="grid grid-cols-2 gap-4">
              {featuredStories.map((story, index) => (
                <StoryCard key={index} story={story} onClick={() => onStoryClick(story)} />
              ))}
            </div>
          </div>
        )}

        {/* AI Disclosure */}
        <div className="pt-5 border-t border-zinc-800">
          <div className="flex items-start gap-2.5 text-[10px] text-zinc-600 leading-relaxed">
            <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <p>
              Stories are AI-generated from on-chain data and social signals. Information is current as of publication but may contain inaccuracies. Always verify critical information before taking action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// STORY CARD (for featured stories grid)
// ============================================================================

const StoryCard = ({ story, onClick }) => (
  <div onClick={onClick} className="group cursor-pointer">
    <div className={`aspect-video rounded-xl mb-3 flex items-center justify-center border transition-all ${
      getStoryCardBg(story.type)
    }`}>
      {getStoryIcon(story.type)}
    </div>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide ${
          getStoryBadgeColor(story.type)
        }`}>
          {story.type === 'critical' ? 'Alert' : story.type === 'live' ? 'Live' : 'Alpha'}
        </span>
        <span className="text-[10px] text-zinc-600">{formatTimeAgo(story.timestamp)}</span>
      </div>
      <h4 className={`text-white font-bold text-sm leading-tight transition-colors ${
        getStoryHoverColor(story.type)
      }`}>
        {story.title}
      </h4>
      <p className="text-xs text-zinc-500 leading-relaxed">
        {story.content?.signal?.substring(0, 80) + '...' || 'Read more'}
      </p>
      
      {story.metrics && (
        <div className="flex items-center justify-center gap-3 pt-1.5 text-[10px]">
          <div className="flex items-center gap-1 text-zinc-600">
            <MessageCircle className="w-3 h-3" />
            <span>{story.metrics.tweets}</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-500">
            <TrendingUp className="w-3 h-3" />
            <span>{formatNumber(story.metrics.engagement)}</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-600">
            <Users className="w-3 h-3" />
            <span>{story.metrics.voices}</span>
          </div>
        </div>
      )}
    </div>
  </div>
);

// ============================================================================
// STORY DETAIL
// ============================================================================

const StoryDetail = ({ story, onBack }) => {
  const storyText = story.content?.story || '';
  const paragraphs = storyText.split('\n\n').filter(p => p.trim());

  return (
    <div className="bg-gradient-to-br from-zinc-950 to-black rounded-3xl overflow-hidden border border-emerald-500/20">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-800">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Magazine</span>
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-emerald-500 font-bold text-xl">VALIDATOR</h1>
          <div className="text-[10px] text-zinc-500">
            Issue #47 • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Title & Meta */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
              getStoryBadgeColor(story.type)
            }`}>
              {story.category}
            </div>
            <span className="text-zinc-700">•</span>
            <span className="text-xs text-zinc-500">{formatTimeAgo(story.timestamp)}</span>
          </div>

          <h1 className="text-3xl font-bold text-white leading-tight">
            {story.title}
          </h1>

          <div className="text-sm text-zinc-500">
            Analysis by {story.author}
          </div>
        </div>

        {/* Story Intelligence Card */}
        {story.metrics && (
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800">
            <div className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] mb-4">Story Intelligence</div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <MessageCircle className="w-4 h-4 text-zinc-600" />
                </div>
                <div className="text-2xl font-bold text-white leading-none mb-1.5">{story.metrics.tweets}</div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wide leading-tight">
                  Tweets<br />Analyzed
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-emerald-400 leading-none mb-1.5">
                  {formatNumber(story.metrics.engagement)}
                </div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wide leading-tight">
                  Total<br />Engagement
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="w-4 h-4 text-violet-500" />
                </div>
                <div className="text-2xl font-bold text-violet-400 leading-none mb-1.5">
                  {formatNumber(story.metrics.topTweet)}
                </div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wide leading-tight">
                  Top<br />Tweet
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-4 h-4 text-zinc-600" />
                </div>
                <div className="text-2xl font-bold text-white leading-none mb-1.5">{story.metrics.voices}</div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wide leading-tight">
                  Unique<br />Voices
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Engagement Trend Chart */}
        {story.metrics?.engagementTrend && (
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-xl p-5 border border-zinc-800">
            <div className="text-sm text-zinc-500 mb-4">5-Day Engagement Trend</div>
            <div className="h-40 flex items-end gap-2">
              {story.metrics.engagementTrend.map((value, i) => {
                const maxValue = Math.max(...story.metrics.engagementTrend);
                const height = (value / maxValue) * 100;
                const isToday = i === story.metrics.engagementTrend.length - 1;
                
                return (
                  <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2">
                    <div className="text-xs font-semibold text-emerald-400">
                      {formatNumber(value)}
                    </div>
                    <div 
                      className={`w-full rounded-t-lg transition-all ${
                        isToday 
                          ? 'bg-gradient-to-t from-emerald-500 to-emerald-400' 
                          : 'bg-gradient-to-t from-emerald-600/40 to-emerald-500/40'
                      }`}
                      style={{height: `${height}%`}}
                    ></div>
                    <div className="text-[10px] text-zinc-600 text-center">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Today'][i] || `Day ${i+1}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* The Signal */}
        {story.content?.signal && (
          <div className="bg-violet-950/20 rounded-xl p-5 border border-violet-500/30">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-violet-400" />
              </div>
              <span className="text-sm font-bold text-violet-400 uppercase tracking-wider">The Signal</span>
            </div>
            <p className="text-base text-white leading-relaxed">
              {story.content.signal}
            </p>
          </div>
        )}

        {/* The Full Story */}
        <div className="prose prose-invert max-w-none space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-sm text-zinc-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Key Takeaways */}
        {story.content?.takeaways && story.content.takeaways.length > 0 && (
          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">Key Takeaways</h3>
            <div className="space-y-3">
              {story.content.takeaways.map((takeaway, index) => (
                <div key={index} className="flex gap-3">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    getStoryTakeawayBg(story.type)
                  }`}>
                    <span className={`text-xs font-bold ${getStoryTakeawayText(story.type)}`}>
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {takeaway}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Who To Follow */}
        {story.content?.whoToFollow && story.content.whoToFollow.length > 0 && (
          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Key Voices</h4>
            </div>
            <div className="space-y-3">
              {story.content.whoToFollow.map((person, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                  <div>
                    <div className="text-white font-medium">{person.handle}</div>
                    <div className="text-xs text-zinc-500">
                      {person.reason}
                      {person.engagement ? ` • ${formatNumber(person.engagement)} engagement` : ''}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getRoleBadgeColor(person.role)}`}>
                    {person.role || 'Community'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Disclosure */}
        <div className="pt-5 border-t border-zinc-800">
          <div className="bg-zinc-900/30 rounded-lg p-4 border border-zinc-800/50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-zinc-500" />
              </div>
              <div className="flex-1 text-xs text-zinc-500 leading-relaxed space-y-2">
                <p>
                  <strong className="text-zinc-400">AI-Generated Analysis:</strong> This story was compiled by AI from {story.metrics?.tweets || 0} tweets with {formatNumber(story.metrics?.engagement || 0)} total engagement, analyzed on {new Date(story.timestamp).toLocaleDateString()}.
                </p>
                <p>
                  Information is accurate as of publication but may contain errors or incomplete context. Always verify critical details through official sources before making financial or security decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function formatTimeAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Story type styling helpers
function getStoryColor(type) {
  if (type === 'critical') return 'bg-red-500';
  if (type === 'live') return 'bg-violet-500';
  return 'bg-emerald-500';
}

function getStoryTextColor(type) {
  if (type === 'critical') return 'text-red-400';
  if (type === 'live') return 'text-violet-400';
  return 'text-emerald-400';
}

function getStoryButtonColor(type) {
  if (type === 'critical') return 'bg-red-500 hover:bg-red-400';
  if (type === 'live') return 'bg-violet-500 hover:bg-violet-400';
  return 'bg-emerald-500 hover:bg-emerald-400';
}

function getStoryCardBg(type) {
  if (type === 'critical') return 'bg-gradient-to-br from-red-950/50 to-red-900/30 border-red-500/20 group-hover:border-red-500/40';
  if (type === 'live') return 'bg-gradient-to-br from-violet-950/50 to-purple-950/30 border-violet-500/20 group-hover:border-violet-500/40';
  return 'bg-gradient-to-br from-emerald-950/50 to-teal-950/30 border-emerald-500/20 group-hover:border-emerald-500/40';
}

function getStoryIcon(type) {
  const className = "w-10 h-10";
  if (type === 'critical') return <Shield className={`${className} text-red-400`} />;
  if (type === 'live') return <Rocket className={`${className} text-violet-400`} />;
  return <Brain className={`${className} text-emerald-400`} />;
}

function getStoryBadgeColor(type) {
  if (type === 'critical') return 'bg-red-500/20 text-red-400';
  if (type === 'live') return 'bg-violet-500/20 text-violet-400';
  return 'bg-emerald-500/20 text-emerald-400';
}

function getStoryHoverColor(type) {
  if (type === 'critical') return 'group-hover:text-red-400';
  if (type === 'live') return 'group-hover:text-violet-400';
  return 'group-hover:text-emerald-400';
}

function getStoryTakeawayBg(type) {
  if (type === 'critical') return 'bg-red-500/10 border border-red-500/30';
  if (type === 'live') return 'bg-violet-500/10 border border-violet-500/30';
  return 'bg-emerald-500/10 border border-emerald-500/30';
}

function getStoryTakeawayText(type) {
  if (type === 'critical') return 'text-red-400';
  if (type === 'live') return 'text-violet-400';
  return 'text-emerald-400';
}

function getRoleBadgeColor(role) {
  if (role === 'Official') return 'bg-violet-500/10 text-violet-400';
  if (role === 'Builder') return 'bg-amber-500/10 text-amber-400';
  if (role === 'Analyst') return 'bg-blue-500/10 text-blue-400';
  return 'bg-emerald-500/10 text-emerald-400'; // Community
}

export default MagazinePremiumStory;

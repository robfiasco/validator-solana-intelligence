import React, { useState } from 'react';
import { 
  TrendingUp, Users, MessageCircle, Activity, Eye,
  ChevronLeft, AlertCircle, Info
} from 'lucide-react';

const ValidatorStoryPreview = () => {
  const mockStories = [
    {
      id: 1,
      category: 'AI / AGENTS',
      title: 'Solana Ponzi-Style Game Launches Amidst Bear Market: Time-Sensitive Opportunity',
      signal: 'Time-sensitive signal: discussion shows urgency and near-term opportunity.',
      author: '@solanafloor',
      date: '14 FEB 2026',
      type: 'live',
      metrics: {
        tweets: 47,
        engagement: 8300,
        topTweet: 1482,
        voices: 12,
        engagementTrend: [3320, 4565, 5644, 6806, 8300]
      },
      content: {
        story: `A new ponzi-style trading game has launched on Solana during the bear market, attracting significant attention from traders seeking high-risk opportunities.\n\nThe game's mechanics involve players managing virtual trading firms and competing for token rewards. Early adopters report substantial returns, though the sustainability of the model remains questionable.\n\nWhat makes this launch notable is the timing - launching during a bear market when users are more conservative typically indicates strong confidence from the developers or a calculated risk to capture attention.\n\nFor Seeker owners, this represents a case study in bear market product launches and community engagement during downturns. The mobile-first approach aligns with the device's core use case.\n\nKey metrics to watch include daily active users, token holder distribution, and retention rates over the next 30 days. These will indicate whether this is sustainable or follows typical ponzi patterns.\n\nRisks include regulatory scrutiny, token value collapse, and reputational damage to the broader Solana ecosystem if the project fails publicly.`,
        takeaways: [
          'Monitor daily active users and token distribution for sustainability signals',
          'Watch for regulatory responses given the explicit ponzi-style mechanics',
          'Track whether Solana ecosystem leaders distance themselves or embrace the project'
        ],
        whoToFollow: [
          { handle: '@solanafloor', reason: 'Breaking the story', role: 'Community', engagement: 1482 },
          { handle: '@sol_nxxn', reason: 'Mechanics breakdown', role: 'Analyst', engagement: 842 },
          { handle: '@cashcitydotfun', reason: 'Official updates', role: 'Official', engagement: 623 }
        ]
      }
    },
    {
      id: 2,
      category: 'SECURITY / RISK ALERT',
      title: 'Figure Data Breach: What Seeker Owners Need to Know',
      signal: 'Blockchain lending firm confirms major security breach affecting customer PII.',
      author: '@SolanaFloor',
      date: '14 FEB 2026',
      type: 'critical',
      metrics: {
        tweets: 15,
        engagement: 4200,
        topTweet: 1204,
        voices: 8,
        engagementTrend: [1680, 2310, 2856, 3444, 4200]
      },
      content: {
        story: `Figure Technology confirmed a data breach after an employee fell victim to a social engineering attack.\n\nThe breach allowed hackers to access internal files containing customer information. ShinyHunters published 2.5GB of allegedly stolen data.\n\nFor Seeker owners, the key takeaway is operational security matters more than technical security. Enable 2FA on all accounts.`,
        takeaways: [
          'If you use Figure: Monitor accounts, enable 2FA, freeze credit if concerned',
          'Watch for phishing attempts using leaked data over next 30 days',
          'Use hardware security keys for all crypto accounts'
        ],
        whoToFollow: [
          { handle: '@SolanaFloor', reason: 'Broke the story', role: 'Community', engagement: 1204 }
        ]
      }
    }
  ];

  const [currentView, setCurrentView] = useState('cover');
  const [selectedStory, setSelectedStory] = useState(null);

  const globalMetrics = {
    total_tweets: 62,
    total_engagement: 12500,
    unique_voices: 20,
    top_tweet: 1482
  };

  if (currentView === 'detail' && selectedStory) {
    return <StoryDetail story={selectedStory} onBack={() => setCurrentView('cover')} />;
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-zinc-950 to-black rounded-3xl overflow-hidden border border-emerald-500/20">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-800">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h1 className="text-emerald-500 font-bold text-2xl mb-1.5">VALIDATOR</h1>
                <p className="text-xs text-zinc-500">Exclusive Intelligence for Seeker Owners</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-zinc-600 uppercase tracking-wide">Seeker Owners Only</div>
                <div className="text-xl font-bold text-emerald-400">1/{mockStories.length}</div>
              </div>
            </div>

            {/* Global Stats Bar */}
            <div className="grid grid-cols-4 gap-3 pt-4 border-t border-zinc-800">
              <div className="text-center">
                <MessageCircle className="w-3.5 h-3.5 text-zinc-600 mx-auto mb-1.5" />
                <div className="text-xl font-bold text-white leading-none mb-1">{globalMetrics.total_tweets}</div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wide leading-tight">
                  Tweets<br />Analyzed
                </div>
              </div>
              <div className="text-center">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mx-auto mb-1.5" />
                <div className="text-xl font-bold text-emerald-400 leading-none mb-1">
                  {(globalMetrics.total_engagement / 1000).toFixed(1)}K
                </div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wide leading-tight">
                  Total<br />Engagement
                </div>
              </div>
              <div className="text-center">
                <Users className="w-3.5 h-3.5 text-zinc-600 mx-auto mb-1.5" />
                <div className="text-xl font-bold text-white leading-none mb-1">{globalMetrics.unique_voices}</div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wide leading-tight">
                  Unique<br />Voices
                </div>
              </div>
              <div className="text-center">
                <Activity className="w-3.5 h-3.5 text-violet-500 mx-auto mb-1.5" />
                <div className="text-xl font-bold text-violet-400 leading-none mb-1">
                  {(globalMetrics.top_tweet / 1000).toFixed(1)}K
                </div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wide leading-tight">
                  Top<br />Tweet
                </div>
              </div>
            </div>
          </div>

          {/* Lead Story */}
          <div className="p-6 space-y-5">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full border border-zinc-700 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                DAILY INTEL
              </div>

              <h2 className="text-3xl font-bold text-white leading-tight">
                {mockStories[0].title}
              </h2>

              <div className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-full border border-cyan-500/30 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  THE SIGNAL
                </div>
                <p className="text-base text-zinc-300 leading-relaxed">
                  {mockStories[0].signal}
                </p>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-pink-500/20 text-pink-400 border border-pink-500/30">
                  {mockStories[0].category}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-500">{mockStories[0].date}</span>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <MessageCircle className="w-3 h-3 text-zinc-600" />
                      <span className="text-[10px] text-zinc-600 uppercase">Coverage</span>
                    </div>
                    <div className="text-lg font-bold text-white">{mockStories[0].metrics.tweets}</div>
                    <div className="text-[10px] text-zinc-600">tweets</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Eye className="w-3 h-3 text-emerald-500" />
                      <span className="text-[10px] text-zinc-600 uppercase">Reach</span>
                    </div>
                    <div className="text-lg font-bold text-emerald-400">
                      {(mockStories[0].metrics.engagement / 1000).toFixed(1)}K
                    </div>
                    <div className="text-[10px] text-zinc-600">engagement</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Users className="w-3 h-3 text-zinc-600" />
                      <span className="text-[10px] text-zinc-600 uppercase">Voices</span>
                    </div>
                    <div className="text-lg font-bold text-white">{mockStories[0].metrics.voices}</div>
                    <div className="text-[10px] text-zinc-600">people</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedStory(mockStories[0]);
                  setCurrentView('detail');
                }}
                className="w-full px-5 py-3 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-400 transition-colors"
              >
                Read Full Analysis
              </button>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
            
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">More Stories</h3>
              
              <div 
                onClick={() => {
                  setSelectedStory(mockStories[1]);
                  setCurrentView('detail');
                }}
                className="bg-zinc-900/30 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all"
              >
                <div className="space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                    {mockStories[1].category}
                  </span>
                  <h4 className="text-white font-bold text-sm leading-tight">
                    {mockStories[1].title}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-600">
                    <span>{mockStories[1].metrics.tweets} tweets</span>
                    <span>•</span>
                    <span>{(mockStories[1].metrics.engagement / 1000).toFixed(1)}K engagement</span>
                  </div>
                </div>
              </div>
            </div>

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
      </div>
    </div>
  );
};

const StoryDetail = ({ story, onBack }) => {
  const paragraphs = story.content.story.split('\n\n');

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-zinc-950 to-black rounded-3xl overflow-hidden border border-emerald-500/20">
          
          <div className="px-6 py-5 border-b border-zinc-800">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Stories</span>
            </button>
            <div className="flex items-center justify-between">
              <h1 className="text-emerald-500 font-bold text-xl">VALIDATOR</h1>
              <div className="text-[10px] text-zinc-500">{story.date}</div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            <div className="space-y-3">
              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                story.type === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                story.type === 'live' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {story.category}
              </span>
              <h1 className="text-3xl font-bold text-white leading-tight">
                {story.title}
              </h1>
              <div className="text-sm text-zinc-500">
                Analysis by {story.author}
              </div>
            </div>

            <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-4">Story Intelligence</div>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <MessageCircle className="w-4 h-4 text-zinc-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white leading-none mb-1.5">{story.metrics.tweets}</div>
                  <div className="text-[10px] text-zinc-600 uppercase tracking-wide leading-tight">
                    Tweets<br />Analyzed
                  </div>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-4 h-4 text-emerald-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-emerald-400 leading-none mb-1.5">
                    {(story.metrics.engagement / 1000).toFixed(1)}K
                  </div>
                  <div className="text-[10px] text-zinc-600 uppercase tracking-wide leading-tight">
                    Total<br />Engagement
                  </div>
                </div>
                <div className="text-center">
                  <Activity className="w-4 h-4 text-violet-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-violet-400 leading-none mb-1.5">
                    {(story.metrics.topTweet / 1000).toFixed(1)}K
                  </div>
                  <div className="text-[10px] text-zinc-600 uppercase tracking-wide leading-tight">
                    Top<br />Tweet
                  </div>
                </div>
                <div className="text-center">
                  <Users className="w-4 h-4 text-zinc-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white leading-none mb-1.5">{story.metrics.voices}</div>
                  <div className="text-[10px] text-zinc-600 uppercase tracking-wide leading-tight">
                    Unique<br />Voices
                  </div>
                </div>
              </div>
            </div>

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
                        {(value / 1000).toFixed(1)}K
                      </div>
                      <div 
                        className={`w-full rounded-t-lg ${
                          isToday 
                            ? 'bg-gradient-to-t from-emerald-500 to-emerald-400' 
                            : 'bg-gradient-to-t from-emerald-600/40 to-emerald-500/40'
                        }`}
                        style={{height: `${height}%`}}
                      ></div>
                      <div className="text-[10px] text-zinc-600">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Today'][i]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-cyan-950/20 rounded-xl p-5 border border-cyan-500/30">
              <div className="flex items-center gap-2.5 mb-3">
                <AlertCircle className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider">The Signal</span>
              </div>
              <p className="text-base text-white leading-relaxed">
                {story.signal}
              </p>
            </div>

            <div className="space-y-4">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-sm text-zinc-300 leading-relaxed">{para}</p>
              ))}
            </div>

            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">
                Key Takeaways
              </h3>
              <div className="space-y-3">
                {story.content.takeaways.map((takeaway, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      story.type === 'critical' ? 'bg-red-500/10 border border-red-500/30' :
                      story.type === 'live' ? 'bg-pink-500/10 border border-pink-500/30' :
                      'bg-emerald-500/10 border border-emerald-500/30'
                    }`}>
                      <span className={`text-xs font-bold ${
                        story.type === 'critical' ? 'text-red-400' :
                        story.type === 'live' ? 'text-pink-400' :
                        'text-emerald-400'
                      }`}>{i + 1}</span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">{takeaway}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Key Voices</h4>
              </div>
              <div className="space-y-3">
                {story.content.whoToFollow.map((person, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                    <div>
                      <div className="text-white font-medium">{person.handle}</div>
                      <div className="text-xs text-zinc-500">
                        {person.reason} • {(person.engagement / 1000).toFixed(1)}K engagement
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      person.role === 'Official' ? 'bg-violet-500/10 text-violet-400' :
                      person.role === 'Analyst' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {person.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-zinc-800">
              <div className="bg-zinc-900/30 rounded-lg p-4 border border-zinc-800/50">
                <div className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-zinc-500 leading-relaxed space-y-2">
                    <p>
                      <strong className="text-zinc-400">AI-Generated Analysis:</strong> This story was compiled by AI from {story.metrics.tweets} tweets with {(story.metrics.engagement / 1000).toFixed(1)}K total engagement.
                    </p>
                    <p>
                      Information is accurate as of publication but may contain errors. Always verify critical details through official sources before making decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorStoryPreview;

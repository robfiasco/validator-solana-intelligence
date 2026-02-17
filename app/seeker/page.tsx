"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  Brain,
  ChevronLeft,
  MessageCircle,
  Rocket,
  TrendingUp,
  Users,
} from "lucide-react";

type Story = {
  title?: string;
  category?: string;
  timestamp?: string;
  publishedAt?: string;
  url?: string;
  summary?: string;
  hook?: string;
  narrative?: string;
  story?: string;
  takeaways?: string[];
  metrics?: {
    tweets?: number;
    engagement?: number;
    voices?: number;
    topTweet?: number;
  };
  stats?: {
    total_tweets?: number;
    total_engagement?: number;
    unique_users?: number;
    top_tweet?: number;
  };
  content?: {
    signal?: string;
    story?: string;
  };
  sections?: Record<string, any>;
};

type StoryPayload = {
  stories?: Story[];
  items?: Story[];
  global_metrics?: {
    total_tweets?: number;
    total_engagement?: number;
    unique_voices?: number;
    top_tweet?: number;
  };
};

export default function SeekerPage() {
  const searchParams = useSearchParams();
  const [stories, setStories] = useState<Story[]>([]);
  const [globalMetrics, setGlobalMetrics] = useState<StoryPayload["global_metrics"]>({});
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/data/validator_stories.json", { cache: "no-store" });
        const data: StoryPayload = await res.json();
        const list = (data.stories || data.items || []).filter(Boolean);
        setStories(list);
        setGlobalMetrics(data.global_metrics || {});
      } catch (err) {
        console.error("Failed to load seeker stories", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!stories.length) return;
    const raw = searchParams.get("story");
    if (raw === null) {
      setSelectedIndex(-1);
      return;
    }
    const idx = Number(raw);
    if (!Number.isFinite(idx)) return;
    const clamped = Math.max(0, Math.min(stories.length - 1, idx));
    setSelectedIndex(clamped);
  }, [searchParams, stories]);

  const computedGlobal = useMemo(() => {
    const totalTweets = Number(
      globalMetrics?.total_tweets ?? stories.reduce((s, item) => s + Number(item?.metrics?.tweets ?? item?.stats?.total_tweets ?? 0), 0),
    );
    const totalEngagement = Number(
      globalMetrics?.total_engagement ?? stories.reduce((s, item) => s + Number(item?.metrics?.engagement ?? item?.stats?.total_engagement ?? 0), 0),
    );
    const uniqueVoices = Number(
      globalMetrics?.unique_voices ?? stories.reduce((s, item) => s + Number(item?.metrics?.voices ?? item?.stats?.unique_users ?? 0), 0),
    );
    const topTweet = Number(
      globalMetrics?.top_tweet ?? Math.max(0, ...stories.map((item) => Number(item?.metrics?.topTweet ?? item?.stats?.top_tweet ?? 0))),
    );

    return {
      totalTweets,
      totalEngagement,
      uniqueVoices,
      topTweet,
    };
  }, [globalMetrics, stories]);

  if (loading) {
    return <div className="seeker-loading">Loading stories...</div>;
  }

  if (!stories.length) {
    return <div className="seeker-loading">No stories available.</div>;
  }

  const lead = stories[0];
  const current = selectedIndex >= 0 ? stories[selectedIndex] : null;

  return (
    <div className="seeker-page">
      {current ? (
        <StoryDetail
          story={current}
          index={selectedIndex}
          total={stories.length}
          onBack={() => setSelectedIndex(-1)}
        />
      ) : (
        <MagazineCover
          stories={stories}
          lead={lead}
          totals={computedGlobal}
          onOpenStory={(index) => setSelectedIndex(index)}
        />
      )}
    </div>
  );
}

function MagazineCover({
  stories,
  lead,
  totals,
  onOpenStory,
}: {
  stories: Story[];
  lead: Story;
  totals: { totalTweets: number; totalEngagement: number; uniqueVoices: number; topTweet: number };
  onOpenStory: (index: number) => void;
}) {
  const moreStories = stories.slice(1, 3);
  const leadStats = lead?.metrics || lead?.stats || {};
  const leadCategory = String(lead?.category || "Daily Intel").toUpperCase();
  const leadColorClass = getKickerClass(leadCategory);

  return (
    <div className="seeker-mag-shell">
      <div className="seeker-mag-header">
        <div>
          <h1 className="seeker-mag-logo">
            <span className="title-logo">VALIDATOR</span>
            <span className="logo-cursor" aria-hidden="true">_</span>
          </h1>
          <p className="seeker-mag-sub">Premium Intelligence • {formatShortDate(lead?.timestamp || lead?.publishedAt)}</p>
        </div>
        <div className="seeker-mag-issue">
          <div className="seeker-mag-issue-label">Issue</div>
          <div className="seeker-mag-issue-value">#{Math.max(stories.length, 1)}</div>
        </div>
      </div>

      <div className="seeker-mag-stats seeker-mag-stats-compact">
        <div className="seeker-mag-stat">
          <i><MessageCircle size={14} strokeWidth={1.8} /></i>
          <strong>{totals.totalTweets || 0}</strong>
          <span>Tweets Analyzed</span>
        </div>
        <div className="seeker-mag-stat">
          <i className="is-green"><TrendingUp size={14} strokeWidth={1.8} /></i>
          <strong className="is-green">{formatCompactNumber(totals.totalEngagement)}</strong>
          <span>Total Engagement</span>
        </div>
        <div className="seeker-mag-stat">
          <i><Users size={14} strokeWidth={1.8} /></i>
          <strong>{totals.uniqueVoices || 0}</strong>
          <span>Unique Voices</span>
        </div>
        <div className="seeker-mag-stat">
          <i className="is-purple"><Activity size={14} strokeWidth={1.8} /></i>
          <strong className="is-purple">{formatCompactNumber(totals.topTweet)}</strong>
          <span>Top Tweet</span>
        </div>
      </div>

      <div className="seeker-mag-divider" />

      <div className="seeker-mag-kicker-row">
        <span className={`seeker-mag-kicker ${leadColorClass}`}>{leadCategory}</span>
      </div>

      <h2 className="seeker-mag-title seeker-mag-title-cover">{lead?.title || "Untitled"}</h2>

      <div className="seeker-mag-meta">
        <span>By AI Validator News Desk</span>
      </div>

      <p className="seeker-mag-preview">
        {compactSentence(lead?.content?.signal || lead?.summary || lead?.hook || lead?.narrative || lead?.title || "", 250)}
      </p>

      <div className="seeker-mag-metrics-label">Story Metrics</div>
      <div className="seeker-mag-metrics">
        <div>
          <span>Coverage</span>
          <strong>{leadStats?.tweets ?? leadStats?.total_tweets ?? 0}</strong>
          <small>tweets</small>
        </div>
        <div>
          <span>Reach</span>
          <strong className="is-green">{formatCompactNumber(leadStats?.engagement ?? leadStats?.total_engagement ?? 0)}</strong>
          <small>engagement</small>
        </div>
        <div>
          <span>Voices</span>
          <strong>{leadStats?.voices ?? leadStats?.unique_users ?? 0}</strong>
          <small>people</small>
        </div>
      </div>

      <div className="seeker-mag-cta-row">
        <button className="seeker-mag-cta primary" onClick={() => onOpenStory(0)} type="button">
          Read Full Story
        </button>
      </div>

      {moreStories.length > 0 ? (
        <div className="seeker-mag-more">
          <h3>Featured Stories</h3>
          <div className="seeker-mag-grid">
            {moreStories.map((story, idx) => (
              <button key={`${story?.title || "story"}-${idx}`} className="seeker-mag-card seeker-mag-card-button" onClick={() => onOpenStory(idx + 1)} type="button">
                <div className={`seeker-mag-thumb ${idx % 2 === 0 ? "live" : "alpha"}`}>
                  {idx % 2 === 0 ? <Rocket size={36} /> : <Brain size={36} />}
                </div>
                <div className="seeker-mag-card-row">
                  <span className={`seeker-mag-card-tag ${idx % 2 === 0 ? "live" : "alpha"}`}>{idx % 2 === 0 ? "LIVE" : "ALPHA"}</span>
                  <span className="seeker-mag-card-time">{formatShortDate(story?.timestamp || story?.publishedAt)}</span>
                </div>
                <div className="seeker-mag-card-title">{story?.title || "Untitled"}</div>
                <div className="seeker-mag-card-sub">{compactSentence(story?.summary || story?.hook || story?.narrative || story?.title || "", 90)}</div>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StoryDetail({ story, index, total, onBack }: { story: Story; index: number; total: number; onBack: () => void }) {
  const metrics = {
    tweets: Number(story?.metrics?.tweets ?? story?.stats?.total_tweets ?? 0),
    engagement: Number(story?.metrics?.engagement ?? story?.stats?.total_engagement ?? 0),
    voices: Number(story?.metrics?.voices ?? story?.stats?.unique_users ?? 0),
    topTweet: Number(story?.metrics?.topTweet ?? story?.stats?.top_tweet ?? 0),
  };

  const sections = (story?.sections && typeof story.sections === "object") ? story.sections : {};
  const timeline = Array.isArray(sections.timeline) ? sections.timeline : [];
  const keyQuotes = Array.isArray(sections.keyQuotes) ? sections.keyQuotes : [];
  const keyPlayers = Array.isArray(sections.keyPlayers) ? sections.keyPlayers : [];
  const takeaways = Array.isArray(story?.takeaways) ? story.takeaways : [];

  const fullText = String(story?.content?.story || story?.story || story?.narrative || "").replace(/\[object Object\]/g, "").trim();
  const bodyParagraphs = fullText.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

  const analysisCards = [
    { title: "What Happened", value: sections.whatHappened || story?.narrative },
    { title: "Why It Matters", value: sections.whyItMatters || story?.summary },
    { title: "Market Impact", value: story?.content?.signal || sections.marketImpact },
    { title: "What to Watch", value: sections.whatToWatch || story?.hook },
  ].filter((item) => typeof item.value === "string" && item.value.trim().length > 0);

  return (
    <div className="seeker-detail-shell">
      <button className="seeker-detail-back" onClick={onBack} type="button">
        <ChevronLeft size={16} /> Back to Magazine
      </button>

      <div className="seeker-detail-header">
        <div>
          <h1 className="seeker-mag-logo seeker-detail-logo">
            <span className="title-logo">VALIDATOR</span>
            <span className="logo-cursor" aria-hidden="true">_</span>
          </h1>
          <p className="seeker-detail-sub">Premium Intelligence • {formatShortDate(story?.timestamp || story?.publishedAt)}</p>
        </div>
        <div className="seeker-detail-issue">
          <div className="seeker-mag-issue-label">Issue</div>
          <div className="seeker-mag-issue-value seeker-detail-issue-value">#{Math.max(index + 1, 1)}</div>
          <div className="seeker-detail-count">{index + 1}/{Math.max(total, 1)}</div>
        </div>
      </div>

      <div className="seeker-detail-hero">
        <div className={`seeker-mag-kicker ${getKickerClass(String(story?.category || ""))}`}>
          {String(story?.category || "Seeker Story").toUpperCase()}
        </div>
        <h2 className="seeker-detail-title">{story?.title || "Untitled"}</h2>
        <p className="seeker-detail-author">Analysis by AI Validator News Desk</p>
      </div>

      <div className="seeker-detail-metrics">
        <div className="seeker-detail-metric-card">
          <MessageCircle size={16} />
          <strong>{metrics.tweets}</strong>
          <span>Tweets</span>
        </div>
        <div className="seeker-detail-metric-card">
          <TrendingUp size={16} className="is-green" />
          <strong className="is-green">{formatCompactNumber(metrics.engagement)}</strong>
          <span>Engage</span>
        </div>
        <div className="seeker-detail-metric-card">
          <Users size={16} />
          <strong>{metrics.voices}</strong>
          <span>Voices</span>
        </div>
        <div className="seeker-detail-metric-card">
          <Activity size={16} className="is-purple" />
          <strong className="is-purple">{formatCompactNumber(metrics.topTweet)}</strong>
          <span>Top</span>
        </div>
      </div>

      {timeline.length > 0 ? (
        <section className="seeker-detail-card">
          <h3>Event Timeline</h3>
          <div className="seeker-detail-timeline">
            {timeline.map((event: any, idx: number) => (
              <div key={`${event?.date || "event"}-${idx}`} className="seeker-detail-timeline-row">
                <span className={`dot ${timelineDotClass(event?.impact)}`} />
                <div>
                  <small>{String(event?.date || "")}</small>
                  <p>{String(event?.event || "")}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {keyQuotes.length > 0 ? (
        <section className="seeker-detail-card">
          <h3>Key Voices</h3>
          <div className="seeker-detail-quotes">
            {keyQuotes.map((quote: any, idx: number) => (
              <article key={`${quote?.author || "quote"}-${idx}`} className={`seeker-quote ${quoteColorClass(quote?.sentiment)}`}>
                <p>&ldquo;{String(quote?.text || "")}&rdquo;</p>
                <small>{String(quote?.author || "")}</small>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {keyPlayers.length > 0 ? (
        <section className="seeker-detail-card">
          <h3>Key Players</h3>
          <div className="seeker-detail-players">
            {keyPlayers.map((player: any, idx: number) => (
              <div key={`${player?.name || "player"}-${idx}`} className="seeker-detail-player-row">
                <div>
                  <p>{String(player?.name || "")}</p>
                  <small>{String(player?.role || "")}{player?.stance ? ` • ${player.stance}` : ""}</small>
                </div>
                <span>{String(player?.influence || "")}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {analysisCards.length > 0 ? (
        <section className="seeker-detail-card">
          <h3>Analysis</h3>
          <div className="seeker-detail-analysis-list">
            {analysisCards.map((card) => (
              <article key={card.title} className="seeker-detail-analysis-item">
                <h4>{card.title}</h4>
                <p>{String(card.value)}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {takeaways.length > 0 ? (
        <section className="seeker-detail-card seeker-detail-actions-card">
          <h3>What To Do Now</h3>
          <ul>
            {takeaways.slice(0, 4).map((takeaway, idx) => (
              <li key={`${takeaway}-${idx}`}>{takeaway}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {bodyParagraphs.length > 0 ? (
        <section className="seeker-detail-card">
          <h3>Full Story</h3>
          <div className="seeker-detail-body">
            {bodyParagraphs.map((p, idx) => (
              <p key={`${p.slice(0, 40)}-${idx}`}>{p}</p>
            ))}
          </div>
        </section>
      ) : null}

      <div className="seeker-detail-disclaimer">
        AI-generated analysis from on-chain and social signal data. Verify critical claims with primary sources before acting.
      </div>
    </div>
  );
}

function getKickerClass(categoryRaw: string) {
  const category = String(categoryRaw || "").toLowerCase();
  if (/security|risk|breach|exploit|hack/.test(category)) return "critical";
  if (/ai|agent/.test(category)) return "ai";
  if (/gaming|game/.test(category)) return "gaming";
  return "";
}

function timelineDotClass(impactRaw: unknown) {
  const impact = String(impactRaw || "").toLowerCase();
  if (impact === "high") return "high";
  if (impact === "medium") return "medium";
  return "low";
}

function quoteColorClass(sentimentRaw: unknown) {
  const sentiment = String(sentimentRaw || "").toLowerCase();
  if (sentiment === "negative") return "negative";
  if (sentiment === "positive") return "positive";
  return "neutral";
}

function formatCompactNumber(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return `${Math.round(value)}`;
}

function formatShortDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function compactSentence(value: string, maxLen = 180) {
  const cleaned = String(value || "").replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLen) return cleaned;
  return `${cleaned.slice(0, Math.max(0, maxLen - 1)).trimEnd()}…`;
}

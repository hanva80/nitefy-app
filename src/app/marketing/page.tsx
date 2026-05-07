import type { Metadata } from "next";
import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Handshake,
  MapPinned,
  Megaphone,
  Share2,
  Sparkles,
  Ticket,
  Users,
  Video
} from "lucide-react";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "NITEFY Marketing Launch Plan",
  description: "Local launch strategy for validating NITEFY in Düsseldorf and NRW."
};

const channels = [
  {
    title: "TikTok + Instagram Reels",
    icon: <Video size={20} />,
    priority: "Primary channel",
    target: "18-28 year olds deciding where to go this weekend",
    action: "Publish short venue-fit videos by music taste: Afrobeats, Techno, R&B, Charts.",
    proof: "Show real vibe, music, dress code, price, queue and crowd before asking users to click."
  },
  {
    title: "Local microinfluencers",
    icon: <Users size={20} />,
    priority: "Trust builder",
    target: "Creators in Düsseldorf, Köln, Essen and Dortmund",
    action: "Brief creators around: I tried NITEFY to choose where to go tonight.",
    proof: "Prioritize credible local nightlife voices over generic lifestyle reach."
  },
  {
    title: "Street and community",
    icon: <MapPinned size={20} />,
    priority: "Weekend activation",
    target: "Campuses, bars, Spätis, barber shops, cafes and club areas",
    action: "Use QR stickers, small posters and flyers near moments of nightlife decision.",
    proof: "Lead with: Spotify knows your music. NITEFY knows where you should go."
  },
  {
    title: "Venue partnerships",
    icon: <Handshake size={20} />,
    priority: "Supply quality",
    target: "Clubs, bars and event spaces with strong visual identity",
    action: "Offer verified or featured presence in exchange for real content and fresh event info.",
    proof: "Ask for discounts, guestlist access or visual material that makes recommendations more trustworthy."
  }
];

const creativeAngles = [
  {
    name: "Music first",
    line: "Your music taste, turned into tonight's plan.",
    metric: "Spotify connects"
  },
  {
    name: "Group indecision",
    line: "No more group chat chaos. Pick the right spot fast.",
    metric: "Recommendation starts"
  },
  {
    name: "Venue preview",
    line: "Find the place that actually fits your night.",
    metric: "Venue detail views"
  }
];

const campaignSteps = [
  "Connect Spotify",
  "Pick tonight's vibe",
  "Get a venue match",
  "Share it to the group"
];

const testMessages = [
  "Find the place that actually fits your night.",
  "Your music taste, turned into tonight's plan.",
  "Stop scrolling Google Maps. NITEFY the night.",
  "No more group chat chaos. Pick the right spot fast.",
  "Where should we go tonight? Ask NITEFY."
];

const metrics = [
  "Landing visits",
  "Spotify connects",
  "Preference changes",
  "Venue card clicks",
  "Venue detail views",
  "Tester feedback"
];

export default function MarketingPage() {
  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-night/88 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <a href="/" className="group">
            <div className="text-2xl font-black tracking-normal text-white transition group-hover:text-lime">NITEFY</div>
            <p className="mt-1 text-sm font-semibold text-white/58">Marketing launch plan</p>
          </a>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-xs font-bold text-white/78">
              <MapPinned size={14} className="text-cyan" />
              Düsseldorf / NRW
            </span>
            <a href="/" className="rounded-full bg-white px-4 py-2 text-xs font-black text-night transition hover:bg-lime">
              Open app
            </a>
          </div>
        </header>

        <section className="py-8 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 py-2 text-xs font-black uppercase text-lime">
                <Megaphone size={15} />
                Local validation sprint
              </p>
              <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] text-white sm:text-7xl">
                No pierdas la noche decidiendo.
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/72">
                Encuentra el sitio que encaja con tu música, vibe y grupo. NITEFY launches first as a local, visual and music-led nightlife decision tool for Düsseldorf and NRW.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#11141d]/88 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur">
              <p className="text-xs font-black uppercase text-cyan">Success target</p>
              <h2 className="mt-2 text-3xl font-black leading-tight text-white">Open more venue pages after matching.</h2>
              <p className="mt-3 text-sm leading-6 text-white/64">
                Run the first test over 2-4 weekends and pick the winning creative angle by venue detail conversion.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          {channels.map((channel) => (
            <LaunchCard key={channel.title}>
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-lime text-night">{channel.icon}</span>
                <span className="rounded-full bg-white/[0.08] px-3 py-1 text-[11px] font-black uppercase text-white/66">{channel.priority}</span>
              </div>
              <h2 className="mt-4 text-xl font-black leading-tight text-white">{channel.title}</h2>
              <p className="mt-3 text-sm font-bold leading-6 text-cyan">{channel.target}</p>
              <p className="mt-3 text-sm leading-6 text-white/68">{channel.action}</p>
              <p className="mt-3 text-sm leading-6 text-white/52">{channel.proof}</p>
            </LaunchCard>
          ))}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-lg border border-white/10 bg-[#0d1018]/88 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-lime">Tonight Match</p>
                <h2 className="mt-2 text-3xl font-black leading-tight text-white">The acquisition hook</h2>
              </div>
              <Sparkles size={24} className="text-lime" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {campaignSteps.map((step, index) => (
                <div key={step} className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-cyan text-sm font-black text-night">{index + 1}</span>
                  <p className="mt-4 text-sm font-black leading-5 text-white">{step}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-white/62">
              Do not sell algorithms or AI. Sell the feeling: the place that fits tonight, fast enough to send to the group chat.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#11141d]/88 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur">
            <p className="flex items-center gap-2 text-xs font-black uppercase text-cyan">
              <ClipboardList size={15} />
              Test messages
            </p>
            <div className="mt-4 space-y-2">
              {testMessages.map((message) => (
                <div key={message} className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-3 text-sm font-bold leading-5 text-white/78">
                  {message}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          {creativeAngles.map((angle) => (
            <LaunchCard key={angle.name}>
              <p className="text-xs font-black uppercase text-lime">{angle.name}</p>
              <h2 className="mt-3 text-2xl font-black leading-tight text-white">{angle.line}</h2>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-black text-white/72">
                <BarChart3 size={14} className="text-cyan" />
                Main metric: {angle.metric}
              </p>
            </LaunchCard>
          ))}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div className="rounded-lg border border-white/10 bg-[#11141d]/88 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur">
            <p className="flex items-center gap-2 text-xs font-black uppercase text-lime">
              <Ticket size={15} />
              Venue offer
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white">Verified presence for better trust.</h2>
            <p className="mt-3 text-sm leading-6 text-white/64">
              Offer clubs and bars a featured or verified spot when they provide fresh events, real visuals, crowd expectations and a small user benefit.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#0d1018]/88 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur">
            <p className="flex items-center gap-2 text-xs font-black uppercase text-cyan">
              <Share2 size={15} />
              Measurement board
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.05] p-3 text-sm font-bold text-white/76">
                  <CheckCircle2 size={17} className="shrink-0 text-lime" />
                  {metric}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function LaunchCard({ children }: { children: ReactNode }) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#11141d]/88 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur">
      {children}
    </article>
  );
}

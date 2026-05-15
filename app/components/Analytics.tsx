"use client";

import {
  ChevronRight,
  Gift,
  Megaphone,
  RefreshCw,
  Store,
  Trophy,
  Users,
} from "lucide-react";

export default function Analytics() {
  return (
    <div>
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="h-1 w-12 bg-primary rounded-full mb-3" />
          <h2 className="font-russo text-3xl tracking-tight text-white uppercase">
            Analytics <span className="text-primary/90">Overview</span>
          </h2>
          <p className="text-muted-foreground text-sm font-light">
            Real-time performance metrics for your city network.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="group rounded-3xl border border-white/10 bg-white/[0.02] p-1 shadow-xl backdrop-blur-xl transition-all hover:border-primary/30">
          <div className="rounded-[22px] bg-[#020817]/80 p-6 border border-white/5 h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Store size={24} />
              </div>
              <span className="text-[10px] font-bold text-primary/50 uppercase tracking-widest">
                Global
              </span>
            </div>
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
              Total Stores
            </p>
            <h3 className="font-russo text-4xl text-white mt-1">128</h3>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <ChevronRight size={12} className="-rotate-90" /> +12% from last
                month
              </p>
            </div>
          </div>
        </div>

        <div className="group rounded-3xl border border-white/10 bg-white/[0.02] p-1 shadow-xl backdrop-blur-xl transition-all hover:border-primary/30">
          <div className="rounded-[22px] bg-[#020817]/80 p-6 border border-white/5 h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                <Users size={24} />
              </div>
              <span className="text-[10px] font-bold text-blue-400/50 uppercase tracking-widest">
                Active
              </span>
            </div>
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
              Total Customers
            </p>
            <h3 className="font-russo text-4xl text-white mt-1">8,432</h3>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-[11px] text-blue-400">
                Total registered users city-wide
              </p>
            </div>
          </div>
        </div>

        <div className="group rounded-3xl border border-white/10 bg-white/[0.02] p-1 shadow-xl backdrop-blur-xl transition-all hover:border-primary/30">
          <div className="rounded-[22px] bg-[#020817]/80 p-6 border border-white/5 h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                <Trophy size={24} />
              </div>
              <span className="text-[10px] font-bold text-purple-400/50 uppercase tracking-widest">
                Level Stats
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                  Max Content
                </p>
                <h3 className="font-russo text-2xl text-white mt-1">100</h3>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                  User Peak
                </p>
                <h3 className="font-russo text-2xl text-primary mt-1">
                  Lv. 84
                </h3>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[84%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 group rounded-3xl border border-white/10 bg-white/[0.02] p-1 shadow-xl backdrop-blur-xl">
          <div className="rounded-[22px] bg-[#020817]/80 p-8 border border-white/5 h-full flex flex-col justify-between">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                  <Gift size={20} />
                </div>
                <div>
                  <h4 className="font-russo text-lg uppercase tracking-wider text-white">
                    Rewards Lifecycle
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Tracking the flow of customer incentives
                  </p>
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                  Total Available
                </p>
                <p className="font-russo text-xl text-white">4,500</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-blue-400 uppercase">
                    Claimed
                  </span>
                  <span className="font-russo text-xl text-blue-400">
                    3,240
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-[72%] rounded-full shadow-[0_0_10px_rgba(96,165,250,0.3)]" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">
                    Used
                  </span>
                  <span className="font-russo text-xl text-emerald-400">
                    2,100
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[46%] rounded-full shadow-[0_0_10px_rgba(52,211,153,0.3)]" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-rose-400 uppercase">
                    Expired
                  </span>
                  <span className="font-russo text-xl text-rose-400">856</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 w-[19%] rounded-full shadow-[0_0_10px_rgba(251,113,133,0.3)]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="group rounded-3xl border border-white/10 bg-white/[0.02] p-1 shadow-xl backdrop-blur-xl">
          <div className="rounded-[22px] bg-[#020817]/80 p-8 border border-white/5 h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Megaphone size={20} />
              </div>
              <h4 className="font-russo text-lg uppercase tracking-wider text-white">
                Ad Traffic
              </h4>
            </div>
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">
                    Reward Ads
                  </p>
                  <p className="font-russo text-2xl text-white">2,840</p>
                </div>
                <p className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  High Intent
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">
                    Interstitial
                  </p>
                  <p className="font-russo text-2xl text-white">1,120</p>
                </div>
                <p className="text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  Standard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

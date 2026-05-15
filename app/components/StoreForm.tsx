"use client";

import React from "react";
import { 
  Plus, Search, ChevronDown, Camera, Trash2, LayoutGrid, Globe, MapPin, Clock, Save, X, Hash, Facebook, Instagram
} from "lucide-react";
import { Input } from "@/components/ui/input";

// --- UI Sub-Components ---

const FieldLabel = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-6">
    <h3 className="text-2xl font-russo uppercase tracking-wider text-white">
      {title}
    </h3>
    {subtitle && (
      <div className="flex items-center gap-2 mt-1">
        <span className="h-px w-4 bg-rose-500/50" />
        <p className="text-[10px] font-bold text-rose-500/80 uppercase tracking-[0.2em]">
          {subtitle}
        </p>
      </div>
    )}
  </div>
);

const InputWrapper = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">
      {label}
    </label>
    {children}
  </div>
);

// --- Main Form Component ---

export default function StoreOnboardingForm() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-16 px-6">
      {/* Background Polish */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.07)_0%,transparent_50%)] pointer-events-none" />
      
      {/* Container constrained to prevent stretching */}
      <div className="max-w-4xl mx-auto relative">
        
        {/* HEADER */}
        <header className="flex items-center justify-between mb-16 border-b border-white/5 pb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl border border-rose-500/30 bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
              <LayoutGrid size={28} />
            </div>
            <div>
              <h1 className="font-russo text-3xl uppercase tracking-tight text-white">
                Store <span className="text-rose-500">Onboarding</span>
              </h1>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mt-1">
                Node Initialization Protocol
              </p>
            </div>
          </div>
          <button className="p-3 rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-all">
            <X size={24} />
          </button>
        </header>

        <div className="space-y-20">
          
          {/* SECTION 1: IDENTITY */}
          <section>
            <FieldLabel title="Store Identity" subtitle="Core Brand Metadata" />
            
            <div className="grid grid-cols-12 gap-8">
              {/* Logo Upload - Takes 4/12 columns */}
              <div className="col-span-12 md:col-span-4">
                <div className="group relative aspect-square rounded-3xl border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-rose-500/40 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-rose-500 group-hover:scale-110 transition-all">
                    <Camera size={32} />
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Upload Logo</span>
                    <span className="text-[9px] text-white/10 mt-1 uppercase">SVG, PNG, WEBP</span>
                  </div>
                </div>
              </div>

              {/* Main Info - Takes 8/12 columns */}
              <div className="col-span-12 md:col-span-8 space-y-6">
                <InputWrapper label="Official Designation">
                  <Input placeholder="Redline Detailing Center" className="h-14 bg-white/[0.02] border-white/10 rounded-2xl focus:border-rose-500/50 transition-all" />
                </InputWrapper>
                
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper label="Industry Category">
                    <div className="relative">
                      <Input placeholder="Automotive" className="h-12 bg-white/[0.02] border-white/10 rounded-xl" />
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    </div>
                  </InputWrapper>
                  <InputWrapper label="Digital Domain">
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500/40" size={16} />
                      <Input placeholder="www.store.com" className="h-12 bg-white/[0.02] border-white/10 rounded-xl pl-12" />
                    </div>
                  </InputWrapper>
                </div>
              </div>

              <div className="col-span-12">
                <InputWrapper label="Mission Brief / Description">
                  <textarea className="w-full h-32 bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all resize-none" placeholder="Enter store mission statement..." />
                </InputWrapper>
              </div>
            </div>
          </section>

          {/* SECTION 2: LOGISTICS */}
          <section>
            <FieldLabel title="Geographic Node" subtitle="Location & GPS Coordination" />
            
            <div className="space-y-6">
              <InputWrapper label="Global Search / Address">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={20} />
                  <Input placeholder="Search for physical deployment location..." className="h-14 bg-white/[0.02] border-white/10 rounded-2xl pl-14" />
                </div>
              </InputWrapper>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">Latitude</p>
                    <span className="font-mono text-xl text-white">15.1451° N</span>
                  </div>
                  <Hash size={24} className="text-white/5" />
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">Longitude</p>
                    <span className="font-mono text-xl text-white">120.5887° E</span>
                  </div>
                  <Hash size={24} className="text-white/5" />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: OPERATIONS */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <FieldLabel title="Uptime Schedule" subtitle="Weekly Operational Window" />
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase text-white/60 hover:text-rose-500 hover:border-rose-500/40 transition-all">
                <Plus size={14} /> Add Day
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day) => (
                <div key={day} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-rose-500">
                    <Clock size={18} />
                  </div>
                  <span className="flex-1 text-xs font-bold uppercase tracking-widest text-white/60">{day}</span>
                  <div className="flex items-center gap-2">
                    <Input defaultValue="09:00" className="w-16 h-8 bg-black/40 border-white/5 text-[10px] text-center p-0 rounded-lg" />
                    <span className="text-white/10">-</span>
                    <Input defaultValue="18:00" className="w-16 h-8 bg-black/40 border-white/5 text-[10px] text-center p-0 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FOOTER ACTIONS */}
          <footer className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-white/20 hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </button>
              <button className="flex items-center gap-2 text-white/20 hover:text-rose-400 transition-colors">
                <Instagram size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-all">
                Discard Draft
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-500 text-white px-10 py-4 rounded-2xl font-russo uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(244,63,94,0.2)] transition-all hover:-translate-y-1 active:translate-y-0">
                <Save size={20} />
                Deploy Node
              </button>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}
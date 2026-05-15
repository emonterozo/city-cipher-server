"use client";

import { Plus } from "lucide-react";
import Analytics from "./Analytics";
import CustomerList from "./CustomerList";
import StoreList from "./StoreList";

export default function Admin() {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[#020817] text-foreground">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:35px_35px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-[-5%] right-[-5%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative flex flex-1 flex-col overflow-y-auto p-6 lg:p-10 z-10">
        <Analytics />
        <StoreList />
        <CustomerList />
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <button
          className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-primary px-6 py-4 font-russo text-xs uppercase tracking-widest text-primary-foreground shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] active:scale-95"
          onClick={() => console.log("Open Onboarding Modal")}
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />

          <Plus size={18} strokeWidth={3} />
          <span className="hidden md:inline">Store Onboarding</span>
        </button>
      </div>
    </div>
  );
}

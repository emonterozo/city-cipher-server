import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Store,
  ChevronRight,
  Search,
  ChevronLeft,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function StoreList() {
  const [searchQuery, setSearchQuery] = useState("");

  const loadStores = async () => {
    const res = await fetch("/api/stores?is_active=true&page=1&limit=10");
    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    loadStores();
  }, []);

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto  bg-[#020817] mt-10">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="h-1 w-12 bg-primary rounded-full mb-3" />
          <h2 className="font-russo text-3xl tracking-tight text-white uppercase">
            Store <span className="text-primary/90">Directory</span>
          </h2>
          <p className="text-muted-foreground text-sm font-light">
            Managing active locations in the network.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group min-w-[300px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
              size={18}
            />
            <Input
              placeholder="Search store name or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-12 pr-4 rounded-xl bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all w-full"
            />
          </div>
          <button className="flex h-12 items-center gap-2 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="group rounded-3xl border border-white/10 bg-white/[0.02] p-1 shadow-xl backdrop-blur-xl transition-all">
        <div className="rounded-[22px] bg-[#020817]/80 border border-white/5 overflow-hidden">
          <div className="p-1">
            <Table>
              <TableHeader className="bg-white/[0.02]">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="w-[12%] text-[10px] uppercase tracking-widest font-bold text-muted-foreground py-5">
                    Store ID
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                    Store Details
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                    District
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-right px-8">
                    Activity
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow
                    key={i}
                    className="border-white/5 hover:bg-white/[0.02] transition-colors group/row"
                  >
                    <TableCell className="font-russo text-xs text-muted-foreground/60 tracking-widest px-6">
                      #ST-00{i}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 py-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover/row:scale-110 transition-transform">
                          <Store size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">
                            Neon Coffee House #{i}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                            Established May 2026
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm font-light">
                      Central District
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/5 text-emerald-400 text-[10px] font-bold uppercase border border-emerald-500/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{" "}
                        Active
                      </span>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-russo text-white tracking-wider">
                          {120 * i}
                        </span>
                        <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
                          Total Claims
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <button className="text-muted-foreground hover:text-white transition-colors">
                        <MoreHorizontal size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between px-8 py-5 bg-white/[0.02] border-t border-white/5">
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                Showing <span className="text-white font-medium">1-5</span> of{" "}
                <span className="text-white font-medium">128</span> stores
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 transition-all disabled:opacity-30"
                disabled
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1 mx-2">
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    className={`h-9 w-9 rounded-lg text-xs font-russo transition-all ${page === 1 ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(251,191,36,0.3)]" : "hover:bg-white/5 text-muted-foreground"}`}
                  >
                    {page}
                  </button>
                ))}
                <span className="text-muted-foreground px-1">...</span>
                <button className="h-9 w-9 rounded-lg text-xs font-russo hover:bg-white/5 text-muted-foreground">
                  12
                </button>
              </div>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 transition-all">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

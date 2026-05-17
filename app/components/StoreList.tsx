import { useEffect, useRef, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Store, Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getStores, GetStoresResponse } from "@/lib/api/stores";
import { Pagination } from "./Pagination";
import { AppState, PaginationMeta } from "../types";
import { Skeleton } from "@/components/ui/skeleton";

const LIMIT = 5;
const TABLE_HEADER = [
  "Store Details",
  "Store Category",
  "Branches",
  "Status",
  "Activity",
];

const COLUMN_WIDTHS = [
  "w-[350px] min-w-[350px] max-w-[350px]",
  "w-[200px] min-w-[200px] max-w-[200px] px-6",
  "w-[150px] min-w-[150px] max-w-[150px]",
  "w-[150px] min-w-[150px] max-w-[150px]",
  "w-[120px] min-w-[120px] max-w-[120px] text-right",
];

export default function StoreList() {
  const [stores, setStores] = useState<GetStoresResponse["data"]>([]);
  const [storeState, setStoreState] = useState<AppState>("loading");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 1,
  });
  const [inputPage, setInputPage] = useState<number | "">(meta.page);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const loadStores = useCallback(
    async (currentPage: number, search: string) => {
      try {
        setStoreState("loading");
        const response = await getStores({
          page: currentPage,
          search: search,
          limit: LIMIT,
        });
        if (response.success) {
          setMeta(response.meta);
          setStores(response.data);
          setStoreState("loaded");
        } else {
          setStores([]);
          setStoreState("error");
        }
      } catch {
        setStores([]);
        setStoreState("error");
      }
    },
    [],
  );

  useEffect(() => {
    let isMounted = true;

    const triggerLoad = () => {
      if (isMounted) {
        loadStores(meta.page, searchQuery);
      }
    };

    const timeoutId = setTimeout(triggerLoad, 0);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [meta.page, searchQuery, loadStores]);

  const remainingItems = meta.total - (meta.page - 1) * LIMIT;
  const currentSkeletonCount =
    Math.max(0, Math.min(LIMIT, remainingItems)) || LIMIT;

  return (
    <div className="relative flex flex-col bg-[#020817] mt-10 w-full">
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="h-12 pl-12 pr-4 rounded-xl bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all w-full"
            />
          </div>
          <button
            onClick={() => {
              setSearchQuery(inputValue);
            }}
            className="flex h-12 items-center gap-2 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
          >
            <Filter size={16} /> Search
          </button>
          {searchQuery !== "" && (
            <button
              onClick={() => {
                setSearchQuery("");
                setInputValue("");
              }}
              className="flex h-12 items-center gap-2 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
            >
              <X size={16} /> Clear
            </button>
          )}
        </div>
      </div>
      <div className="group rounded-3xl border border-white/10 bg-white/[0.02] p-1 shadow-xl backdrop-blur-xl transition-all">
        <div className="rounded-[22px] bg-[#020817]/80 border border-white/5 overflow-hidden">
          <div className="p-1">
            <Table>
              <TableHeader className="bg-white/[0.02]">
                <TableRow className="border-white/5 hover:bg-transparent">
                  {TABLE_HEADER.map((h, index) => (
                    <TableHead
                      key={h}
                      className={`text-[10px] uppercase tracking-widest font-bold text-muted-foreground py-5 ${COLUMN_WIDTHS[index]}`}
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {storeState === "error" && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-16">
                      <div className="flex flex-col items-center justify-center text-center gap-4">
                        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                          <X className="text-red-400" size={28} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-white font-medium text-md">
                            Something went wrong. Please try again.
                          </p>
                        </div>
                        <button
                          onClick={() => loadStores(meta.page, searchQuery)}
                          className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(251,191,36,0.25)] hover:brightness-110 active:scale-[0.98] transition-all"
                        >
                          Try Again
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {storeState === "loaded" && stores.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-16">
                      <div className="flex flex-col items-center justify-center text-center gap-3">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                          <Store size={28} className="text-muted-foreground" />
                        </div>

                        <div className="space-y-1">
                          <p className="text-white font-medium text-sm">
                            No stores found
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Try adjusting your search or filters
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {storeState === "loading" ? (
                  <TableSkeleton rowCount={currentSkeletonCount} />
                ) : (
                  stores.map((store) => (
                    <TableRow
                      key={store._id.toString()}
                      className="border-white/5 hover:bg-white/[0.02] transition-colors group/row"
                    >
                      <TableCell className={COLUMN_WIDTHS[0]}>
                        <div className="flex items-center gap-3 py-2">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover/row:scale-110 transition-transform">
                            <Store size={18} />
                          </div>
                          <div className="truncate">
                            <p className="font-medium text-white text-sm truncate">
                              {store.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                              {`Join on ${new Date(
                                store.created_at,
                              ).toLocaleDateString("en-US", {
                                month: "long",
                                day: "2-digit",
                                year: "numeric",
                              })}`}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        className={`font-russo text-xs text-muted-foreground/60 tracking-widest ${COLUMN_WIDTHS[1]}`}
                      >
                        {store.category}
                      </TableCell>
                      <TableCell
                        className={`text-muted-foreground text-sm font-light ${COLUMN_WIDTHS[2]}`}
                      >
                        {`${store.branches.length} branches`}
                      </TableCell>
                      <TableCell className={COLUMN_WIDTHS[3]}>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                            store.is_active
                              ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                              : "bg-red-500/5 text-red-400 border-red-500/10"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                              store.is_active ? "bg-emerald-400" : "bg-red-400"
                            }`}
                          />
                          {store.is_active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className={COLUMN_WIDTHS[4]}>
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-russo text-white tracking-wider">
                            120
                          </span>
                          <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
                            Total Used
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {storeState === "loaded" && stores.length > 0 && (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              inputPage={inputPage}
              inputRef={inputRef}
              setInputPage={setInputPage}
              setPage={(page: number) => {
                setMeta((prev) => ({ ...prev, page }));
              }}
              limit={LIMIT}
              total={meta.total}
              label="stores"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TableSkeleton({ rowCount = 5 }: { rowCount?: number }) {
  const skeletonRows = Array.from({ length: rowCount }, (_, i) => `row-${i}`);

  return skeletonRows.map((rowId) => (
    <TableRow key={rowId} className="border-white/5 hover:bg-transparent">
      <TableCell className={COLUMN_WIDTHS[0]}>
        <div className="flex items-center gap-3 py-2">
          <Skeleton className="h-[34px] w-[34px] shrink-0 rounded-lg bg-white/5" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-white/10" />
            <Skeleton className="h-3 w-20 bg-white/5" />
          </div>
        </div>
      </TableCell>
      <TableCell className={COLUMN_WIDTHS[1]}>
        <Skeleton className="h-4 w-24 bg-white/5" />
      </TableCell>
      <TableCell className={COLUMN_WIDTHS[2]}>
        <Skeleton className="h-4 w-16 bg-white/5" />
      </TableCell>
      <TableCell className={COLUMN_WIDTHS[3]}>
        <Skeleton className="h-6 w-20 rounded-full bg-white/5 border border-white/5" />
      </TableCell>
      <TableCell className={COLUMN_WIDTHS[4]}>
        <div className="flex flex-col items-end justify-center">
          <Skeleton className="h-4 w-8 bg-white/10 mb-1" />
          <Skeleton className="h-3 w-14 bg-white/5" />
        </div>
      </TableCell>
    </TableRow>
  ));
}

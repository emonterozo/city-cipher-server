import { Input } from "@/components/ui/input";

export function Pagination({
  page,
  totalPages,
  inputPage,
  inputRef,
  setInputPage,
  setPage,
  limit,
  total,
  label,
}: Readonly<{
  page: number;
  totalPages: number;
  inputPage: number | "";
  inputRef: React.RefObject<HTMLInputElement | null>;
  setInputPage: (v: number | "") => void;
  setPage: (v: number) => void;
  limit: number;
  total: number;
  label: string;
}>) {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-8 py-5 bg-white/[0.02] border-t border-white/5">
      <div className="flex items-center gap-2">
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="text-white font-medium">
            {start}-{end}
          </span>{" "}
          of <span className="text-white font-medium">{total}</span> {label}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setPage(Math.max(1, page - 1));
            setInputPage(Math.max(1, page - 1));
          }}
          className="px-3 py-1.5 text-xs font-semibold text-gray-400 bg-white/[0.04] border border-white/[0.08] rounded-lg hover:border-white/20 hover:text-white disabled:opacity-30 transition-all"
          disabled={page === 1}
        >
          Previous
        </button>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          Page
          <Input
            min={1}
            max={totalPages}
            value={inputPage}
            ref={inputRef}
            onChange={(e) =>
              setInputPage(e.target.value === "" ? "" : Number(e.target.value))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                inputRef?.current?.blur();
                if (inputPage === "" || Number.isNaN(inputPage)) return;
                const val = Math.min(Math.max(inputPage, 1), totalPages);
                setPage(val);
                setInputPage(val);
              }
            }}
            onBlur={() => {
              if (inputPage === "" || Number.isNaN(inputPage)) {
                setInputPage(page);
                return;
              }
              const val = Math.min(Math.max(inputPage, 1), totalPages);
              setPage(val);
              setInputPage(val);
            }}
            className="w-12 h-7 text-center text-xs rounded-lg bg-white/[0.04] border-white/10 text-white focus-visible:border-primary/60 focus-visible:ring-primary/20"
          />
          <span>of {totalPages}</span>
        </div>
        <button
          onClick={() => {
            setPage(Math.min(totalPages, page + 1));
            setInputPage(Math.min(totalPages, page + 1));
          }}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-xs font-semibold text-gray-400 bg-white/[0.04] border border-white/[0.08] rounded-lg hover:border-white/20 hover:text-white disabled:opacity-30 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}

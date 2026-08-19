import {
  ArrowCounterClockwiseIcon,
  CaretDownIcon,
  CaretUpIcon,
  CopyIcon,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import noteEighth from "../assets/icons/note-eighth.svg";
import noteHalf from "../assets/icons/note-half.svg";
import noteQuarter from "../assets/icons/note-quarter.svg";
import noteWhole from "../assets/icons/note-whole.svg";
import { ErrorMessage } from "../components/error-message";
import { IconButton } from "../components/icon-button";
import { Loader } from "../components/loader";
import { PageTitle } from "../components/page-title";
import { SearchBar } from "../components/search-bar";
import { GET, makeQuery } from "../utilities/request-utilities";
import { cn } from "../utilities/style-utilities";

interface SongKey {
  root: string;
  mode: string;
}

type ChartLineKind = "chords" | "functions" | "comment" | "blank";

interface ChartLine {
  text: string;
  kind: ChartLineKind;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  chart: ChartLine[];
  tempo: number | null;
  beatDuration: string | null;
  chordDuration: string | null;
  key: SongKey | null;
}

interface SongsResponse {
  songs: Song[];
}

const NO_KEY_MODULATE_MESSAGE =
  "This song has no key set, so it can't be modulated";

const NO_KEY_FUNCTIONS_MESSAGE =
  "This song has no key set, so its chords have no function to name";

const NOTE_ICONS: Record<string, string> = {
  quarter: noteQuarter,
  half: noteHalf,
  whole: noteWhole,
  eighth: noteEighth,
};

export function ChordsPage() {
  // The selected song and every control live in the URL query string so the
  // page restores exactly where the user left off after a refresh or reload.
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get("search") ?? "";
  const offsetParam = Number.parseInt(searchParams.get("offset") ?? "", 10);
  const offset = Number.isNaN(offsetParam) ? 0 : offsetParam;
  const symbols = searchParams.get("symbols") === "true";
  const functions = searchParams.get("functions") === "true";
  const selectedIdRaw = searchParams.get("id");

  // Hold the latest params in a ref so updateParams can stay a stable
  // reference. SearchBar fires onSubmit from an effect keyed on the callback,
  // so an unstable callback there causes an infinite navigate/render loop.
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const current = searchParamsRef.current;
      const next = new URLSearchParams(current);
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) next.delete(key);
        else next.set(key, value);
      }
      const query = next.toString();
      if (query === current.toString()) return;
      navigate({ search: query ? `?${query}` : "" }, { replace: true });
    },
    [navigate],
  );

  // 0 and both toggles off are the defaults, so they stay out of the URL.
  const setOffset = (value: number) =>
    updateParams({ offset: value === 0 ? null : String(value) });

  const handleSearchSubmit = useCallback(
    (value: string) => updateParams({ search: value || null }),
    [updateParams],
  );

  const [searchText, setSearchText] = useState(search);

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSongs = async () => {
      setLoading(true);
      const params: Record<string, string> = {
        offset: String(offset),
        symbols: String(symbols),
        functions: String(functions),
      };
      if (search) params.search = search;

      try {
        const response = await GET<SongsResponse>(
          makeQuery("chords/songs", params),
        );
        if (cancelled) return;
        setSongs(response.songs);
        setError(null);
      } catch (err) {
        console.error("Failed to load chords:", err);
        if (!cancelled) setError("Failed to load chords");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadSongs();
    return () => {
      cancelled = true;
    };
  }, [search, offset, symbols, functions]);

  // Derive the active selection so it stays valid as the list changes,
  // falling back to the first song when nothing valid is selected.
  const selectedId = useMemo(() => {
    if (songs.length === 0) return null;
    return selectedIdRaw && songs.some((song) => song.id === selectedIdRaw)
      ? selectedIdRaw
      : songs[0].id;
  }, [songs, selectedIdRaw]);

  const selectedSong = useMemo(
    () => songs.find((song) => song.id === selectedId) ?? null,
    [songs, selectedId],
  );

  return (
    <div className="bg-parchment min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <PageTitle>Chords</PageTitle>
          <div className="max-w-xl text-center text-sm text-black/60">
            A small songbook of chord charts.
          </div>
        </div>

        <SearchBar
          text={searchText}
          setText={setSearchText}
          onSubmit={handleSearchSubmit}
          placeholder="Search songs or artists"
          className="w-full max-w-md"
        />

        {error ? (
          <ErrorMessage message={error} className="mt-8" />
        ) : (
          <div className="flex w-full flex-col gap-5 lg:flex-row">
            <SongList
              songs={songs}
              selectedId={selectedId}
              onSelect={(id) => updateParams({ id })}
              loading={loading}
            />

            <div className="flex flex-1 flex-col gap-4 md:flex-row">
              <SongDetail song={selectedSong} loading={loading} />
              <ControlPanel
                song={selectedSong}
                offset={offset}
                onUp={() => setOffset(offset + 1)}
                onDown={() => setOffset(offset - 1)}
                onReset={() => setOffset(0)}
                symbols={symbols}
                onToggleSymbols={() =>
                  updateParams({ symbols: symbols ? null : "true" })
                }
                functions={functions}
                onToggleFunctions={() =>
                  updateParams({ functions: functions ? null : "true" })
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface SongListProps {
  songs: Song[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
}

function SongList({ songs, selectedId, onSelect, loading }: SongListProps) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm lg:w-72 lg:self-start">
      <div className="border-b border-black/10 px-4 py-3 text-sm font-semibold text-black/70">
        {songs.length} {songs.length === 1 ? "song" : "songs"}
      </div>
      <div className="max-h-[30vh] overflow-y-auto lg:max-h-[60vh]">
        {loading && songs.length === 0 ? (
          <div className="px-4 py-6 text-sm text-black/50">Loading&hellip;</div>
        ) : songs.length === 0 ? (
          <div className="px-4 py-6 text-sm text-black/50">
            No songs match your filters.
          </div>
        ) : (
          songs.map((song) => (
            <button
              key={song.id}
              onClick={() => onSelect(song.id)}
              className={cn(
                "flex w-full cursor-pointer flex-col items-start gap-0.5 border-b border-black/5 px-4 py-2.5 text-left transition-colors last:border-b-0",
                song.id === selectedId
                  ? "bg-sky/10"
                  : "hover:bg-dark-parchment",
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  song.id === selectedId ? "text-royal" : "text-black/80",
                )}
              >
                {song.title}
              </span>
              <span className="text-xs text-black/50">{song.artist}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

interface ControlPanelProps {
  song: Song | null;
  offset: number;
  onUp: () => void;
  onDown: () => void;
  onReset: () => void;
  symbols: boolean;
  onToggleSymbols: () => void;
  functions: boolean;
  onToggleFunctions: () => void;
}

function ControlPanel({
  song,
  offset,
  onUp,
  onDown,
  onReset,
  symbols,
  onToggleSymbols,
  functions,
  onToggleFunctions,
}: ControlPanelProps) {
  // A chord is spelled by the function it serves in a key, so the backend only
  // transposes songs that declare one.
  const canModulate = song?.key != null;

  // The offset is a page-wide setting, so for a song that cannot be modulated
  // it reads as "-" rather than a number the chords below do not reflect.
  const offsetLabel = !canModulate
    ? "\u2013"
    : offset > 0
      ? `+${offset}`
      : String(offset);
  const resetDisabled = !canModulate || offset === 0;

  return (
    <div className="mb-4 flex w-full flex-none flex-col items-stretch justify-center gap-4 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm md:mb-0 md:w-28 md:self-start md:px-2 md:py-5">
      <div className="flex flex-row flex-wrap items-center justify-center gap-3 md:flex-col">
        <div
          className={cn(
            "order-1 text-xs font-semibold tracking-wide uppercase md:order-0",
            canModulate ? "text-black/50" : "text-black/25",
          )}
        >
          Modulate
        </div>

        <button
          onClick={onUp}
          disabled={!canModulate}
          title={
            canModulate ? "Modulate up a semitone" : NO_KEY_MODULATE_MESSAGE
          }
          className={cn(
            "order-4 flex h-10 w-10 items-center justify-center rounded-full transition-colors md:order-0",
            canModulate
              ? "bg-sky hover:bg-royal cursor-pointer text-white"
              : "cursor-default bg-black/10 text-black/30",
          )}
        >
          <CaretUpIcon size={22} weight="bold" />
        </button>

        <div className="order-3 flex flex-col items-center md:order-0">
          <span
            className={cn(
              "font-sanchez text-3xl",
              canModulate ? "text-black/80" : "text-black/30",
            )}
          >
            {offsetLabel}
          </span>
          <span
            className={cn(
              "text-[10px] tracking-wide uppercase",
              canModulate ? "text-black/45" : "text-black/25",
            )}
          >
            semitones
          </span>
        </div>

        <button
          onClick={onDown}
          disabled={!canModulate}
          title={
            canModulate ? "Modulate down a semitone" : NO_KEY_MODULATE_MESSAGE
          }
          className={cn(
            "order-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors md:order-0",
            canModulate
              ? "bg-sky hover:bg-royal cursor-pointer text-white"
              : "cursor-default bg-black/10 text-black/30",
          )}
        >
          <CaretDownIcon size={22} weight="bold" />
        </button>

        <button
          onClick={onReset}
          disabled={resetDisabled}
          title={canModulate ? "Reset modulation" : NO_KEY_MODULATE_MESSAGE}
          className={cn(
            "order-5 flex flex-row items-center gap-1 text-xs transition-colors md:order-0",
            resetDisabled
              ? "cursor-default text-black/25"
              : "text-sky hover:text-royal cursor-pointer",
          )}
        >
          <ArrowCounterClockwiseIcon size={13} weight="bold" />
          Reset
        </button>

        {song !== null && !canModulate && (
          <div className="order-6 text-center text-[10px] leading-tight text-black/35 md:order-0">
            No key set
          </div>
        )}
      </div>

      <div className="h-px w-full bg-black/10" />

      <div className="flex flex-row flex-wrap items-start justify-center gap-4 md:flex-col md:items-stretch">
        <Toggle
          label="Symbols"
          on={symbols}
          onToggle={onToggleSymbols}
          title="Toggle sharp/flat symbols"
        />

        <Toggle
          label="Functions"
          on={functions}
          onToggle={onToggleFunctions}
          disabled={!canModulate}
          title={
            canModulate
              ? "Label each line with its functional analysis"
              : NO_KEY_FUNCTIONS_MESSAGE
          }
        />
      </div>
    </div>
  );
}

interface ToggleProps {
  label: string;
  on: boolean;
  onToggle: () => void;
  title: string;
  disabled?: boolean;
}

function Toggle({ label, on, onToggle, title, disabled }: ToggleProps) {
  // A disabled toggle reads as off whatever the page-wide setting happens to
  // be, so it matches the chords shown beside it.
  const checked = on && !disabled;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={cn(
          "text-xs font-semibold tracking-wide uppercase",
          disabled ? "text-black/25" : "text-black/50",
        )}
      >
        {label}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={onToggle}
        title={title}
        className={cn(
          "relative inline-block h-6 w-11 flex-none rounded-full transition-colors",
          disabled
            ? "cursor-default bg-black/10"
            : cn("cursor-pointer", checked ? "bg-sky" : "bg-black/20"),
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full shadow-sm transition-transform",
            disabled ? "bg-white/60" : "bg-white",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}

interface SongDetailProps {
  song: Song | null;
  loading: boolean;
}

// A function line describes the chord line right under it, so the two are
// drawn as one block with the surrounding lines pushed away from the pair.
interface ChartBlock {
  functions: string | null;
  text: string;
  kind: ChartLineKind;
}

function toBlocks(chart: ChartLine[]): ChartBlock[] {
  const blocks: ChartBlock[] = [];
  let functions: string | null = null;
  for (const line of chart) {
    if (line.kind === "functions") {
      functions = line.text;
      continue;
    }
    blocks.push({ functions, text: line.text, kind: line.kind });
    functions = null;
  }
  return blocks;
}

function SongDetail({ song, loading }: SongDetailProps) {
  const chart = song?.chart ?? [];
  const blocks = useMemo(() => toBlocks(song?.chart ?? []), [song]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        chart
          .map((line) => line.text)
          .join("\n")
          .trimEnd(),
      );
      toast.success("Copied to clipboard!", {
        duration: 2000,
        position: "top-right",
      });
    } catch (err) {
      console.error("Failed to copy chords: ", err);
    }
  };

  if (!song) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-xl border border-black/10 bg-white py-20 shadow-sm">
        {loading ? (
          <Loader text="Loading chords" />
        ) : (
          <div className="text-sm text-black/50">
            Select a song to see its chords.
          </div>
        )}
      </div>
    );
  }

  const noteIcon = NOTE_ICONS[song.beatDuration ?? "quarter"] ?? noteQuarter;

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-xl border border-black/10 bg-white p-5 shadow-sm md:p-7">
      <div className="flex flex-col items-center gap-1 text-center md:items-start md:text-left">
        <h1 className="font-sanchez text-2xl text-balance text-black/85 md:text-4xl">
          {song.title}
        </h1>
        <div className="text-lg text-balance text-black/55 md:text-xl">
          {song.artist}
        </div>
      </div>

      {(song.tempo !== null || song.key) && (
        <div className="flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2 border-y border-black/10 py-3 md:justify-start">
          {song.tempo !== null && (
            <div className="flex flex-row items-center gap-0" title="Tempo">
              <img
                src={noteIcon}
                alt={song.beatDuration ?? "quarter"}
                className="h-7 w-7"
              />
              <span className="font-sanchez text-xl text-black/75">
                = {song.tempo}
              </span>
            </div>
          )}
          {song.key && (
            <div className="text-sm text-black/55">
              Key of{" "}
              <span className="font-medium text-black/75">
                {song.key.root} {song.key.mode}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="font-geist bg-dark-parchment h-[340px] w-full overflow-auto rounded-lg border border-black/10 p-3 text-sm tracking-wide whitespace-pre text-black/80 md:p-4 md:text-xl">
        {blocks.map((block, index) =>
          block.kind === "blank" ? (
            <div key={index} className="h-4" />
          ) : (
            <div key={index} className="mb-4 leading-snug last:mb-0">
              {block.functions !== null && (
                <div className="text-royal/50">{block.functions}</div>
              )}
              <div className={cn(block.kind === "comment" && "text-black/40")}>
                {block.text}
              </div>
            </div>
          ),
        )}
      </div>

      <IconButton onClick={onCopy} className="self-center md:self-end">
        <CopyIcon size={20} weight="duotone" color="#6283c0" />
        <span className="text-md">Copy</span>
      </IconButton>
    </div>
  );
}

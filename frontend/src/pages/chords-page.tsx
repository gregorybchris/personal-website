import {
  ArrowCounterClockwiseIcon,
  CaretDownIcon,
  CaretUpIcon,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import noteEighth from "../assets/icons/note-eighth.svg";
import noteHalf from "../assets/icons/note-half.svg";
import noteQuarter from "../assets/icons/note-quarter.svg";
import noteWhole from "../assets/icons/note-whole.svg";
import { ErrorMessage } from "../components/error-message";
import { Loader } from "../components/loader";
import { PageTitle } from "../components/page-title";
import { SearchBar } from "../components/search-bar";
import { GET, makeQuery } from "../utilities/request-utilities";
import { cn } from "../utilities/style-utilities";

interface SongKey {
  root: string;
  mode: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  chords: string;
  tempo: number | null;
  beatDuration: string | null;
  chordDuration: string | null;
  key: SongKey | null;
}

interface SongsResponse {
  songs: Song[];
}

const NOTE_ICONS: Record<string, string> = {
  quarter: noteQuarter,
  half: noteHalf,
  whole: noteWhole,
  eighth: noteEighth,
};

export function ChordsPage() {
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);

  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedIdRaw, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSongs = async () => {
      setLoading(true);
      const params: Record<string, string> = { offset: String(offset) };
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
  }, [search, offset]);

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
          onSubmit={setSearch}
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
              onSelect={setSelectedId}
              loading={loading}
            />

            <div className="flex flex-1 flex-col gap-4 md:flex-row">
              <SongDetail song={selectedSong} loading={loading} />
              <ModulationPanel
                offset={offset}
                onUp={() => setOffset((value) => value + 1)}
                onDown={() => setOffset((value) => value - 1)}
                onReset={() => setOffset(0)}
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
    <div className="flex w-full flex-col rounded-xl border border-black/10 bg-white shadow-sm lg:w-72">
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

interface ModulationPanelProps {
  offset: number;
  onUp: () => void;
  onDown: () => void;
  onReset: () => void;
}

function ModulationPanel({
  offset,
  onUp,
  onDown,
  onReset,
}: ModulationPanelProps) {
  const offsetLabel = offset > 0 ? `+${offset}` : String(offset);

  return (
    <div className="mb-4 flex w-full flex-none flex-row items-center justify-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm md:mb-0 md:w-28 md:flex-col md:px-2 md:py-5">
      <div className="order-1 text-xs font-semibold tracking-wide text-black/50 uppercase md:order-0">
        Modulate
      </div>

      <button
        onClick={onUp}
        title="Modulate up a semitone"
        className="bg-sky hover:bg-royal order-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white transition-colors md:order-0"
      >
        <CaretUpIcon size={22} weight="bold" />
      </button>

      <div className="order-3 flex flex-col items-center md:order-0">
        <span className="font-sanchez text-3xl text-black/80">
          {offsetLabel}
        </span>
        <span className="text-[10px] tracking-wide text-black/45 uppercase">
          semitones
        </span>
      </div>

      <button
        onClick={onDown}
        title="Modulate down a semitone"
        className="bg-sky hover:bg-royal order-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white transition-colors md:order-0"
      >
        <CaretDownIcon size={22} weight="bold" />
      </button>

      <button
        onClick={onReset}
        disabled={offset === 0}
        title="Reset modulation"
        className={cn(
          "order-5 flex flex-row items-center gap-1 text-xs transition-colors md:order-0",
          offset === 0
            ? "cursor-default text-black/25"
            : "text-sky hover:text-royal cursor-pointer",
        )}
      >
        <ArrowCounterClockwiseIcon size={13} weight="bold" />
        Reset
      </button>
    </div>
  );
}

interface SongDetailProps {
  song: Song | null;
  loading: boolean;
}

function SongDetail({ song, loading }: SongDetailProps) {
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
              <span className="font-sanchez text-2xl text-black/75">
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

      <textarea
        readOnly
        value={song.chords.trimEnd()}
        className="font-geist bg-dark-parchment h-[340px] w-full resize-none rounded-lg border border-black/10 p-3 text-sm leading-[2.25] tracking-wide text-black/80 outline-none md:p-4 md:text-xl"
      />
    </div>
  );
}

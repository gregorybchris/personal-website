import "../styles/common.css";

interface FeedSearchBarProps {
  searchText: string;
  onUpdateSearch: (e: any) => void;
  onClearSearch: () => void;
}

export function FeedSearchBar({
  searchText,
  onUpdateSearch,
  onClearSearch,
}: FeedSearchBarProps) {
  return (
    <div className="min-w-[340px]">
      <input
        className="Common-text-field inline-block w-[270px] align-top"
        type="text"
        value={searchText}
        onChange={onUpdateSearch}
        placeholder="Filter posts"
      />
      <div
        className="Common-button ml-1 inline-block align-top"
        onClick={onClearSearch}
      >
        Clear
      </div>
    </div>
  );
}

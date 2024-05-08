import "../styles/common.css";

interface TiktoksSearchBarProps {
  searchText: string;
  setSearchText: (searchText: string) => void;
  onSubmit: () => void;
  updateQuery: (query: string) => void;
}

export function TiktoksSearchBar({
  searchText,
  setSearchText,
  onSubmit,
  updateQuery,
}: TiktoksSearchBarProps) {
  return (
    <div className="min-w-[240px]">
      <input
        className="Common-text-field inline-block w-[200px] align-top"
        type="text"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="Query"
      />
      <div
        className="Common-button ml-1 inline-block align-top"
        onClick={onSubmit}
      >
        Search
      </div>
      <div
        className="Common-button ml-1 inline-block align-top"
        onClick={() => updateQuery("")}
      >
        Clear
      </div>
    </div>
  );
}

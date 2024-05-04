import "../styles/common.css";

interface TiktoksSearchBarProps {
  searchText: string;
  onUpdateSearch: (e: any) => void;
  onSubmit: () => void;
}

export function TiktoksSearchBar({
  searchText,
  onUpdateSearch,
  onSubmit,
}: TiktoksSearchBarProps) {
  return (
    <div className="min-w-[240px]">
      <input
        className="Common-text-field inline-block w-[200px] align-top"
        type="text"
        value={searchText}
        onChange={onUpdateSearch}
        placeholder="Query"
      />
      <div
        className="Common-button ml-1 inline-block align-top"
        onClick={onSubmit}
      >
        Search
      </div>
    </div>
  );
}

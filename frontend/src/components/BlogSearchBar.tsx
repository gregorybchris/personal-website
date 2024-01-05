import "../styles/common.css";

interface BlogSearchBarProps {
  searchText: string;
  onUpdateSearch: (e: any) => void;
  onClearSearch: () => void;
}

export function BlogSearchBar(props: BlogSearchBarProps) {
  return (
    <div className="min-w-[340px]">
      <input
        className="Common-text-field inline-block w-[270px] align-top"
        type="text"
        value={props.searchText}
        onChange={props.onUpdateSearch}
        placeholder="Filter posts"
      />
      <div
        className="Common-button ml-1 inline-block align-top"
        onClick={props.onClearSearch}
      >
        Clear
      </div>
    </div>
  );
}

import "./styles/SearchBar.sass";

interface SearchBarProps {
  searchText: string;
  onUpdateSearch: (e: any) => void;
  onClearSearch: () => void;
}

export default function SearchBar(props: SearchBarProps) {
  return (
    <div className="SearchBar">
      <input
        className="Common-text-field SearchBar-input"
        type="text"
        value={props.searchText}
        onChange={props.onUpdateSearch}
        placeholder="Filter posts"
      />
      <div className="Common-button SearchBar-clear-button" onClick={props.onClearSearch}>
        Clear
      </div>
    </div>
  );
}

import "../styles/common.css";
import { Button } from "./button";
import { TextBox } from "./text-box";

interface MediaSearchBarProps {
  searchText: string;
  setSearchText: (searchText: string) => void;
  onSubmit: () => void;
  updateQuery: (query: string) => void;
}

export function MediaSearchBar({
  searchText,
  setSearchText,
  onSubmit,
  updateQuery,
}: MediaSearchBarProps) {
  return (
    <div className="flex flex-row gap-1">
      <TextBox
        className="w-[200px]"
        value={searchText}
        onChange={(text) => setSearchText(text)}
        placeholder="Query"
      />

      <Button text="Search" onClick={onSubmit} />

      <Button text="Clear" onClick={() => updateQuery("")} />
    </div>
  );
}

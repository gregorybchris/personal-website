import React from "react";

import "./SearchBar.sass";
import "../common/Common.sass";

export interface SearchBarProps {
  searchText: string;
  onUpdateSearch: (e: any) => void;
  onClearSearch: () => void;
}

export interface SearchBarState {}

class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  render() {
    return (
      <div className="SearchBar">
        <input
          className="SearchBar-input Common-text-field"
          type="text"
          value={this.props.searchText}
          onChange={this.props.onUpdateSearch}
          placeholder="Filter posts"
        />
        <div
          className="SearchBar-clear-button Common-button"
          onClick={this.props.onClearSearch}
        >
          Clear
        </div>
      </div>
    );
  }
}

export default SearchBar;

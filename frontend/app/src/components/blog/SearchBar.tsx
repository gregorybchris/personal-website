import React from "react";

import "./styles/SearchBar.sass";

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
          className="Common-text-field SearchBar-input"
          type="text"
          value={this.props.searchText}
          onChange={this.props.onUpdateSearch}
          placeholder="Filter posts"
        />
        <div
          className="Common-button SearchBar-clear-button"
          onClick={this.props.onClearSearch}
        >
          Clear
        </div>
      </div>
    );
  }
}

export default SearchBar;

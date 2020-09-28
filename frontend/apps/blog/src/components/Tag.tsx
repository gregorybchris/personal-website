import React from "react";
import "./Tag.css";

export interface TagProps {
  text: string;
  onClickTag: (tag: string) => void;
}

export interface TagState {}

class Tag extends React.Component<TagProps, TagState> {
  render() {
    return (
      <div
        className="Tag"
        onClick={() => this.props.onClickTag(this.props.text)}
      >
        <span className="Tag-text">#{this.props.text}</span>
      </div>
    );
  }
}

export default Tag;

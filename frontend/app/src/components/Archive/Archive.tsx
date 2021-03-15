import React from "react";

import { makeQuery, GET } from "../../utilities/RequestUtilities";
import ArchiveItemModel from "./models/ArchiveItem";

import "./styles/Archive.sass";

interface ArchiveProps {}

interface ArchiveState {
  items: ArchiveItemModel[];
}

class Archive extends React.Component<ArchiveProps, ArchiveState> {
  state = {
    items: [],
  };

  async componentDidMount() {
    const query = makeQuery("archive");
    const items = await GET(query);
    this.setState({ items: items });
  }

  createImage = (imageUrl: string) => {
    return <img className="Archive-item-image" src={imageUrl} key={imageUrl} alt="Archive screenshot"></img>;
  };

  createItem = (itemModel: ArchiveItemModel) => {
    const date = new Date(itemModel.date);
    const year = date.getFullYear();

    return (
      <div className="Archive-item" key={itemModel.version}>
        <div className="Archive-item-details">
          <div className="Archive-item-version">ChrisOffline v{itemModel.version}</div>
          <div className="Archive-item-date">{year}</div>
        </div>
        <div className="Archive-item-images">{itemModel.image_links.map((imageUrl) => this.createImage(imageUrl))}</div>
      </div>
    );
  };

  render() {
    return (
      <div className="Archive">
        <div className="Archive-header">
          <div className="Archive-title">Archive</div>
          <div className="Archive-about">The archive off all old versions of my personal website.</div>
        </div>
        <div className="Archive-items">{this.state.items.map((item) => this.createItem(item))}</div>
      </div>
    );
  }
}

export default Archive;

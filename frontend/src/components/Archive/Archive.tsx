import "./styles/Archive.sass";

import { GET, makeQuery } from "../../utilities/requestUtilities";
import { useEffect, useState } from "react";

import ArchiveItemModel from "./models/ArchiveItem";

export default function Archive() {
  const [items, setItems] = useState<ArchiveItemModel[]>([]);

  useEffect(() => {
    const query = makeQuery("archive");
    GET(query).then((items) => {
      setItems(items);
    });
  }, []);

  function createImage(imageUrl: string) {
    return <img className="Archive-item-image" src={imageUrl} key={imageUrl} alt="Archive screenshot" />;
  }

  function createItem(itemModel: ArchiveItemModel) {
    const date = new Date(itemModel.date);
    const year = date.getFullYear();

    return (
      <div className="Archive-item" key={itemModel.version}>
        <div className="Archive-item-details">
          <div className="Archive-item-version">ChrisOffline v{itemModel.version}</div>
          <div className="Archive-item-date">{year}</div>
        </div>
        <div className="Archive-item-images">{itemModel.image_links.map((imageUrl) => createImage(imageUrl))}</div>
      </div>
    );
  }

  return (
    <div className="Archive">
      <div className="Archive-header">
        <div className="Archive-title">Archive</div>
        <div className="Archive-about">The archive for previous encarnations of this website.</div>
      </div>
      <div className="Archive-items">{items.map((item) => createItem(item))}</div>
    </div>
  );
}

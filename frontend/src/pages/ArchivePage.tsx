import { GET, makeQuery } from "../utilities/requestUtilities";
import { useEffect, useState } from "react";

import { ArchiveItem as ArchiveItemModel } from "../models/archiveModels";

export function ArchivePage() {
  const [items, setItems] = useState<ArchiveItemModel[]>([]);

  useEffect(() => {
    const query = makeQuery("archive");
    GET(query).then((items) => {
      setItems(items);
    });
  }, []);

  return (
    <div className="px-3 md:px-8 py-8">
      <div className="w-[80%] mx-auto text-center pb-5">
        <div className="font-noto text-text-1 text-3xl font-bold block pb-3">Archive</div>
        <div className="font-raleway text-text-1 block w-[80%] mx-auto py-3">
          The archive for previous incarnations of this website.
        </div>
      </div>
      <div>
        {items.map((item) => (
          <ArchiveItem key={item.version} archiveItem={item} />
        ))}
      </div>
    </div>
  );
}

interface ArchiveItemProps {
  archiveItem: ArchiveItemModel;
}

function ArchiveItem({ archiveItem }: ArchiveItemProps) {
  const date = new Date(archiveItem.date);
  const year = date.getFullYear();

  return (
    <div>
      <div className="font-raleway text-center">
        <div className="text-text-1 font-noto font-bold text-xl">ChrisOffline v{archiveItem.version}</div>
        <div className="text-md">{year}</div>
      </div>
      <div className="text-center">
        {archiveItem.image_links.map((imageUrl) => (
          <img
            className="w-[90%] md:w-[70%] block my-5 mx-auto shadow-[0_0_6px_2px_rgba(0,0,0,0.3)]"
            src={imageUrl}
            key={imageUrl}
            alt="Archive screenshot"
          />
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { GET, makeQuery } from "../utilities/requestUtilities";

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
    <div className="px-3 py-8 md:px-8">
      <div className="mx-auto w-[80%] pb-5 text-center">
        <div className="block pb-3 font-noto text-3xl font-bold text-text-1">
          Archive
        </div>
        <div className="mx-auto block w-[80%] py-3 font-raleway text-text-1">
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
      <div className="text-center font-raleway">
        <div className="font-noto text-xl font-bold text-text-1">
          ChrisOffline v{archiveItem.version}
        </div>
        <div className="text-md">{year}</div>
      </div>
      <div className="text-center">
        {archiveItem.image_links.map((imageUrl) => (
          <img
            className="mx-auto my-5 block w-[90%] shadow-[0_0_6px_2px_rgba(0,0,0,0.3)] md:w-[70%]"
            src={imageUrl}
            key={imageUrl}
            alt="Archive screenshot"
          />
        ))}
      </div>
    </div>
  );
}

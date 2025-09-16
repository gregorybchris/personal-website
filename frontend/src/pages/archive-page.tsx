import { useEffect, useState } from "react";
import { GET, makeQuery } from "../utilities/request-utilities";

export interface ArchiveItem {
  version: number;
  date: string;
  image_links: string[];
}

export function ArchivePage() {
  const [items, setItems] = useState<ArchiveItem[]>([]);

  useEffect(() => {
    const query = makeQuery("archive");
    GET(query).then((items) => {
      setItems(items);
    });
  }, []);

  return (
    <div className="px-3 py-8 md:px-8">
      <div className="mx-auto w-[80%] pb-5 text-center">
        <div className="block pb-3 font-sanchez text-3xl text-black/75">
          Archive
        </div>
        <div className="mx-auto block w-[80%] py-3 text-black/75">
          The archive for previous incarnations of this website.
        </div>
      </div>
      <div>
        {items.map((item) => (
          <ArchiveSection key={item.version} archiveItem={item} />
        ))}
      </div>
    </div>
  );
}

interface ArchiveSectionProps {
  archiveItem: ArchiveItem;
}

function ArchiveSection({ archiveItem }: ArchiveSectionProps) {
  const date = new Date(archiveItem.date);
  const year = date.getFullYear();

  return (
    <div>
      <div className="text-center">
        <div className="font-sanchez text-xl text-black/75">
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
